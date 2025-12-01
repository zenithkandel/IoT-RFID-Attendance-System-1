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
        $grouped = []; // Group by date and UID for check-in/check-out pairing
        
        while ($row = $result->fetch_assoc()) {
            $key = $row['Date'] . '_' . $row['UID'];
            
            if (!isset($grouped[$key])) {
                $grouped[$key] = [
                    'date' => $row['Date'],
                    'uid' => $row['UID'],
                    'name' => $row['Name'] ?? 'Unknown',
                    'roll' => $row['Roll'] ?? 'N/A',
                    'class' => $row['Class'] ?? 'N/A',
                    'checkIn' => null,
                    'checkOut' => null
                ];
            }
            
            if ($row['Type'] === 'IN') {
                $grouped[$key]['checkIn'] = $row['Time'];
            } else if ($row['Type'] === 'OUT') {
                $grouped[$key]['checkOut'] = $row['Time'];
            }
        }
        
        // Convert grouped data to attendance records
        foreach ($grouped as $record) {
            $attendance[] = [
                'date' => $record['date'],
                'checkIn' => $record['checkIn'],
                'checkOut' => $record['checkOut'],
                'status' => $record['checkIn'] ? 'Present' : 'Absent',
                'uid' => $record['uid'],
                'name' => $record['name'],
                'roll' => $record['roll'],
                'class' => $record['class']
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
