# EDU TRACK PRO - IoT-Based RFID Smart Attendance System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PHP](https://img.shields.io/badge/PHP-8.0+-777BB4?logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Arduino](https://img.shields.io/badge/Arduino-ESP8266-00979D?logo=arduino&logoColor=white)](https://www.arduino.cc/)

A production-ready IoT-based smart attendance management system that uses RFID technology to automate student attendance tracking with real-time analytics and comprehensive reporting.

## 🌟 Features

### 🔐 Dual User Roles
- **Admin Panel**: Complete system management with analytics dashboard
- **Student Portal**: Personal attendance tracking with calendar view

### 📊 Key Capabilities
- ✅ Real-time check-in/check-out tracking
- ✅ Automatic IN/OUT detection (First scan=IN, Second=OUT)
- ✅ Beautiful card-based UI with search functionality
- ✅ Interactive charts and analytics (Chart.js)
- ✅ Calendar-based attendance visualization
- ✅ Export reports (CSV, Excel)
- ✅ Password management system
- ✅ Dark/Light theme support
- ✅ Mobile-responsive design
- ✅ RFID testing simulator
- ✅ Nepal timezone support (GMT+5:45)

## 🛠️ Tech Stack

### Hardware
- **ESP8266 NodeMCU** - Wi-Fi enabled microcontroller
- **MFRC522 RFID Reader** - 13.56MHz RFID module
- **16x2 LCD Display** - I2C interface (0x27)
- **Active Buzzer** - Audio feedback
- **LED Indicator** - Visual feedback
- **MIFARE RFID Cards/Tags**

### Firmware
- **Arduino C++** with ESP8266 libraries
- **WiFiManager** - Auto Wi-Fi configuration
- **ESP8266HTTPClient** - API communication
- **MFRC522** - RFID card reading
- **LiquidCrystal_I2C** - LCD display control

### Backend
- **PHP 8.0+** - Server-side logic
- **MySQL/MariaDB** - Database management
- **XAMPP** - Development server (Apache + MySQL)
- **Bcrypt** - Password hashing

### Frontend
- **HTML5, CSS3, JavaScript ES6+**
- **Chart.js** - Data visualization
- **Font Awesome 6.4.0** - Icons
- **Google Fonts** - Inter, Space Grotesk

## 📁 Project Structure

```
IoT-RFID-Attendance-System-/
├── index.html                  # Landing page
├── login.html                  # Authentication page
├── admin-dashboard.html        # Admin control panel
├── student-dashboard.html      # Student portal
├── test-rfid.html             # RFID simulator
├── audrino.ino                # ESP8266 firmware
├── edutrack.sql               # Database schema
├── structure.txt              # Detailed documentation
│
├── API/                       # Backend APIs
│   ├── README.md              # API documentation
│   ├── conn.php               # Database connection
│   ├── rfid-checkin.php       # Check-in/out handler
│   ├── fetch-student.php      # Student data retrieval
│   ├── fetch-attendance.php   # Attendance records
│   ├── login.php              # Authentication
│   ├── add-student.php        # Add new student
│   ├── update-student.php     # Edit student info
│   ├── delete-student.php     # Remove student
│   └── change-password.php    # Password update
│
├── css/                       # Stylesheets
│   ├── style.css              # Global styles
│   ├── login.css              # Login page
│   ├── admin-dashboard.css    # Admin panel
│   └── student-dashboard.css  # Student portal
│
└── js/                        # JavaScript files
    ├── main.js                # Global utilities
    ├── login.js               # Login handling
    ├── loginHandler.js        # Auth logic
    ├── admin-dashboard.js     # Admin functionality
    └── student-dashboard.js   # Student logic
```

## 🚀 Installation

### Prerequisites
- XAMPP (Apache + MySQL)
- Arduino IDE
- ESP8266 board support
- RFID hardware components

### Step 1: Database Setup
1. Start XAMPP (Apache + MySQL)
2. Open phpMyAdmin: `http://localhost/phpmyadmin`
3. Create database: `edutrack`
4. Import `edutrack.sql`

### Step 2: Configure API
Update the endpoint in `audrino.ino`:
```cpp
const char* serverHost = "192.168.1.100";  // Your PC's IP
const char* apiEndpoint = "/projects/iot/IoT-RFID-Attendance-System-/API/rfid-checkin.php";
```

### Step 3: Hardware Setup
Connect components to ESP8266:

**MFRC522 RFID Module:**
```
SDA  → GPIO 4 (D2)
SCK  → GPIO 14 (D5)
MOSI → GPIO 13 (D7)
MISO → GPIO 12 (D6)
RST  → GPIO 5 (D1)
GND  → GND
3.3V → 3.3V
``` 

**LCD I2C:**
```
VCC → 5V
GND → GND
SDA → GPIO 4 (D2)
SCL → GPIO 5 (D1)
```

**Buzzer:** GPIO 16 (D0)  
**LED:** GPIO 15 (D8)

### Step 4: Upload Firmware
1. Open `audrino.ino` in Arduino IDE
2. Select board: "NodeMCU 1.0 (ESP-12E Module)"
3. Select correct COM port
4. Upload code

### Step 5: Configure WiFi
1. Power on ESP8266
2. Connect to "AutoConnectAP" hotspot
3. Enter your WiFi credentials
4. Device will auto-reconnect on reboot

