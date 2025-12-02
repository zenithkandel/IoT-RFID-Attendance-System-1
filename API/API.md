# EDU TRACK PRO - API Documentation

This directory contains all the backend API endpoints for the EDU TRACK PRO IoT-based RFID attendance system.

## Table of Contents
- [Overview](#overview)
- [Database Connection](#database-connection)
- [Authentication APIs](#authentication-apis)
- [Student Management APIs](#student-management-apis)
- [Attendance APIs](#attendance-apis)
- [User Management APIs](#user-management-apis)
- [Common Response Format](#common-response-format)
- [Error Codes](#error-codes)

---

## Overview

**Backend Stack:** PHP 8.0+ with MySQL/MariaDB  
**Server:** XAMPP (Apache + MySQL)  
**Base URL:** `http://localhost/projects/iot/IoT-RFID-Attendance-System-/API/`  
**Content-Type:** `application/json`  
**Timezone:** Nepal (GMT+5:45) - calculated server-side  

**Security Features:**
- Bcrypt password hashing
- SQL injection prevention (prepared statements)
- Input sanitization and validation
- CORS headers enabled

---

## Database Connection

### `conn.php`
Database connection handler used by all API endpoints.

**Configuration:**
```php
$host = 'localhost';
$dbname = 'edutrack';
$username = 'root';
$password = '';
```

**Features:**
- MySQLi connection with error handling
- UTF-8 (utf8mb4) character encoding
- Returns JSON error on connection failure
- Sets HTTP 500 status code on error

**Usage:**
```php
require_once 'conn.php';
// $conn is now available for database queries
```

---

## Authentication APIs

### `login.php`
Authenticates admin users and students.

**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123",
  "role": "admin"
}
```
OR
```json
{
  "roll": 12345,
  "password": "student_password",
  "role": "student"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "role": "admin",
  "data": {
    "id": 1,
    "username": "admin",
    "last_login": "2025-12-02 10:30:45"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Validation:**
- Admin: Checks `users` table
- Student: Checks `students` table
- Passwords verified using `password_verify()`
- Updates `last_login` timestamp on success

---

## Student Management APIs

### `fetch-student.php`
Retrieves student data with optional attendance history.

**Method:** `GET`  
**Query Parameters:** `roll` (optional)

**Endpoint 1: Get All Students**
```
GET /API/fetch-student.php
```

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "uid": "54:83:DE:A4",
      "name": "John Doe",
      "roll": "12345",
      "class": "M-5",
      "address": "Kathmandu",
      "lastLogin": "2025-12-02 09:15:30"
    }
  ],
  "count": 1
}
```

**Endpoint 2: Get Specific Student with Attendance**
```
GET /API/fetch-student.php?roll=12345
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "uid": "54:83:DE:A4",
    "name": "John Doe",
    "roll": "12345",
    "class": "M-5",
    "address": "Kathmandu",
    "lastLogin": "2025-12-02 09:15:30",
    "attendance": [
      {
        "date": "2025-12-02",
        "checkIn": "08:30:15",
        "checkOut": "15:45:30"
      },
      {
        "date": "2025-12-01",
        "checkIn": "08:25:00",
        "checkOut": null
      }
    ]
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Student not found"
}
```

---

### `add-student.php`
Creates a new student record.

**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "uid": "54:83:DE:A4",
  "name": "Jane Smith",
  "roll": 67890,
  "class": "D-7",
  "address": "Pokhara",
  "password": "secure_password"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Student added successfully",
  "studentId": 5
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "UID already exists"
}
```
OR
```json
{
  "success": false,
  "message": "Roll number already exists"
}
```

**Validation:**
- All fields required except `address`
- UID must be unique
- Roll number must be unique
- Password hashed using `password_hash()` with BCRYPT
- Minimum password length: 6 characters (recommended)

---

### `update-student.php`
Updates existing student information.

**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "id": 5,
  "uid": "54:83:DE:A4",
  "name": "Jane Smith Updated",
  "roll": 67890,
  "class": "D-8",
  "address": "Pokhara, Nepal",
  "password": "new_password"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Student updated successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Student not found"
}
```

**Notes:**
- `id` is required
- If `password` is empty, existing password is retained
- New password is hashed with bcrypt if provided
- All other fields can be updated

---

### `delete-student.php`
Deletes a student and all associated attendance records.

**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "id": 5
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Student not found"
}
```

**Cascade Behavior:**
- Deletes all attendance records for the student first
- Then deletes the student record
- Uses transactions for data integrity

---

## Attendance APIs

### `rfid-checkin.php`
Processes RFID card taps from ESP8266 hardware.

**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "uid": "54:83:DE:A4"
}
```

**Success Response - Check-In:**
```json
{
  "success": true,
  "message": "Check-in successful",
  "student": "John Doe",
  "type": "IN",
  "time": "08:30:45",
  "date": "2025-12-02"
}
```

**Success Response - Check-Out:**
```json
{
  "success": true,
  "message": "Check-out successful",
  "student": "John Doe",
  "type": "OUT",
  "time": "15:45:20",
  "date": "2025-12-02"
}
```

**Warning Response - Already Checked Out:**
```json
{
  "success": false,
  "message": "Already checked in and out for today",
  "student": "John Doe"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Student not found"
}
```

**Logic:**
1. First scan of the day → Type: `IN`
2. Second scan of the day → Type: `OUT`
3. Third+ scan of the day → Rejected

**Timezone:**
- Nepal timezone (GMT+5:45) calculated server-side
- Uses PHP `DateInterval` for accurate offset

**Database Fields:**
- `Date`: Current date (YYYY-MM-DD)
- `Time`: Current time (HH:MM:SS)
- `Type`: 'IN' or 'OUT'
- `UID`: Student's RFID card UID

---

### `fetch-attendance.php`
Retrieves attendance records with check-in/check-out grouping.

**Method:** `GET`

**Endpoint:**
```
GET /API/fetch-attendance.php
```

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-12-02",
      "checkIn": "08:30:45",
      "checkOut": "15:45:20",
      "name": "John Doe",
      "roll": "12345",
      "class": "M-5",
      "status": "Present"
    },
    {
      "date": "2025-12-01",
      "checkIn": "08:25:00",
      "checkOut": null,
      "name": "John Doe",
      "roll": "12345",
      "class": "M-5",
      "status": "Present"
    }
  ],
  "count": 2
}
```

**Data Processing:**
- Groups attendance by date and student
- Matches `IN` and `OUT` records for the same date
- Joins with `students` table for name, roll, class
- Sorted by date (descending) and time (descending)

---

### `mark-attendance.php`
Manually marks student attendance (admin function).

**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "uid": "54:83:DE:A4",
  "date": "2025-12-02",
  "action": "mark"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Attendance already exists for this date"
}
```

**Features:**
- Allows admin to manually mark attendance
- Checks for duplicate entries
- Records both check-in and check-out times
- Uses Nepal timezone

---

## User Management APIs

### `fetch-users.php`
Retrieves all admin users.

**Method:** `GET`

**Endpoint:**
```
GET /API/fetch-users.php
```

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "username": "admin",
      "last_login": "2025-12-02 10:30:45"
    }
  ],
  "count": 1
}
```

**Notes:**
- Password field is excluded from response
- Returns all admin users from `users` table

---

### `change-password.php`
Updates admin user password.

**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "username": "admin",
  "currentPassword": "old_password",
  "newPassword": "new_secure_password"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

**Validation:**
- Verifies current password using `password_verify()`
- New password must be at least 6 characters
- New password hashed with bcrypt
- Username must exist in `users` table

---

## Common Response Format

All APIs return JSON responses with a consistent structure:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Error Codes

### HTTP Status Codes
- **200 OK** - Request successful
- **400 Bad Request** - Invalid input data
- **401 Unauthorized** - Authentication failed
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Database or server error

### Common Error Messages
- `"Database connection failed"` - MySQL connection error
- `"Invalid JSON input"` - Malformed JSON in request
- `"Missing required fields"` - Required parameters not provided
- `"Student not found"` - UID doesn't exist in database
- `"Invalid credentials"` - Wrong username/password
- `"UID already exists"` - Duplicate UID during student creation
- `"Roll number already exists"` - Duplicate roll number

---

## Testing

### Using cURL

**Test Login:**
```bash
curl -X POST http://localhost/projects/iot/IoT-RFID-Attendance-System-/API/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","role":"admin"}'
```

**Test RFID Check-in:**
```bash
curl -X POST http://localhost/projects/iot/IoT-RFID-Attendance-System-/API/rfid-checkin.php \
  -H "Content-Type: application/json" \
  -d '{"uid":"54:83:DE:A4"}'
```

**Fetch All Students:**
```bash
curl http://localhost/projects/iot/IoT-RFID-Attendance-System-/API/fetch-student.php
```

### Using Browser-Based Simulator
Navigate to: `http://localhost/projects/iot/IoT-RFID-Attendance-System-/test-rfid.html`

Features:
- Select student from dropdown
- Simulate card taps
- Test full flow (IN → OUT → Rejected)
- View real-time console output

---

## Database Schema Reference

### `students` Table
```sql
CREATE TABLE students (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  UID VARCHAR(50) UNIQUE NOT NULL,
  Name VARCHAR(100) NOT NULL,
  Roll INT UNIQUE NOT NULL,
  Class VARCHAR(20) NOT NULL,
  Address VARCHAR(200),
  password VARCHAR(255) NOT NULL,
  last_login DATETIME
);
```

### `attendance` Table
```sql
CREATE TABLE attendance (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Time TIME NOT NULL,
  UID VARCHAR(50) NOT NULL,
  Date DATE NOT NULL,
  Type ENUM('IN', 'OUT') NOT NULL
);
```

### `users` Table
```sql
CREATE TABLE users (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  last_login DATETIME
);
```

---

## Security Best Practices

1. **Always use HTTPS in production**
2. **Change default admin password immediately**
3. **Implement rate limiting for login attempts**
4. **Add CSRF protection for state-changing operations**
5. **Validate and sanitize all user inputs**
6. **Use environment variables for database credentials**
7. **Enable PHP error logging (disable display_errors in production)**
8. **Implement API key authentication for hardware devices**
9. **Add request throttling to prevent abuse**
10. **Regular database backups**

---

## Changelog

### Version 2.0 (December 2025)
- Migrated from Google Apps Script to PHP + MySQL
- Implemented bcrypt password hashing
- Added automatic check-in/check-out detection
- Nepal timezone support (GMT+5:45)
- Enhanced error handling and validation
- Added student management APIs (CRUD)
- Password change functionality
- Cascading deletes for data integrity

### Version 1.0 (November 2025)
- Initial release with Google Sheets backend
- Basic RFID attendance tracking
- Admin and student dashboards

---

## Support & Contact

**Project Repository:** https://github.com/zenithkandel/IoT-RFID-Attendance-System-1

**Developers:**
- Hardware Engineer: Sakshyam Bastakoti - https://github.com/they-call-me-electronerd
- Software Engineer: Zenith Kandel - https://github.com/zenithkandel

**Report Issues:** Create an issue on GitHub repository

---

## License

© 2025 EDU TRACK PRO - Edu Track Pro Team  
Licensed under MIT License
