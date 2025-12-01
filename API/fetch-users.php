<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'conn.php';

try {
    // Fetch all admin users (excluding passwords for security)
    $sql = "SELECT ID, username, last_login 
            FROM users 
            ORDER BY ID";
    
    $result = $conn->query($sql);
    
    if ($result) {
        $users = [];
        
        while ($row = $result->fetch_assoc()) {
            $users[] = [
                'id' => $row['ID'],
                'username' => $row['username'],
                'lastLogin' => $row['last_login']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'data' => $users,
            'count' => count($users)
        ]);
    } else {
        throw new Exception($conn->error);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching users: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