### Step 6: Access System
- **Landing Page**: `http://localhost/projects/iot/IoT-RFID-Attendance-System-/`
- **Admin Dashboard**: `http://localhost/projects/iot/IoT-RFID-Attendance-System-/admin-dashboard.html`
- **Student Portal**: `http://localhost/projects/iot/IoT-RFID-Attendance-System-/student-dashboard.html`
- **RFID Simulator**: `http://localhost/projects/iot/IoT-RFID-Attendance-System-/test-rfid.html`

## 🔑 Default Credentials

**Admin Login:**
```
Username: admin
Password: admin123
```

**Student Login:**
```
Roll Number: (Your student roll number) 
Password: (Set during student creation)
```

⚠️ **Important:** Change default admin password immediately after first login!

## 📖 API Documentation

Complete API documentation is available in [`API/README.md`](API/README.md)

### Quick API Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/API/login.php` | POST | User authentication |
| `/API/rfid-checkin.php` | POST | RFID check-in/out |
| `/API/fetch-student.php` | GET | Get student data |
| `/API/fetch-attendance.php` | GET | Get attendance records |
| `/API/add-student.php` | POST | Add new student |
| `/API/update-student.php` | POST | Update student info |
| `/API/delete-student.php` | POST | Delete student |
| `/API/change-password.php` | POST | Change password |

## 🧪 Testing

### Using Browser Simulator
Navigate to `test-rfid.html` and:
1. Select student from dropdown
2. Click "Tap Card" to simulate scan
3. Use "Test Full Flow" for IN → OUT → Reject sequence
4. Monitor console for API responses

### Using cURL
```bash
# Test RFID Check-in
curl -X POST http://localhost/projects/iot/IoT-RFID-Attendance-System-/API/rfid-checkin.php \
  -H "Content-Type: application/json" \
  -d '{"uid":"54:83:DE:A4"}'

# Fetch All Students 
curl http://localhost/projects/iot/IoT-RFID-Attendance-System-/API/fetch-student.php
```

## 🎯 System Logic

### Check-In/Check-Out Flow
1. **First Scan** → Type: `IN` (Check-in recorded)
2. **Second Scan** → Type: `OUT` (Check-out recorded)
3. **Third+ Scan** → Rejected (Already completed for the day)

### Timezone Handling
- Server-side calculation for Nepal timezone (GMT+5:45)
- Uses PHP `DateInterval` for accurate offset
- Timestamps stored in local time format

## 📊 Database Schema

### `students` Table
- ID, UID, Name, Roll, Class, Address, password, last_login

### `attendance` Table
- ID, Time, UID, Date, Type (IN/OUT)

### `users` Table
- ID, username, password, last_login

Full schema available in `edutrack.sql`

## 🔒 Security Features

- ✅ Bcrypt password hashing
- ✅ SQL injection prevention (prepared statements)
- ✅ Input sanitization and validation
- ✅ Session-based authentication
- ✅ CORS headers configured
- ✅ XSS prevention

## 🐛 Troubleshooting

**Database Connection Error**
- Verify XAMPP MySQL is running
- Check database 'edutrack' exists
- Validate credentials in `conn.php`

**ESP8266 Not Connecting**
- Reset WiFi settings
- Reconnect to "AutoConnectAP"
- Verify WiFi credentials

**RFID Not Reading**
- Check wiring connections
- Verify 3.3V power supply
- Test with known working RFID card

More troubleshooting in `structure.txt`

## 🚀 Future Enhancements

- [ ] SMS/Email notifications
- [ ] Mobile app (React Native/Flutter)
- [ ] Biometric integration
- [ ] Face recognition
- [ ] Multiple RFID reader support
- [ ] Offline mode with sync
- [ ] PDF report generation
- [ ] Multi-school support
- [ ] REST API for integrations
- [ ] WhatsApp Bot for reports

## 📝 Changelog

### Version 2.0 (December 2025)
- ✅ Migrated from Google Apps Script to PHP + MySQL
- ✅ Implemented bcrypt password hashing
- ✅ Added automatic check-in/check-out detection
- ✅ Card-based UI with search functionality
- ✅ Enhanced admin panel features
- ✅ Password management system
- ✅ RFID testing simulator
- ✅ Nepal timezone support

### Version 1.0 (November 2025)
- Initial release with Google Sheets backend

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/they-call-me-electronerd">
        <img src="https://github.com/they-call-me-electronerd.png" width="100px;" alt="Sakshyam Bastakoti"/>
        <br />
        <sub><b>Sakshyam Bastakoti</b></sub>
        <br />
        <sub>Hardware Engineer</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/zenithkandel">
        <img src="https://github.com/zenithkandel.png" width="100px;" alt="Zenith Kandel"/>
        <br />
        <sub><b>Zenith Kandel</b></sub>
        <br />
        <sub>Software Engineer</sub>
      </a>
    </td>
  </tr>
</table>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Arduino Community
- ESP8266 Community
- Chart.js Team
- Font Awesome
- Google Fonts

## 📞 Support

For issues, questions, or contributions:
- **Repository**: [IoT-RFID-Attendance-System-1](https://github.com/zenithkandel/IoT-RFID-Attendance-System-1)
- **Issues**: [GitHub Issues](https://github.com/zenithkandel/IoT-RFID-Attendance-System-1/issues)

---

<p align="center">
  <b>Made with ❤️ by Edu Track Pro Team</b><br>
  © 2025 EDU TRACK PRO - All Rights Reserved
</p>
<!-- streak-auto:2026-03-03T15:56:48 -->
