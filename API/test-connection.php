<?php
// Test database connection
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'localhost';
$dbname = 'edutrack';
$username = 'root';
$password = '';

echo "Testing connection to MySQL...<br>";

// Create connection
$conn = new mysqli($host, $username, $password);

// Check connection to MySQL server
if ($conn->connect_error) {
    die("Connection to MySQL failed: " . $conn->connect_error . "<br>");
}
echo "✓ Connected to MySQL server successfully<br>";

// Check if database exists
$result = $conn->query("SHOW DATABASES LIKE '$dbname'");
if ($result->num_rows == 0) {
    die("✗ Database '$dbname' does not exist!<br>");
}
echo "✓ Database '$dbname' exists<br>";

// Select database
if (!$conn->select_db($dbname)) {
    die("✗ Failed to select database: " . $conn->error . "<br>");
}
echo "✓ Selected database '$dbname' successfully<br>";

// Check tables
$tables = ['students', 'attendance', 'users'];
foreach ($tables as $table) {
    $result = $conn->query("SHOW TABLES LIKE '$table'");
    if ($result->num_rows == 0) {
        echo "✗ Table '$table' does not exist!<br>";
    } else {
        echo "✓ Table '$table' exists<br>";
    }
}

$conn->close();
echo "<br><strong>All checks completed!</strong>";
?>
