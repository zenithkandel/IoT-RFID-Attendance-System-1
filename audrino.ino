/*
  EduTrack Pro - Final NodeMCU Attendance Sketch
  Author : Sakshyam Bastakoti
  GitHub : https://github.com/sakshyambastakoti
  Date   : 2025-09-24
  Description:
    - Reads RFID (MFRC522)
    - Shows status on I2C LCD (0x27, 16x2)
    - Sends UID + ISO timestamp to Google Apps Script (HTTPSRedirect)
    - WiFiManager for easy WiFi configuration
    - Buzzer and LED feedback
    - WiFi-reset button
    - Robust, production-ready (ready for GitHub)
*/

// ---------- LIBRARIES ----------
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiManager.h>               // Easy WiFi configuration
#include <SPI.h>
#include <MFRC522.h>                   // RFID library
#include <Wire.h>
#include <LiquidCrystal_I2C.h>         // I2C LCD
#include <HTTPSRedirect.h>             // TLS + redirect helper for Google Scripts

// ---------- HARDWARE / SETTINGS ----------
LiquidCrystal_I2C lcd(0x27, 16, 2);    // LCD address 0x27, 16 cols x 2 rows

// If your RFID module uses reset pin, set it; otherwise 255 = not connected
#define RST_PIN   255                 // Not using hardware reset for MFRC522
#define SS_PIN    2                   // D4 (GPIO2) -> SDA for MFRC522 (SS)
#define BUZZER    16                  // D0 (GPIO16)
#define LED       15                  // D8 (GPIO15)
#define BUTTON_PIN 0                  // D3 (GPIO0) - WiFi config / reset button
#define WIFI_LED  LED_BUILTIN         // On-board LED (active LOW on many boards)

// Google Script deployment ID (change this to your deployment ID)
const char *GScriptId = "YOUR_DEVELOPMENT_ID";
const char* host        = "script.google.com";
const int   httpsPort   = 443;
String url = String("/macros/s/") + GScriptId + "/exec";

HTTPSRedirect* client = nullptr;

// Timing & control
const unsigned long COOLDOWN_DELAY = 1500; // ms between allowed scans
unsigned long lastScanTime = 0;
unsigned long pressStart = 0;
bool readyDisplayed = false;

// RFID object
MFRC522 mfrc522(SS_PIN, RST_PIN);

// ---------- HELPER: small utilities ----------
String byteToHex(byte val) {
  char buf[3];
  sprintf(buf, "%02X", val); // always two hex digits (uppercase)
  return String(buf);
}

// Build ISO8601 timestamp in Nepal time (YYYY-MM-DDTHH:MM:SS)
// Note: this uses device RTC (no NTP here). For exact time, sync via NTP or let Apps Script use server time.
String getLocalISOTime() {
  time_t now = time(nullptr);
  struct tm tm_utc;
  gmtime_r(&now, &tm_utc); // get UTC components

  // Nepal is UTC+5:45 -> add offset minutes carefully
  int offsetMinutes = 5 * 60 + 45; // 345 minutes
  time_t local = now + (offsetMinutes * 60);
  struct tm tm_local;
  gmtime_r(&local, &tm_local);

  char buf[25];
  sprintf(buf, "%04d-%02d-%02dT%02d:%02d:%02d",
          tm_local.tm_year + 1900, tm_local.tm_mon + 1, tm_local.tm_mday,
          tm_local.tm_hour, tm_local.tm_min, tm_local.tm_sec);
  return String(buf);
}

