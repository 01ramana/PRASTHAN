const express = require('express');
const mysql = require('mysql2');
const config = require('config');

const app = express.Router();
app.use(express.json());

// Create a connection pool
const pool = mysql.createPool({
    host: config.get("host"),
    user: config.get("user"),
    password: config.get("password"),
    database: config.get("dbname"),
    port: config.get("port"),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// **GET all train details**
app.get("/", (req, res) => {
    const queryText = `SELECT * FROM Train`;

    pool.query(queryText, (error, result) => {
        res.setHeader("content-type", "application/json");
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(result);
    });
});

// **GET train by TrainNo**
app.get("/:TrainNo", (req, res) => {
    const TrainNo = req.params.TrainNo;
    const queryText = `SELECT * FROM Train WHERE TrainNo = ?`;

    pool.query(queryText, [TrainNo], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ error: "Train not found" });
        }
    });
});

// **GET train details by Source and Destination**
app.get("/search", (req, res) => {
    const { Source, Destination } = req.query;

    if (!Source || !Destination) {
        return res.status(400).json({ error: "Both Source and Destination are required" });
    }

    const queryText = `SELECT * FROM Train WHERE Source = ? AND Destination = ?`;

    pool.query(queryText, [Source, Destination], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ error: "No trains found for the given Source and Destination" });
        }
    });
});

// **ADD a new train**
app.post("/", (req, res) => {
    const { TrainNo, ArrivalTime, DepartureTime, Destination, Source, Date } = req.body;

    if (!TrainNo || !ArrivalTime || !DepartureTime || !Destination || !Source || !Date) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const queryText = `
        INSERT INTO Train (TrainNo, ArrivalTime, DepartureTime, Destination, Source, Date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    pool.query(queryText, [TrainNo, ArrivalTime, DepartureTime, Destination, Source, Date], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true, message: "Train added successfully", data: result });
    });
});

// **UPDATE train details**
app.put("/:TrainNo", (req, res) => {
    const { ArrivalTime, DepartureTime, Destination, Source, Date } = req.body;
    const TrainNo = req.params.TrainNo;

    if (!ArrivalTime || !DepartureTime || !Destination || !Source || !Date) {
        return res.status(400).json({ error: "All fields are required for update" });
    }

    const queryText = `
        UPDATE Train SET ArrivalTime = ?, DepartureTime = ?, Destination = ?, Source = ?, Date = ?
        WHERE TrainNo = ?
    `;

    pool.query(queryText, [ArrivalTime, DepartureTime, Destination, Source, Date, TrainNo], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.affectedRows > 0) {
            res.json({ success: true, message: "Train updated successfully" });
        } else {
            res.status(404).json({ error: "Train not found" });
        }
    });
});

module.exports = app;
