<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
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
        'message' => 'Invalid request method'
    ]);
    exit();
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['username']) || !isset($input['password'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Username and password are required'
        ]);
        exit();
    }
    
    $username = $conn->real_escape_string($input['username']);
    $password = $input['password'];
    
    $authenticated = false;
    $userData = null;
    $userRole = null;
    
    // First, check in users table (admin)
    $adminSql = "SELECT ID, username, password, last_login FROM users WHERE username = '$username'";
    $adminResult = $conn->query($adminSql);
    
    if ($adminResult && $adminResult->num_rows > 0) {
        $admin = $adminResult->fetch_assoc();
        
        // Verify password using bcrypt
        if (password_verify($password, $admin['password'])) {
            $authenticated = true;
            $userRole = 'admin';
            
            // Update last login
            $currentTime = date('Y-m-d H:i:s');
            $updateSql = "UPDATE users SET last_login = '$currentTime' WHERE ID = {$admin['ID']}";
            $conn->query($updateSql);
            
            $userData = [
                'id' => $admin['ID'],
                'username' => $admin['username'],
                'role' => 'admin',
                'lastLogin' => $currentTime
            ];
        }
    }
    
    // If not found in admin, check in students table
    if (!$authenticated) {
        // Check if username is a roll number
        $studentSql = "SELECT ID, UID, Name, Roll, Class, password, last_login FROM students WHERE Roll = '$username'";
        $studentResult = $conn->query($studentSql);
        
        if ($studentResult && $studentResult->num_rows > 0) {
            $student = $studentResult->fetch_assoc();
            
            // Verify password using bcrypt
            if (password_verify($password, $student['password'])) {
                $authenticated = true;
                $userRole = 'student';
                
                // Update last login
                $currentTime = date('Y-m-d H:i:s');
                $updateSql = "UPDATE students SET last_login = '$currentTime' WHERE ID = {$student['ID']}";
                $conn->query($updateSql);
                
                $userData = [
                    'id' => $student['ID'],
                    'uid' => $student['UID'],
                    'name' => $student['Name'],
                    'roll' => $student['Roll'],
                    'class' => $student['Class'],
                    'role' => 'student',
                    'lastLogin' => $currentTime
                ];
            }
        }
    }
    
    if ($authenticated) {
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'data' => $userData
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid username or password'
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Login error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
