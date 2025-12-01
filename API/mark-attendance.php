<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'conn.php';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['uid']) || !isset($input['date'])) {
        echo json_encode([
            'success' => false,
            'message' => 'UID and date are required'
        ]);
        exit();
    }
    
    $uid = $conn->real_escape_string($input['uid']);
    $date = $conn->real_escape_string($input['date']);
    $action = $input['action'] ?? 'mark'; // 'mark' or 'unmark'
    
    if ($action === 'mark') {
        // Mark as present - add check-in and check-out records
        $checkInTime = '08:00:00'; // Default check-in time
        $checkOutTime = '15:00:00'; // Default check-out time
        
        // Check if already marked
        $checkSql = "SELECT ID FROM attendance WHERE UID = '$uid' AND Date = '$date' AND Type = 'IN'";
        $checkResult = $conn->query($checkSql);
        
        if ($checkResult && $checkResult->num_rows > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Attendance already marked for this date'
            ]);
            exit();
        }
        
        // Insert check-in record
        $insertInSql = "INSERT INTO attendance (Time, UID, Date, Type) VALUES ('$checkInTime', '$uid', '$date', 'IN')";
        $conn->query($insertInSql);
        
        // Insert check-out record
        $insertOutSql = "INSERT INTO attendance (Time, UID, Date, Type) VALUES ('$checkOutTime', '$uid', '$date', 'OUT')";
        $conn->query($insertOutSql);
        
        echo json_encode([
            'success' => true,
            'message' => 'Attendance marked successfully'
        ]);
        
    } else if ($action === 'unmark') {
        // Remove attendance records for this date
        $deleteSql = "DELETE FROM attendance WHERE UID = '$uid' AND Date = '$date'";
        
        if ($conn->query($deleteSql)) {
            echo json_encode([
                'success' => true,
                'message' => 'Attendance removed successfully'
            ]);
        } else {
            throw new Exception($conn->error);
        }
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
