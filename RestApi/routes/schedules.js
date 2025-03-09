require('dotenv').config(); // ✅ Load environment variables

const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');

const app = express.Router();
app.use(express.json());

// Create MySQL connection pool with SSL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        ca: fs.readFileSync(process.env.CA_CERT) // ✅ Load CA cert from .env
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// GET all schedules
app.get("/", (req, res) => {
    pool.query(`SELECT * FROM Schedule`, (error, result) => {
        if (error) {
            console.error("Error fetching schedules:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true, data: result });
    });
});

// GET schedule by TrainNo
app.get("/train/:TrainNo", (req, res) => {
    pool.query(`SELECT * FROM Schedule WHERE TrainNo = ?`, [req.params.TrainNo], (error, result) => {
        if (error) {
            console.error("Error fetching schedule by TrainNo:", error);
            return res.status(500).json({ error: "Database error" });
        }
        result.length > 0 ? res.json({ success: true, data: result }) : res.status(404).json({ error: "No schedule found" });
    });
});

// GET schedule by StationNo
app.get("/station/:StationNo", (req, res) => {
    pool.query(`SELECT * FROM Schedule WHERE StationNo = ?`, [req.params.StationNo], (error, result) => {
        if (error) {
            console.error("Error fetching schedule by StationNo:", error);
            return res.status(500).json({ error: "Database error" });
        }
        result.length > 0 ? res.json({ success: true, data: result }) : res.status(404).json({ error: "No schedule found" });
    });
});

// ADD a new schedule
app.post("/", (req, res) => {
    const { ScheduleId, TrainNo, StationNo, ArrivalTime, DepartureTime } = req.body;

    if (!ScheduleId || !TrainNo || !StationNo || !ArrivalTime || !DepartureTime) {
        return res.status(400).json({ error: "All fields are required" });
    }

    pool.query(
        `INSERT INTO Schedule (ScheduleId, TrainNo, StationNo, ArrivalTime, DepartureTime) VALUES (?, ?, ?, ?, ?)`,
        [ScheduleId, TrainNo, StationNo, ArrivalTime, DepartureTime],
        (error, result) => {
            if (error) {
                console.error("Error inserting schedule:", error);
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ success: true, insertId: result.insertId });
        }
    );
});

// UPDATE schedule by ScheduleId
app.put("/:ScheduleId", (req, res) => {
    const { TrainNo, StationNo, ArrivalTime, DepartureTime } = req.body;
    const { ScheduleId } = req.params;

    if (!TrainNo || !StationNo || !ArrivalTime || !DepartureTime) {
        return res.status(400).json({ error: "All fields are required for update" });
    }

    pool.query(
        `UPDATE Schedule SET TrainNo = ?, StationNo = ?, ArrivalTime = ?, DepartureTime = ? WHERE ScheduleId = ?`,
        [TrainNo, StationNo, ArrivalTime, DepartureTime, ScheduleId],
        (error, result) => {
            if (error) {
                console.error("Error updating schedule:", error);
                return res.status(500).json({ error: "Database error" });
            }
            result.affectedRows > 0
                ? res.json({ success: true, message: "Schedule updated successfully" })
                : res.status(404).json({ error: "Schedule not found" });
        }
    );
});

module.exports = app;
