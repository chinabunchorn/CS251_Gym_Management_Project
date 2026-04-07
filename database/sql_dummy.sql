-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 06, 2026 at 11:30 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gymmanagement`
--

-- --------------------------------------------------------

--
-- Table structure for table `applies_to`
--

CREATE TABLE `applies_to` (
  `packageID` varchar(4) NOT NULL,
  `PromoCode` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applies_to`
--

INSERT INTO `applies_to` (`packageID`, `PromoCode`) VALUES
('P001', 'PROM200'),
('P001', 'PROMO10'),
('P002', 'WOWIE');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `recordID` int(11) NOT NULL,
  `Member_ID` int(11) NOT NULL,
  `DATE` date NOT NULL,
  `TIME` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`recordID`, `Member_ID`, `DATE`, `TIME`) VALUES
(2, 1, '2026-04-06', '13:54:13'),
(3, 1, '2026-04-06', '13:54:41'),
(4, 8, '2026-04-06', '13:56:31');

-- --------------------------------------------------------

--
-- Table structure for table `class_catalog`
--

CREATE TABLE `class_catalog` (
  `ClassID` varchar(4) NOT NULL,
  `ClassName` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `Capacity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `class_catalog`
--

INSERT INTO `class_catalog` (`ClassID`, `ClassName`, `Description`, `Capacity`) VALUES
('C001', 'Yoga', 'Morning yoga session', 20),
('C002', 'CardioIntro', 'introduction', 30),
('C003', 'test1', 'awaw', 10);

-- --------------------------------------------------------

--
-- Table structure for table `class_schedule`
--

CREATE TABLE `class_schedule` (
  `Schedule_ID` int(11) NOT NULL,
  `ClassID` varchar(4) NOT NULL,
  `ClassDate` date DEFAULT NULL,
  `ClassTime` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `class_schedule`
--

INSERT INTO `class_schedule` (`Schedule_ID`, `ClassID`, `ClassDate`, `ClassTime`) VALUES
(1, 'C001', '2026-04-05', '10:00:00'),
(2, 'C002', '2026-04-07', '15:00:00'),
(3, 'C003', '2026-04-06', '20:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `EmployeeID` int(11) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Salary` decimal(10,2) DEFAULT NULL,
  `STATUS` varchar(20) DEFAULT NULL,
  `Username` varchar(50) DEFAULT NULL,
  `PASSWORD` varchar(100) DEFAULT NULL,
  `ManagerID` int(11) DEFAULT NULL,
  `StartDate` date DEFAULT NULL,
  `Contract_Type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`EmployeeID`, `FirstName`, `LastName`, `Salary`, `STATUS`, `Username`, `PASSWORD`, `ManagerID`, `StartDate`, `Contract_Type`) VALUES
(1, 'Alice', 'Brown', 50000.00, 'Active', 'alice_manager', '1234', NULL, '2024-01-01', 'Full-time'),
(2, 'John', 'Smith', 30000.00, 'Active', 'johntrainer', '1234', 1, '2024-02-01', 'Full-time'),
(3, 'Sirisa', 'chimalee', 57000.00, 'Active', 'tea_trainer', 'meow', 1, '2026-04-06', 'Part-time'),
(4, 'wis', 'wut', 50.00, 'Suspended', 'wis_trainer', 'woof', 1, '2026-04-06', 'Part-time'),
(5, 'shin', 'bark', 90000.00, 'Active', 'shinMan', 'woow', NULL, '2026-04-06', 'Full-Time');

-- --------------------------------------------------------

--
-- Table structure for table `gym_equipment`
--

CREATE TABLE `gym_equipment` (
  `Equipment_ID` varchar(4) NOT NULL,
  `Equipment` varchar(100) NOT NULL,
  `STATUS` varchar(20) DEFAULT NULL,
  `Import_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gym_equipment`
--

INSERT INTO `gym_equipment` (`Equipment_ID`, `Equipment`, `STATUS`, `Import_Date`) VALUES
('Q001', 'Treadmill', 'Available', '2023-06-15'),
('Q002', 'Yoga Mat', 'Broken', '2024-01-01'),
('Q003', 'dumbbells', 'Available', '2025-05-05');

-- --------------------------------------------------------

--
-- Table structure for table `leads`
--

CREATE TABLE `leads` (
  `EmployeeID` int(11) NOT NULL,
  `Schedule_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leads`
--

INSERT INTO `leads` (`EmployeeID`, `Schedule_ID`) VALUES
(2, 1),
(3, 2),
(3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `locker`
--

CREATE TABLE `locker` (
  `LockerID` varchar(4) NOT NULL,
  `STATUS` varchar(20) DEFAULT NULL,
  `Zone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locker`
--

INSERT INTO `locker` (`LockerID`, `STATUS`, `Zone`) VALUES
('L001', 'Available', 'Zone A'),
('L002', 'Rented', 'Zone B');

-- --------------------------------------------------------

--
-- Table structure for table `manager`
--

CREATE TABLE `manager` (
  `EmployeeID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `manager`
--

INSERT INTO `manager` (`EmployeeID`) VALUES
(1);

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE `member` (
  `Member_ID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `PASSWORD` varchar(100) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Bdate` date DEFAULT NULL,
  `MedRec` text DEFAULT NULL,
  `Weight` float(5,2) DEFAULT NULL,
  `Height` float(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`Member_ID`, `Username`, `PASSWORD`, `FirstName`, `LastName`, `Bdate`, `MedRec`, `Weight`, `Height`) VALUES
(1, 'sam28', '1234', 'Samantha', 'Jones', '1996-05-10', 'None', 55.00, 165.00),
(8, 'micMem', '2222', 'Punna', 'Nakme', '0000-00-00', 'heart', 65.00, 180.00),
(9, 'Punna', '9999', 'mic', 'Mac', '2006-05-28', 'dog', 60.00, 30.00);

-- --------------------------------------------------------

--
-- Table structure for table `package`
--

CREATE TABLE `package` (
  `packageID` varchar(4) NOT NULL,
  `packName` varchar(100) NOT NULL,
  `PackPrice` decimal(10,2) NOT NULL,
  `Duration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `package`
--

INSERT INTO `package` (`packageID`, `packName`, `PackPrice`, `Duration`) VALUES
('P001', 'Monthly Basic', 999.00, 30),
('P002', 'yearly Gym', 2000.00, 366);

-- --------------------------------------------------------

--
-- Table structure for table `promotion`
--

CREATE TABLE `promotion` (
  `PromoCode` varchar(20) NOT NULL,
  `DiscountRate` decimal(5,2) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `promotion`
--

INSERT INTO `promotion` (`PromoCode`, `DiscountRate`, `StartDate`, `EndDate`) VALUES
('PROM200', 0.50, '2026-04-06', '2027-04-06'),
('PROMO10', 0.10, '2025-06-01', '2025-06-30'),
('WOWIE', 0.20, '2026-01-01', '2027-01-01');

-- --------------------------------------------------------

--
-- Table structure for table `rent`
--

CREATE TABLE `rent` (
  `LockerID` varchar(4) NOT NULL,
  `Member_ID` int(11) NOT NULL,
  `P_method` varchar(50) DEFAULT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rent`
--

INSERT INTO `rent` (`LockerID`, `Member_ID`, `P_method`, `StartDate`, `EndDate`, `Price`) VALUES
('L002', 8, 'Cash', '2026-04-06', '2026-04-07', 300.00);

-- --------------------------------------------------------

--
-- Table structure for table `requires`
--

CREATE TABLE `requires` (
  `ClassID` varchar(4) NOT NULL,
  `Equipment_ID` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requires`
--

INSERT INTO `requires` (`ClassID`, `Equipment_ID`) VALUES
('C001', 'Q002'),
('C003', 'Q003');

-- --------------------------------------------------------

--
-- Table structure for table `reserves`
--

CREATE TABLE `reserves` (
  `Member_ID` int(11) NOT NULL,
  `Schedule_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reserves`
--

INSERT INTO `reserves` (`Member_ID`, `Schedule_ID`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `subscribes_to`
--

CREATE TABLE `subscribes_to` (
  `packageID` varchar(4) NOT NULL,
  `Member_ID` int(11) NOT NULL,
  `Startdate` date DEFAULT NULL,
  `Enddate` date DEFAULT NULL,
  `P_method` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscribes_to`
--

INSERT INTO `subscribes_to` (`packageID`, `Member_ID`, `Startdate`, `Enddate`, `P_method`) VALUES
('P001', 8, '2026-04-05', '2026-05-05', 'PromptPay'),
('P001', 9, '2026-04-06', '2026-05-06', 'PromptPay');

-- --------------------------------------------------------

--
-- Table structure for table `trainer`
--

CREATE TABLE `trainer` (
  `EmployeeID` int(11) NOT NULL,
  `Specialty` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trainer`
--

INSERT INTO `trainer` (`EmployeeID`, `Specialty`) VALUES
(2, 'Yoga'),
(3, 'Cardio');

-- --------------------------------------------------------

--
-- Table structure for table `trains`
--

CREATE TABLE `trains` (
  `EmployeeID` int(11) NOT NULL,
  `Member_ID` int(11) NOT NULL,
  `Status` varchar(20) NOT NULL,
  `StartDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trains`
--

INSERT INTO `trains` (`EmployeeID`, `Member_ID`, `Status`, `StartDate`) VALUES
(2, 1, 'Active', '2026-04-05'),
(2, 8, 'Active', '2026-04-05'),
(3, 9, 'Active', '2026-04-06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applies_to`
--
ALTER TABLE `applies_to`
  ADD PRIMARY KEY (`packageID`,`PromoCode`),
  ADD KEY `PromoCode` (`PromoCode`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`recordID`,`Member_ID`),
  ADD KEY `Member_ID` (`Member_ID`);

--
-- Indexes for table `class_catalog`
--
ALTER TABLE `class_catalog`
  ADD PRIMARY KEY (`ClassID`);

--
-- Indexes for table `class_schedule`
--
ALTER TABLE `class_schedule`
  ADD PRIMARY KEY (`Schedule_ID`),
  ADD KEY `ClassID` (`ClassID`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`EmployeeID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD KEY `ManagerID` (`ManagerID`);

--
-- Indexes for table `gym_equipment`
--
ALTER TABLE `gym_equipment`
  ADD PRIMARY KEY (`Equipment_ID`);

--
-- Indexes for table `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`EmployeeID`,`Schedule_ID`),
  ADD KEY `Schedule_ID` (`Schedule_ID`);

--
-- Indexes for table `locker`
--
ALTER TABLE `locker`
  ADD PRIMARY KEY (`LockerID`);

--
-- Indexes for table `manager`
--
ALTER TABLE `manager`
  ADD PRIMARY KEY (`EmployeeID`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`Member_ID`),
  ADD UNIQUE KEY `Username` (`Username`);

--
-- Indexes for table `package`
--
ALTER TABLE `package`
  ADD PRIMARY KEY (`packageID`);

--
-- Indexes for table `promotion`
--
ALTER TABLE `promotion`
  ADD PRIMARY KEY (`PromoCode`);

--
-- Indexes for table `rent`
--
ALTER TABLE `rent`
  ADD PRIMARY KEY (`LockerID`,`Member_ID`),
  ADD KEY `Member_ID` (`Member_ID`);

--
-- Indexes for table `requires`
--
ALTER TABLE `requires`
  ADD PRIMARY KEY (`ClassID`,`Equipment_ID`),
  ADD KEY `Equipment_ID` (`Equipment_ID`);

--
-- Indexes for table `reserves`
--
ALTER TABLE `reserves`
  ADD PRIMARY KEY (`Member_ID`,`Schedule_ID`),
  ADD KEY `Schedule_ID` (`Schedule_ID`);

--
-- Indexes for table `subscribes_to`
--
ALTER TABLE `subscribes_to`
  ADD PRIMARY KEY (`packageID`,`Member_ID`),
  ADD KEY `Member_ID` (`Member_ID`);

--
-- Indexes for table `trainer`
--
ALTER TABLE `trainer`
  ADD PRIMARY KEY (`EmployeeID`);

--
-- Indexes for table `trains`
--
ALTER TABLE `trains`
  ADD PRIMARY KEY (`EmployeeID`,`Member_ID`),
  ADD KEY `Member_ID` (`Member_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `recordID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `class_schedule`
--
ALTER TABLE `class_schedule`
  MODIFY `Schedule_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `EmployeeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `Member_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applies_to`
--
ALTER TABLE `applies_to`
  ADD CONSTRAINT `applies_to_ibfk_1` FOREIGN KEY (`packageID`) REFERENCES `package` (`packageID`),
  ADD CONSTRAINT `applies_to_ibfk_2` FOREIGN KEY (`PromoCode`) REFERENCES `promotion` (`PromoCode`);

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`Member_ID`) REFERENCES `member` (`Member_ID`);

--
-- Constraints for table `class_schedule`
--
ALTER TABLE `class_schedule`
  ADD CONSTRAINT `class_schedule_ibfk_1` FOREIGN KEY (`ClassID`) REFERENCES `class_catalog` (`ClassID`);

--
-- Constraints for table `employee`
--
ALTER TABLE `employee`
  ADD CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`ManagerID`) REFERENCES `employee` (`EmployeeID`);

--
-- Constraints for table `leads`
--
ALTER TABLE `leads`
  ADD CONSTRAINT `leads_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `trainer` (`EmployeeID`),
  ADD CONSTRAINT `leads_ibfk_2` FOREIGN KEY (`Schedule_ID`) REFERENCES `class_schedule` (`Schedule_ID`);

--
-- Constraints for table `manager`
--
ALTER TABLE `manager`
  ADD CONSTRAINT `manager_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`);

--
-- Constraints for table `rent`
--
ALTER TABLE `rent`
  ADD CONSTRAINT `rent_ibfk_1` FOREIGN KEY (`LockerID`) REFERENCES `locker` (`LockerID`),
  ADD CONSTRAINT `rent_ibfk_2` FOREIGN KEY (`Member_ID`) REFERENCES `member` (`Member_ID`);

--
-- Constraints for table `requires`
--
ALTER TABLE `requires`
  ADD CONSTRAINT `requires_ibfk_1` FOREIGN KEY (`ClassID`) REFERENCES `class_catalog` (`ClassID`),
  ADD CONSTRAINT `requires_ibfk_2` FOREIGN KEY (`Equipment_ID`) REFERENCES `gym_equipment` (`Equipment_ID`);

--
-- Constraints for table `reserves`
--
ALTER TABLE `reserves`
  ADD CONSTRAINT `reserves_ibfk_1` FOREIGN KEY (`Member_ID`) REFERENCES `member` (`Member_ID`),
  ADD CONSTRAINT `reserves_ibfk_2` FOREIGN KEY (`Schedule_ID`) REFERENCES `class_schedule` (`Schedule_ID`);

--
-- Constraints for table `subscribes_to`
--
ALTER TABLE `subscribes_to`
  ADD CONSTRAINT `subscribes_to_ibfk_1` FOREIGN KEY (`packageID`) REFERENCES `package` (`packageID`),
  ADD CONSTRAINT `subscribes_to_ibfk_2` FOREIGN KEY (`Member_ID`) REFERENCES `member` (`Member_ID`);

--
-- Constraints for table `trainer`
--
ALTER TABLE `trainer`
  ADD CONSTRAINT `trainer_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`);

--
-- Constraints for table `trains`
--
ALTER TABLE `trains`
  ADD CONSTRAINT `trains_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `trainer` (`EmployeeID`),
  ADD CONSTRAINT `trains_ibfk_2` FOREIGN KEY (`Member_ID`) REFERENCES `member` (`Member_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;