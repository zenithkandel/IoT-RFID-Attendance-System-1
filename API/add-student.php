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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($input['uid']) || !isset($input['name']) || !isset($input['roll']) || 
    !isset($input['class']) || !isset($input['password'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

$uid = $conn->real_escape_string(trim($input['uid']));
$name = $conn->real_escape_string(trim($input['name']));
$roll = intval($input['roll']);
$class = $conn->real_escape_string(trim($input['class']));
$address = isset($input['address']) ? $conn->real_escape_string(trim($input['address'])) : '';
$password = $input['password'];

try {
    // Check if UID already exists
    $checkUID = "SELECT ID FROM students WHERE UID = '$uid'";
    $resultUID = $conn->query($checkUID);
    if ($resultUID && $resultUID->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'UID already exists in database']);
        exit();
    }

    // Check if Roll number already exists
    $checkRoll = "SELECT ID FROM students WHERE Roll = $roll";
    $resultRoll = $conn->query($checkRoll);
    if ($resultRoll && $resultRoll->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Roll number already exists']);
        exit();
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insert new student
    $sql = "INSERT INTO students (UID, Name, Roll, Class, Address, password, last_login) 
            VALUES ('$uid', '$name', $roll, '$class', '$address', '$hashedPassword', '')";

    if ($conn->query($sql)) {
        echo json_encode([
            'success' => true,
            'message' => 'Student added successfully',
            'data' => [
                'id' => $conn->insert_id,
                'uid' => $uid,
                'name' => $name,
                'roll' => $roll,
                'class' => $class,
                'address' => $address
            ]
        ]);
    } else {
        throw new Exception($conn->error);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

$conn->close();
?>
