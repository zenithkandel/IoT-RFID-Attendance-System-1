<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get input from Arduino
$input = json_decode(file_get_contents('php://input'), true);

// Also check for URL-encoded form data as fallback
if (!$input || !isset($input['uid'])) {
    $input = [
        'uid' => isset($_POST['uid']) ? $_POST['uid'] : (isset($_GET['uid']) ? $_GET['uid'] : null)
    ];
}

if (!$input || !isset($input['uid']) || empty($input['uid'])) {
    echo json_encode(['success' => false, 'message' => 'UID is required']);
    exit();
}

$uid = $conn->real_escape_string(trim($input['uid']));

try {
    // Get Nepal current time (UTC+5:45)
    $utc = new DateTime('now', new DateTimeZone('UTC'));
    $nepal = clone $utc;
    $nepal->modify('+5 hours 45 minutes');
    
    $currentDate = $nepal->format('Y-m-d');
    $currentTime = $nepal->format('H:i:s');
    
    // Check if student exists
    $studentCheck = $conn->query("SELECT UID, Name, Roll FROM students WHERE UID = '$uid'");
    if ($studentCheck->num_rows === 0) {
        echo json_encode([
            'success' => false, 
            'message' => 'UID not registered in system',
            'uid' => $uid
        ]);
        exit();
    }
    
    $student = $studentCheck->fetch_assoc();
    
    // Count today's records for this UID
    $countQuery = "SELECT COUNT(*) as count FROM attendance 
                   WHERE UID = '$uid' AND Date = '$currentDate'";
    $countResult = $conn->query($countQuery);
    $count = $countResult->fetch_assoc()['count'];
    
    // Check current status
    if ($count >= 2) {
        // Already checked in and out today - reject
        echo json_encode([
            'success' => false,
            'message' => 'Already checked in and out today',
            'uid' => $uid,
            'name' => $student['Name'],
            'roll' => $student['Roll'],
            'date' => $currentDate,
            'action' => 'rejected'
        ]);
        exit();
    }
    
    // Determine type: IN or OUT
    $type = ($count === 0) ? 'IN' : 'OUT';
    
    // Insert attendance record
    $insertQuery = "INSERT INTO attendance (UID, Date, Time, Type) 
                    VALUES ('$uid', '$currentDate', '$currentTime', '$type')";
    
    if ($conn->query($insertQuery)) {
        echo json_encode([
            'success' => true,
            'message' => 'Attendance recorded successfully',
            'uid' => $uid,
            'name' => $student['Name'],
            'roll' => $student['Roll'],
            'date' => $currentDate,
            'time' => $currentTime,
            'type' => $type,
            'action' => strtolower($type) === 'in' ? 'Check-In' : 'Check-Out'
        ]);
    } else {
        throw new Exception($conn->error);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error recording attendance: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
