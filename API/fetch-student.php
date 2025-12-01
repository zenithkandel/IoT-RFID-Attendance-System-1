<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'conn.php';

try {
    // Check if a specific roll number is requested
    $roll = isset($_GET['roll']) ? $conn->real_escape_string($_GET['roll']) : null;
    
    if ($roll) {
        // Fetch specific student
        $sql = "SELECT ID, UID, Name, Roll, Class, Address, last_login 
                FROM students 
                WHERE Roll = '$roll'";
        
        $result = $conn->query($sql);
        
        if ($result && $result->num_rows > 0) {
            $student = $result->fetch_assoc();
            
            // Fetch student's attendance records and group by date
            $attendanceSql = "SELECT Date, Time, Type 
                            FROM attendance 
                            WHERE UID = '{$student['UID']}' 
                            ORDER BY Date DESC, Time DESC";
            
            $attendanceResult = $conn->query($attendanceSql);
            $attendanceGrouped = [];
            
            if ($attendanceResult) {
                while ($row = $attendanceResult->fetch_assoc()) {
                    $date = $row['Date'];
                    
                    if (!isset($attendanceGrouped[$date])) {
                        $attendanceGrouped[$date] = [
                            'date' => $date,
                            'checkIn' => null,
                            'checkOut' => null
                        ];
                    }
                    
                    if ($row['Type'] === 'IN') {
                        $attendanceGrouped[$date]['checkIn'] = $row['Time'];
                    } else if ($row['Type'] === 'OUT') {
                        $attendanceGrouped[$date]['checkOut'] = $row['Time'];
                    }
                }
            }
            
            $attendance = array_values($attendanceGrouped);
            
            echo json_encode([
                'success' => true,
                'data' => [
                    'id' => $student['ID'],
                    'uid' => $student['UID'],
                    'name' => $student['Name'],
                    'roll' => $student['Roll'],
                    'class' => $student['Class'],
                    'address' => $student['Address'],
                    'lastLogin' => $student['last_login'],
                    'attendance' => $attendance
                ]
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Student not found'
            ]);
        }
    } else {
        // Fetch all students
        $sql = "SELECT ID, UID, Name, Roll, Class, Address, last_login 
                FROM students 
                ORDER BY Class, Roll";
        
        $result = $conn->query($sql);
        
        if ($result) {
            $students = [];
            
            while ($row = $result->fetch_assoc()) {
                $students[] = [
                    'id' => $row['ID'],
                    'uid' => $row['UID'],
                    'name' => $row['Name'],
                    'roll' => $row['Roll'],
                    'class' => $row['Class'],
                    'address' => $row['Address'],
                    'lastLogin' => $row['last_login']
                ];
            }
            
            echo json_encode([
                'success' => true,
                'data' => $students,
                'count' => count($students)
            ]);
        } else {
            throw new Exception($conn->error);
        }
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching students: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
