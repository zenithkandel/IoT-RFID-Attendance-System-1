<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'conn.php';

try {
    // Fetch all attendance records with student details
    $sql = "SELECT 
                a.ID,
                a.Time,
                a.Date,
                a.Type,
                a.UID,
                s.Name,
                s.Roll,
                s.Class
            FROM attendance a
            LEFT JOIN students s ON a.UID = s.UID
            ORDER BY a.Date DESC, a.Time DESC";
    
    $result = $conn->query($sql);
    
    if ($result) {
        $attendance = [];
        
        while ($row = $result->fetch_assoc()) {
            $attendance[] = [
                'id' => $row['ID'],
                'date' => $row['Date'],
                'time' => $row['Time'],
                'status' => $row['Type'],
                'uid' => $row['UID'],
                'name' => $row['Name'] ?? 'Unknown',
                'roll' => $row['Roll'] ?? 'N/A',
                'class' => $row['Class'] ?? 'N/A'
            ];
        }
        
        echo json_encode([
            'success' => true,
            'data' => $attendance,
            'count' => count($attendance)
        ]);
    } else {
        throw new Exception($conn->error);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching attendance: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