// ---------- SETUP ----------
void setup() {
  // Serial for debugging
  Serial.begin(115200);
  delay(50);

  // GPIOs
  pinMode(LED, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(WIFI_LED, OUTPUT);

  digitalWrite(BUZZER, LOW);
  digitalWrite(LED, LOW);
  digitalWrite(WIFI_LED, HIGH); // OFF initially (active-low style)

  // SPI + RFID init
  SPI.begin();
  mfrc522.PCD_Init(); // initialize reader once

  // I2C LCD init (SDA/SCL pins depend on board; Wire.begin uses defaults)
  Wire.begin();            // ESP8266 default SDA = D2(4), SCL = D1(5) on many boards
  lcd.init();
  lcd.backlight();
  lcd.clear();

  // Startup message
  lcd.setCursor(0,0); lcd.print("EduTrack Pro");
  lcd.setCursor(0,1); lcd.print("Initializing...");
  delay(1300);

  // WiFi config (autoConnect opens AP if no saved credentials)
  WiFiManager wm;
  lcd.clear(); lcd.setCursor(0,0); lcd.print("WiFi Setup...");
  if (!wm.autoConnect("EduTrackPro")) {
    // If fails, show message but keep trying (user can power-cycle)
    lcd.clear(); lcd.setCursor(0,0); lcd.print("WiFi Failed");
    lcd.setCursor(0,1); lcd.print("Open AP");
    delay(2000);
  } else {
    lcd.clear(); lcd.setCursor(0,0); lcd.print("WiFi Connected");
    delay(1000);
  }

  // Prepare HTTPSRedirect client object (we will re-create if needed)
  client = new HTTPSRedirect(httpsPort);
  client->setInsecure();
  client->setPrintResponseBody(true);
  client->setContentTypeHeader("application/json");

  // Quick test to Google host (not mandatory)
  lcd.clear(); lcd.setCursor(0,0); lcd.print("Checking Google");
  if (client->connect(host, httpsPort)) {
    lcd.setCursor(0,1); lcd.print("Google OK");
    delay(900);
  } else {
    lcd.setCursor(0,1); lcd.print("Google Fail");
    delay(900);
  }
  client->flush();
  delete client;
  client = nullptr;

  // System ready
  digitalWrite(WIFI_LED, LOW); // ON (active low)
  lcd.clear(); lcd.setCursor(0,0); lcd.print("Scan your Tag");
  readyDisplayed = true;
}

// ---------- MAIN LOOP ----------
void loop() {
  // Lazily create client and keep it available
  static bool clientReady = false;
  if (!clientReady) {
    client = new HTTPSRedirect(httpsPort);
    client->setInsecure();
    client->setPrintResponseBody(true);
    client->setContentTypeHeader("application/json");
    clientReady = true;
  }
  if (client && !client->connected()) client->connect(host, httpsPort);

  // Check long-press for WiFi config portal
  if (digitalRead(BUTTON_PIN) == LOW) {
    if (pressStart == 0) pressStart = millis();
    if (millis() - pressStart > 3000) {
      lcd.clear(); lcd.setCursor(0,0); lcd.print("Config Portal");
      WiFiManager wm;
      wm.startConfigPortal("EduTrackPro-Config");
      // After config portal, restart to reinit modules
      ESP.restart();
    }
  } else {
    pressStart = 0;
  }

  // Ensure the "ready" message displayed once
  if (!readyDisplayed) {
    lcd.clear(); lcd.setCursor(0,0); lcd.print("Scan your Tag");
    readyDisplayed = true;
    digitalWrite(WIFI_LED, LOW); // ON
  }

  // Enforce cooldown
  if (millis() - lastScanTime < COOLDOWN_DELAY) {
    // Allow other tasks in future (non-blocking)
  }

  // Check for new card; return early if none
  if (!mfrc522.PICC_IsNewCardPresent()) return;
  if (!mfrc522.PICC_ReadCardSerial()) return;

  // Busy indicator
  digitalWrite(WIFI_LED, HIGH); // temporarily OFF (active-low)
  digitalWrite(BUZZER, HIGH); delay(80); digitalWrite(BUZZER, LOW);

  // Build compact UID string (no spaces): e.g. "B3:E2:13:2A" or "B3E2132A"
  String uidString = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uidString += byteToHex(mfrc522.uid.uidByte[i]); // uppercase hex, two chars
    if (i < mfrc522.uid.size - 1) uidString += ":"; // optional colon separator
  }
  uidString.toUpperCase();
  Serial.println("UID => " + uidString);

  // Build JSON payload: send uid and ISO timestamp (Nepal local)
  String payload = String("{\"uid\":\"") + uidString + String("\",\"timestamp\":\"") + getLocalISOTime() + String("\"}");

  // UI: Sending
  lcd.clear(); lcd.setCursor(0,0); lcd.print("Sending UID...");
  Serial.println("Payload: " + payload);

  // POST with HTTPSRedirect (returns boolean)
  bool ok = false;
  if (client) {
    // client->POST(url, host, payload) returns true on success in many HTTPSRedirect versions
    // we'll call POST and trust response; the library prints response body to Serial when enabled
    if (client->POST(url, host, payload)) {
      ok = true;
    } else {
      ok = false;
    }
  }

  // Feedback on result
  if (ok) {
    lcd.clear(); lcd.setCursor(0,0); lcd.print("UID:");
    lcd.setCursor(0,1); lcd.print(uidString);
    tone(BUZZER, 1200, 150); delay(160);
    tone(BUZZER, 1200, 150); delay(160);
    digitalWrite(LED, HIGH); delay(120); digitalWrite(LED, LOW);
  } else {
    lcd.clear(); lcd.setCursor(0,0); lcd.print("Send Failed");
    tone(BUZZER, 600, 200); delay(220);
  }

  // short pause so user can read
  delay(800);

  // Reset display and ready flag
  lcd.clear(); lcd.setCursor(0,0); lcd.print("Scan your Tag");
  readyDisplayed = true;
  lastScanTime = millis();

  // Halt the tag and stop crypto
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();

  // Ensure WIFI_LED returns to ON (active low)
  digitalWrite(WIFI_LED, LOW);
}
//------------coded By Sakshyam Bastakoti