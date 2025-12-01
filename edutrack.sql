-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2025 at 05:05 PM
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
  `Address` int(11) NOT NULL,
  `password` text NOT NULL,
  `last_login` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`ID`, `UID`, `Name`, `Roll`, `Class`, `Address`, `password`, `last_login`) VALUES
(1, '54:83:DE:A4', 'Sumitra k.c.', 85118328, 'D-7', 0, '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(2, 'E5:C4:A1:97', 'Mahesh Koirala', 8542308, 'M-5', 0, '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(3, '9B:29:3F:8E', 'Siddharth k.c.', 85118828, 'D-13', 0, '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(4, '8B:8C:48:8E', 'Kabita Dahal', 85282328, 'M-16', 0, '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(5, '1A:A1:64:A1', 'Subesh Roka', 8542318, 'D-9', 0, '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(6, '3C:0B:34:A1', 'Ranjana Yadav', 8617892, 'M-13', 0, '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(7, '9B:FB:CB:8E', 'Sakshyam Bastakoti', 8392308, 'M-20', 0, '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(8, 'E5:4D:49:97', 'Swikar Magar', 85113338, 'M-18', 0, '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(9, '73:3D:73:28', 'kushal Tamang', 8952308, 'D-20', 0, '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(10, '3B:8E:31:8E', 'kailash Magar', 8542338, 'D-17', 0, '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(11, 'AB:5C:E9:8E', 'Aarusi Bhandari', 2147483647, 'M-11', 0, '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', ''),
(12, '93:7A:80:13', 'Amrit Panthi', 2147483647, 'M-5', 0, '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', '');

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
(1, 'admin', '$2a$12$l3FGR9tJtgnl3tYgqMhXHOM4XZOUAYk07Kw2cROGJEumvS63PU.Pe', '');

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
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `ID` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
