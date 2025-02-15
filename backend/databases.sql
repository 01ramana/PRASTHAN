-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: trainreservationsystem
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `AdminId` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) DEFAULT NULL,
  `EmailId` varchar(100) DEFAULT NULL,
  `Password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`AdminId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'Admin1','admin1@example.com','adminpass1'),(2,'Admin2','admin2@example.com','adminpass2');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `BookingId` int NOT NULL AUTO_INCREMENT,
  `UserId` int DEFAULT NULL,
  `TrainNo` int DEFAULT NULL,
  `TicketId` int DEFAULT NULL,
  `NoOfPassengers` int DEFAULT NULL,
  `BookingDate` date DEFAULT NULL,
  `TotalFare` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`BookingId`),
  KEY `UserId` (`UserId`),
  KEY `TrainNo` (`TrainNo`),
  KEY `TicketId` (`TicketId`),
  CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `user` (`UserId`),
  CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`TrainNo`) REFERENCES `train` (`TrainNo`),
  CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`TicketId`) REFERENCES `ticket` (`TicketId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (1,1,1,1,2,'2024-12-25',500.00),(2,2,2,2,1,'2024-12-26',300.00);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cancellation`
--

DROP TABLE IF EXISTS `cancellation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancellation` (
  `CancellationId` int NOT NULL AUTO_INCREMENT,
  `BookingId` int DEFAULT NULL,
  `CancellationDate` date DEFAULT NULL,
  `RefundAmount` decimal(10,2) DEFAULT NULL,
  `RefundStatus` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`CancellationId`),
  KEY `BookingId` (`BookingId`),
  CONSTRAINT `cancellation_ibfk_1` FOREIGN KEY (`BookingId`) REFERENCES `booking` (`BookingId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cancellation`
--

LOCK TABLES `cancellation` WRITE;
/*!40000 ALTER TABLE `cancellation` DISABLE KEYS */;
INSERT INTO `cancellation` VALUES (1,1,'2024-12-27',250.00,'Refunded');
/*!40000 ALTER TABLE `cancellation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class` (
  `ClassId` int NOT NULL AUTO_INCREMENT,
  `TrainNo` int DEFAULT NULL,
  `ClassType` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ClassId`),
  KEY `TrainNo` (`TrainNo`),
  CONSTRAINT `class_ibfk_1` FOREIGN KEY (`TrainNo`) REFERENCES `train` (`TrainNo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class`
--

LOCK TABLES `class` WRITE;
/*!40000 ALTER TABLE `class` DISABLE KEYS */;
INSERT INTO `class` VALUES (1,1,'First Class'),(2,2,'Second Class');
/*!40000 ALTER TABLE `class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `PaymentId` int NOT NULL AUTO_INCREMENT,
  `BookingId` int DEFAULT NULL,
  `UserId` int DEFAULT NULL,
  `PaymentDate` date DEFAULT NULL,
  `PaymentMode` varchar(50) DEFAULT NULL,
  `PaymentStatus` varchar(50) DEFAULT NULL,
  `AmountPaid` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`PaymentId`),
  KEY `BookingId` (`BookingId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`BookingId`) REFERENCES `booking` (`BookingId`),
  CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `user` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,1,1,'2024-12-25','Credit Card','Completed',500.00),(2,2,2,'2024-12-26','Debit Card','Completed',300.00);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route`
--

DROP TABLE IF EXISTS `route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route` (
  `RouteId` int NOT NULL AUTO_INCREMENT,
  `TrainNo` int DEFAULT NULL,
  `StationNo` int DEFAULT NULL,
  PRIMARY KEY (`RouteId`),
  KEY `TrainNo` (`TrainNo`),
  KEY `StationNo` (`StationNo`),
  CONSTRAINT `route_ibfk_1` FOREIGN KEY (`TrainNo`) REFERENCES `train` (`TrainNo`),
  CONSTRAINT `route_ibfk_2` FOREIGN KEY (`StationNo`) REFERENCES `station` (`StationNo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route`
--

LOCK TABLES `route` WRITE;
/*!40000 ALTER TABLE `route` DISABLE KEYS */;
INSERT INTO `route` VALUES (1,1,1),(2,1,2),(3,2,3);
/*!40000 ALTER TABLE `route` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `ScheduleId` int NOT NULL AUTO_INCREMENT,
  `TrainNo` int DEFAULT NULL,
  `StationNo` int DEFAULT NULL,
  `ArrivalTime` time DEFAULT NULL,
  `DepartureTime` time DEFAULT NULL,
  PRIMARY KEY (`ScheduleId`),
  KEY `TrainNo` (`TrainNo`),
  KEY `StationNo` (`StationNo`),
  CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`TrainNo`) REFERENCES `train` (`TrainNo`),
  CONSTRAINT `schedule_ibfk_2` FOREIGN KEY (`StationNo`) REFERENCES `station` (`StationNo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (1,1,1,'09:50:00','10:00:00'),(2,1,2,'12:50:00','13:00:00'),(3,2,3,'14:50:00','15:00:00');
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seat`
--

DROP TABLE IF EXISTS `seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat` (
  `SeatId` int NOT NULL AUTO_INCREMENT,
  `TrainNo` int DEFAULT NULL,
  `ClassId` int DEFAULT NULL,
  `SeatNo` int DEFAULT NULL,
  `AvailabilityStatus` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`SeatId`),
  KEY `TrainNo` (`TrainNo`),
  KEY `ClassId` (`ClassId`),
  CONSTRAINT `seat_ibfk_1` FOREIGN KEY (`TrainNo`) REFERENCES `train` (`TrainNo`),
  CONSTRAINT `seat_ibfk_2` FOREIGN KEY (`ClassId`) REFERENCES `class` (`ClassId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat`
--

LOCK TABLES `seat` WRITE;
/*!40000 ALTER TABLE `seat` DISABLE KEYS */;
INSERT INTO `seat` VALUES (1,1,1,1,'Available'),(2,2,2,2,'Booked');
/*!40000 ALTER TABLE `seat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `station`
--

DROP TABLE IF EXISTS `station`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `station` (
  `StationNo` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) DEFAULT NULL,
  `TrainNo` int DEFAULT NULL,
  PRIMARY KEY (`StationNo`),
  KEY `TrainNo` (`TrainNo`),
  CONSTRAINT `station_ibfk_1` FOREIGN KEY (`TrainNo`) REFERENCES `train` (`TrainNo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `station`
--

LOCK TABLES `station` WRITE;
/*!40000 ALTER TABLE `station` DISABLE KEYS */;
INSERT INTO `station` VALUES (1,'Mumbai Central',1),(2,'Delhi Junction',1),(3,'Howrah Junction',2);
/*!40000 ALTER TABLE `station` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `TicketId` int NOT NULL AUTO_INCREMENT,
  `TrainNo` int DEFAULT NULL,
  `UserId` int DEFAULT NULL,
  `NoOfPassengers` int DEFAULT NULL,
  PRIMARY KEY (`TicketId`),
  KEY `TrainNo` (`TrainNo`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`TrainNo`) REFERENCES `train` (`TrainNo`),
  CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `user` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
INSERT INTO `ticket` VALUES (1,1,1,2),(2,2,2,1);
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `train`
--

DROP TABLE IF EXISTS `train`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `train` (
  `TrainNo` int NOT NULL AUTO_INCREMENT,
  `ArrivalTime` time DEFAULT NULL,
  `DepartureTime` time DEFAULT NULL,
  `Destination` varchar(100) DEFAULT NULL,
  `Source` varchar(100) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  PRIMARY KEY (`TrainNo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `train`
--

LOCK TABLES `train` WRITE;
/*!40000 ALTER TABLE `train` DISABLE KEYS */;
INSERT INTO `train` VALUES (1,'10:00:00','10:30:00','Delhi','Mumbai','2024-12-30'),(2,'15:00:00','15:30:00','Chennai','Kolkata','2024-12-31');
/*!40000 ALTER TABLE `train` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `UserId` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) DEFAULT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  `Age` int DEFAULT NULL,
  `MobileNo` varchar(15) DEFAULT NULL,
  `City` varchar(50) DEFAULT NULL,
  `State` varchar(50) DEFAULT NULL,
  `Pincode` varchar(10) DEFAULT NULL,
  `EmailId` varchar(100) DEFAULT NULL,
  `Password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Alice','Female',30,'9876543210','Mumbai','Maharashtra','400001','alice@example.com','password123'),(2,'Bob','Male',28,'9123456789','Delhi','Delhi','110001','bob@example.com','password456');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-27 10:15:16
