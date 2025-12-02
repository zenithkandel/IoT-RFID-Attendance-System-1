<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['id'])) {
    echo json_encode(['success' => false, 'message' => 'Student ID is required']);
    exit();
}

$id = intval($input['id']);

try {
    // Get student info before deleting
    $getStudent = "SELECT Name, UID FROM students WHERE ID = $id";
    $result = $conn->query($getStudent);
    
    if (!$result || $result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Student not found']);
        exit();
    }
    
    $student = $result->fetch_assoc();
    $studentName = $student['Name'];
    $studentUID = $student['UID'];

    // Delete student's attendance records first (foreign key constraint)
    $deleteAttendance = "DELETE FROM attendance WHERE UID = '$studentUID'";
    $conn->query($deleteAttendance);

    // Delete student
    $deleteStudent = "DELETE FROM students WHERE ID = $id";
    
    if ($conn->query($deleteStudent)) {
        echo json_encode([
            'success' => true,
            'message' => "Student '$studentName' and all related attendance records deleted successfully"
        ]);
    } else {
        throw new Exception($conn->error);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

$conn->close();
?>
