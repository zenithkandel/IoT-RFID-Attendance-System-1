<?php
/*
  EduTrack Pro - RFID Check-in API
  Receives UID from ESP8266 Arduino device
  Handles check-in/check-out logic automatically
  
  Logic:
  - First scan of the day = Check-In (Type: IN)
  - Second scan of the day = Check-Out (Type: OUT)
  - Third+ scans = Ignored (prevent duplicates)
  
  Expected Input (JSON):
  {
    "uid": "54:83:DE:A4"
  }
  
  Response (JSON):
  {
    "success": true/false,
    "message": "Check-in recorded" | "Check-out recorded" | "Already checked in/out today",
    "type": "IN" | "OUT" | null
  }
*/

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'conn.php';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method. Only POST is allowed.'
    ]);
    exit();
}

try {
    // Get JSON input from Arduino
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (!isset($input['uid']) || empty($input['uid'])) {
        echo json_encode([
            'success' => false,
            'message' => 'UID is required'
        ]);
        exit();
    }
    
    $uid = $conn->real_escape_string(trim($input['uid']));
    
    // Verify that this UID exists in students table
    $studentCheck = "SELECT Name, Roll, Class FROM students WHERE UID = '$uid'";
    $studentResult = $conn->query($studentCheck);
    
    if (!$studentResult || $studentResult->num_rows === 0) {
        echo json_encode([
            'success' => false,
            'message' => 'UID not found in database. Please register this card first.'
        ]);
        exit();
    }
    
    $student = $studentResult->fetch_assoc();
    $studentName = $student['Name'];
    
    // Get current Nepal time (GMT+5:45)
    date_default_timezone_set('UTC');
    $utcTime = new DateTime('now', new DateTimeZone('UTC'));
    
    // Create Nepal timezone offset (+5 hours 45 minutes)
    $nepalOffset = new DateInterval('PT5H45M');
    $utcTime->add($nepalOffset);
    
    $currentDate = $utcTime->format('Y-m-d');
    $currentTime = $utcTime->format('H:i:s');
    
    // Check how many records exist for this UID today
    $checkSql = "SELECT COUNT(*) as count, Type FROM attendance 
                 WHERE UID = '$uid' AND Date = '$currentDate'
                 GROUP BY Type";
    $checkResult = $conn->query($checkSql);
    
    $checkInExists = false;
    $checkOutExists = false;
    
    if ($checkResult && $checkResult->num_rows > 0) {
        while ($row = $checkResult->fetch_assoc()) {
            if ($row['Type'] === 'IN') {
                $checkInExists = true;
            }
            if ($row['Type'] === 'OUT') {
                $checkOutExists = true;
            }
        }
    }
    
    // Determine action based on existing records
    if (!$checkInExists) {
        // First scan: Check-In
        $type = 'IN';
        $insertSql = "INSERT INTO attendance (Time, UID, Date, Type) 
                      VALUES ('$currentTime', '$uid', '$currentDate', 'IN')";
        
        if ($conn->query($insertSql)) {
            echo json_encode([
                'success' => true,
                'message' => 'Check-in recorded successfully',
                'type' => 'IN',
                'student' => $studentName,
                'time' => $currentTime,
                'date' => $currentDate
            ]);
        } else {
            throw new Exception('Database insert failed: ' . $conn->error);
        }
        
    } elseif ($checkInExists && !$checkOutExists) {
        // Second scan: Check-Out
        $type = 'OUT';
        $insertSql = "INSERT INTO attendance (Time, UID, Date, Type) 
                      VALUES ('$currentTime', '$uid', '$currentDate', 'OUT')";
        
        if ($conn->query($insertSql)) {
            echo json_encode([
                'success' => true,
                'message' => 'Check-out recorded successfully',
                'type' => 'OUT',
                'student' => $studentName,
                'time' => $currentTime,
                'date' => $currentDate
            ]);
        } else {
            throw new Exception('Database insert failed: ' . $conn->error);
        }
        
    } else {
        // Both check-in and check-out exist: Ignore
        echo json_encode([
            'success' => false,
            'message' => 'Already checked in and out today. No further scans allowed.',
            'type' => null,
            'student' => $studentName
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
