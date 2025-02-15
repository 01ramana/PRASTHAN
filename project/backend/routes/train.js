const express = require('express');
const mysql = require('mysql2');
const config = require('config');

const app = express.Router();
app.use(express.json());

const connectionDetails = {
    host: config.get("host"),
    user: config.get("user"),
    password: config.get("password"),
    database: config.get("dbname"),
    port: config.get("port"),
};

app.get("/search", (request, response) => {
    const { startStationName, endStationName } = request.query;  // Extract query parameters

    if (!startStationName || !endStationName) {
        return response.status(400).json({
            error: "startStationName and endStationName are required query parameters."
        });
    }

    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `
        SELECT 
            train.TrainId, 
            train.TrainName, 
            startRoute.RouteId AS StartRouteId, 
            endRoute.RouteId AS EndRouteId,
            startStation.StationName AS StartStation, 
            endStation.StationName AS EndStation, 
            schedule.DepartureTime, 
            schedule.ArrivalTime
        FROM 
            train
        JOIN 
            route AS startRoute ON train.TrainId = startRoute.TrainNo
        JOIN 
            route AS endRoute ON train.TrainId = endRoute.TrainNo
        JOIN 
            station AS startStation ON startRoute.StationNo = startStation.StationId
        JOIN 
            station AS endStation ON endRoute.StationNo = endStation.StationId
        JOIN 
            schedule ON train.TrainId = schedule.TrainId
        WHERE 
            startStation.StationName = ? 
            AND endStation.StationName = ? 
            AND startRoute.RouteId < endRoute.RouteId;
    `;

    connection.query(queryText, [startStationName, endStationName], (error, results) => {
        response.setHeader("content-type", "application/json");
        if (error) {
            console.log(error);
            response.status(500).json({ error: "Database query failed." });
        } else {
            response.status(200).json(results);  // Send back the search results
        }
        connection.end();
    });
});









        /*
        -- Table structure for table `train`
DROP TABLE IF EXISTS `train`;
CREATE TABLE `train` (
  `TrainId` int NOT NULL AUTO_INCREMENT,
  `TrainName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`TrainId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `route`
DROP TABLE IF EXISTS `route`;
CREATE TABLE `route` (
  `RouteId` int NOT NULL AUTO_INCREMENT,
  `TrainNo` int DEFAULT NULL,
  `StationNo` int DEFAULT NULL,
  PRIMARY KEY (`RouteId`),
  KEY `TrainNo` (`TrainNo`),
  KEY `StationNo` (`StationNo`),
  CONSTRAINT `route_ibfk_1` FOREIGN KEY (`TrainNo`) REFERENCES `train` (`TrainId`),
  CONSTRAINT `route_ibfk_2` FOREIGN KEY (`StationNo`) REFERENCES `station` (`StationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `station`
DROP TABLE IF EXISTS `station`;
CREATE TABLE `station` (
  `StationId` int NOT NULL AUTO_INCREMENT,
  `StationName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`StationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table structure for table `schedule`
DROP TABLE IF EXISTS `schedule`;
CREATE TABLE `schedule` (
  `ScheduleId` int NOT NULL AUTO_INCREMENT,
  `TrainId` int DEFAULT NULL,
  `DepartureTime` datetime DEFAULT NULL,
  `ArrivalTime` datetime DEFAULT NULL,
  PRIMARY KEY (`ScheduleId`),
  KEY `TrainId` (`TrainId`),
  CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`TrainId`) REFERENCES `train` (`TrainId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        */
 


// ADD a new train (POST)
app.post("/", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `
        INSERT INTO Train (ArrivalTime, DepartureTime, Destination, Source, Date) 
        VALUES (?, ?, ?, ?, ?)`;

    connection.query(
        queryText,
        [req.body.ArrivalTime, req.body.DepartureTime, req.body.Destination, req.body.Source, req.body.Date],
        (error, result) => {
            res.setHeader("content-type", "application/json");
            if (!error) {
                res.json(result);
            } else {
                console.error(error);
                res.status(500).json(error);
            }
            connection.end();
        }
    );
});

// GET all trains
app.get("/", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `SELECT * FROM Train`;
    connection.query(queryText, (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(result);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// GET a train by TrainNo
app.get("/:TrainNo", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `SELECT * FROM Train WHERE TrainNo = ?`;
    connection.query(queryText, [req.params.TrainNo], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(result);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// UPDATE a train by TrainNo (PUT)
app.put("/:TrainNo", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `
        UPDATE Train 
        SET ArrivalTime = ?, DepartureTime = ?, Destination = ?, Source = ?, Date = ? 
        WHERE TrainNo = ?`;

    connection.query(
        queryText,
        [req.body.ArrivalTime, req.body.DepartureTime, req.body.Destination, req.body.Source, req.body.Date, req.params.TrainNo],
        (error, result) => {
            res.setHeader("content-type", "application/json");
            if (!error) {
                res.json(result);
            } else {
                console.error(error);
                res.status(500).json(error);
            }
            connection.end();
        }
    );
});

// DELETE a train by TrainNo
app.delete("/:TrainNo", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `DELETE FROM Train WHERE TrainNo = ?`;
    connection.query(queryText, [req.params.TrainNo], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(result);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

module.exports = app;
