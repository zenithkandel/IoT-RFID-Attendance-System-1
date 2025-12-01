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

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['id'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit();
}

$id = intval($input['id']);
$uid = isset($input['uid']) ? $conn->real_escape_string($input['uid']) : null;
$name = isset($input['name']) ? $conn->real_escape_string($input['name']) : null;
$roll = isset($input['roll']) ? intval($input['roll']) : null;
$class = isset($input['class']) ? $conn->real_escape_string($input['class']) : null;
$address = isset($input['address']) ? $conn->real_escape_string($input['address']) : null;
$password = isset($input['password']) ? $input['password'] : null;

try {
    // Build query dynamically
    $fields = [];
    $params = [];
    $types = '';

    if ($uid !== null) { $fields[] = "UID = ?"; $params[] = &$uid; $types .= 's'; }
    if ($name !== null) { $fields[] = "Name = ?"; $params[] = &$name; $types .= 's'; }
    if ($roll !== null) { $fields[] = "Roll = ?"; $params[] = &$roll; $types .= 'i'; }
    if ($class !== null) { $fields[] = "Class = ?"; $params[] = &$class; $types .= 's'; }
    if ($address !== null) { $fields[] = "Address = ?"; $params[] = &$address; $types .= 's'; }

    if ($password !== null && $password !== '') {
        $hashed = password_hash($password, PASSWORD_BCRYPT);
        $fields[] = "password = ?";
        $params[] = &$hashed;
        $types .= 's';
    }

    if (count($fields) === 0) {
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
        exit();
    }

    $sql = "UPDATE students SET " . implode(', ', $fields) . " WHERE ID = ?";
    $params[] = &$id;
    $types .= 'i';

    $stmt = $conn->prepare($sql);
    if (!$stmt) throw new Exception($conn->error);

    // Bind params
    $bindNames = [];
    $bindNames[] = $types;
    for ($i = 0; $i < count($params); $i++) {
        $bindNames[] = &$params[$i];
    }
    call_user_func_array([$stmt, 'bind_param'], $bindNames);

    if (!$stmt->execute()) throw new Exception($stmt->error);

    echo json_encode(['success' => true, 'message' => 'Student updated successfully']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

$conn->close();
?>