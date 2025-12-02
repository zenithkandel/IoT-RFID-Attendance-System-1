-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 02, 2025 at 01:05 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `edutrack`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `ID` int(11) NOT NULL,
  `Time` text NOT NULL,
  `UID` text NOT NULL,
  `Date` text NOT NULL,
  `Type` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`ID`, `Time`, `UID`, `Date`, `Type`) VALUES
(1, '08:01:12', '54:83:DE:A4', '2025-12-01', 'IN'),
(2, '15:32:45', '54:83:DE:A4', '2025-12-01', 'OUT'),
(3, '08:05:33', 'E5:C4:A1:97', '2025-12-01', 'IN'),
(4, '15:28:11', 'E5:C4:A1:97', '2025-12-01', 'OUT'),
(7, '08:12:25', '8B:8C:48:8E', '2025-12-01', 'IN'),
(8, '15:36:50', '8B:8C:48:8E', '2025-12-01', 'OUT'),
(9, '07:55:54', '1A:A1:64:A1', '2025-12-01', 'IN'),
(10, '15:22:39', '1A:A1:64:A1', '2025-12-01', 'OUT'),
(11, '08:07:10', '3C:0B:34:A1', '2025-12-01', 'IN'),
(12, '15:30:55', '3C:0B:34:A1', '2025-12-01', 'OUT'),
(13, '08:03:43', '9B:FB:CB:8E', '2025-12-01', 'IN'),
(14, '15:26:21', '9B:FB:CB:8E', '2025-12-01', 'OUT'),
(15, '07:58:19', 'E5:4D:49:97', '2025-12-01', 'IN'),
(16, '15:40:14', 'E5:4D:49:97', '2025-12-01', 'OUT'),
(17, '08:11:05', '73:3D:73:28', '2025-12-01', 'IN'),
(18, '15:29:18', '73:3D:73:28', '2025-12-01', 'OUT'),
(19, '07:52:27', '3B:8E:31:8E', '2025-12-01', 'IN'),
(20, '15:25:49', '3B:8E:31:8E', '2025-12-01', 'OUT'),
(21, '08:14:42', 'AB:5C:E9:8E', '2025-12-01', 'IN'),
(22, '15:43:30', 'AB:5C:E9:8E', '2025-12-01', 'OUT'),
(23, '08:09:56', '93:7A:80:13', '2025-12-01', 'IN'),
(24, '15:34:44', '93:7A:80:13', '2025-12-01', 'OUT'),
(35, '16:35:34', '54:83:DE:A4', '2025-12-02', 'IN'),
(36, '16:35:56', '54:83:DE:A4', '2025-12-02', 'OUT'),
(43, '08:00:00', '9B:FB:CB:8E', '2025-12-02', 'IN'),
(44, '15:00:00', '9B:FB:CB:8E', '2025-12-02', 'OUT'),
(45, '08:00:00', 'E5:4D:49:97', '2025-12-02', 'IN'),
(46, '15:00:00', 'E5:4D:49:97', '2025-12-02', 'OUT'),
(47, '08:00:00', '8B:8C:48:8E', '2025-12-02', 'IN'),
(48, '15:00:00', '8B:8C:48:8E', '2025-12-02', 'OUT'),
(49, '08:00:00', '1A:A1:64:A1', '2025-12-02', 'IN'),
(50, '15:00:00', '1A:A1:64:A1', '2025-12-02', 'OUT'),
(51, '16:47:05', '3C:0B:34:A1', '2025-12-02', 'IN'),
(52, '16:47:08', '3C:0B:34:A1', '2025-12-02', 'OUT'),
(53, '08:00:00', '73:3D:73:28', '2025-12-02', 'IN'),
(54, '15:00:00', '73:3D:73:28', '2025-12-02', 'OUT'),
(55, '16:58:12', 'AB:5C:E9:8E', '2025-12-02', 'IN'),
(56, '16:58:22', 'AB:5C:E9:8E', '2025-12-02', 'OUT'),
(57, '16:58:45', 'E5:C4:A1:97', '2025-12-02', 'IN'),
(58, '16:58:47', 'E5:C4:A1:97', '2025-12-02', 'OUT'),
(59, '16:58:50', '93:7A:80:13', '2025-12-02', 'IN'),
(60, '16:58:51', '93:7A:80:13', '2025-12-02', 'OUT'),
(61, '17:11:09', '80:38:80:23', '2025-12-02', 'IN'),
(62, '17:11:37', '80:38:80:23', '2025-12-02', 'OUT'),
(63, '08:00:00', '9B:29:3F:8E', '2025-12-02', 'IN'),
(64, '15:00:00', '9B:29:3F:8E', '2025-12-02', 'OUT'),
(65, '08:00:00', '3B:8E:31:8E', '2025-12-02', 'IN'),
(66, '15:00:00', '3B:8E:31:8E', '2025-12-02', 'OUT');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `ID` int(20) NOT NULL,
  `UID` text NOT NULL,
  `Name` text NOT NULL,
  `Roll` int(20) NOT NULL,
  `Class` text NOT NULL,
  `Address` text NOT NULL,
  `password` text NOT NULL,
  `last_login` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`ID`, `UID`, `Name`, `Roll`, `Class`, `Address`, `password`, `last_login`) VALUES
(1, '54:83:DE:A4', 'Sumitra k.c.', 84791362, 'D-7', 'Gairidhara 2, Kathmandu', '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(2, 'E5:C4:A1:97', 'Mahesh Koirala', 85318479, 'M-5', 'Thamel 29, Kathmandu', '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(3, '9B:29:3F:8E', 'Siddharth K.c.', 89274153, 'D-13', 'New Baneshwor 10, Lalitpur', '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(4, '8B:8C:48:8E', 'Kabita Dahal', 81659327, 'M-16', 'Lazimpat 2, Kathmandu', '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(5, '1A:A1:64:A1', 'Subesh Roka', 87321854, 'D-9', 'Baluwatar 4, Kathmandu', '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(6, '3C:0B:34:A1', 'Ranjana Yadav', 82946713, 'M-13', 'Boteswhor 32, Kathmandu', '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(7, '9B:FB:CB:8E', 'Sakshyam Bastakoti', 86183295, 'M-20', 'Putalisadak 28, Kathmandu', '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(8, 'E5:4D:49:97', 'Swikar Magar', 83592461, 'M-18', 'Maharajgunj 3, Kathmandu', '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(9, '73:3D:73:28', 'Kushal Tamang', 89735124, 'D-20', 'Sundhara 22, Kathmandu', '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(10, '3B:8E:31:8E', 'Kailash Magar', 84167539, 'D-17', 'Durbar Marg 1, Kathmandu', '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(11, 'AB:5C:E9:8E', 'Aarusi Bhandari', 85829641, 'M-11', 'Bagbazar 14, Kathmandu', '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(12, '93:7A:80:13', 'Amrit Panthi', 87638915, 'M-5', 'Gurjodhara 18, Kathmandu', '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(14, '80:38:80:23', 'Zenith Kandel', 8038, 'M-9', 'Basundhara, Kathmandu', '$2y$10$UE9tlkdf6PCGHdmWPc5GCO3TIlYb3i/VXGOoEe3CI/6A4tYYYMyXi', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` int(10) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `last_login` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ID`, `username`, `password`, `last_login`) VALUES
(1, 'admin', '$2y$10$mSm05hKjD17PEx3VTl9qCeazWCUR88AwWgSobdpWwWJu6A2Kkd1Ee', '2025-12-02 12:24:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `ID` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
