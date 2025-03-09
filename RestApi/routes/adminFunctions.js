require('dotenv').config();  // ✅ Load .env variables

const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');

const app = express.Router();
app.use(express.json());

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        ca: fs.readFileSync(process.env.CA_CERT), // ✅ Use env variable
    },
    waitForConnections: true,
    connectionLimit: 10,  // Adjust as needed
    queueLimit: 0
});

// Add a new train
app.post("/train", (req, res) => {
    const { TrainNo, Source, Destination, ArrivalTime, DepartureTime, Date } = req.body;
    const queryText = `INSERT INTO train (TrainNo, Source, Destination, ArrivalTime, DepartureTime, Date) VALUES (?, ?, ?, ?, ?, ?)`;

    pool.query(queryText, [TrainNo, Source, Destination, ArrivalTime, DepartureTime, Date], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.status(201).json({ message: "Train added successfully", TrainId: result.insertId });
        } else {
            console.error("Database Insert Error:", error);
            res.status(500).json(error);
        }
    });
});

// View train details by TrainNo
app.get("/train/:TrainNo", (req, res) => {
    const queryText = `SELECT * FROM train WHERE TrainNo = ?`;

    pool.query(queryText, [req.params.TrainNo], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(result);
        } else {
            console.error("Database Query Error:", error);
            res.status(500).json(error);
        }
    });
});

// Add a new station
app.post("/station", (req, res) => {
    const { StationNo, Name, TrainNo } = req.body;
    const queryText = `INSERT INTO station (StationNo, Name, TrainNo) VALUES (?, ?, ?)`;

    pool.query(queryText, [StationNo, Name, TrainNo], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.status(201).json({ message: "Station added successfully", StationId: result.insertId });
        } else {
            console.error("Database Insert Error:", error);
            res.status(500).json(error);
        }
    });
});

// View stations by TrainNo
app.get("/station/:TrainNo", (req, res) => {
    const queryText = `SELECT * FROM station WHERE TrainNo = ?`;

    pool.query(queryText, [req.params.TrainNo], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(result);
        } else {
            console.error("Database Query Error:", error);
            res.status(500).json(error);
        }
    });
});

// Delete a train by TrainNo
app.delete("/train/:TrainNo", (req, res) => {
    const queryText = `DELETE FROM train WHERE TrainNo = ?`;

    pool.query(queryText, [req.params.TrainNo], (error) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json({ message: "Train deleted successfully" });
        } else {
            console.error("Database Delete Error:", error);
            res.status(500).json(error);
        }
    });
});

// Delete a station by StationNo
app.delete("/station/:StationNo", (req, res) => {
    const queryText = `DELETE FROM station WHERE StationNo = ?`;

    pool.query(queryText, [req.params.StationNo], (error) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json({ message: "Station deleted successfully" });
        } else {
            console.error("Database Delete Error:", error);
            res.status(500).json(error);
        }
    });
});

// Export the router
module.exports = app;