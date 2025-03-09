const express = require('express');
const mysql = require('mysql2/promise');
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
    queueLimit: 0,
});

// GET all schedules
app.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM Schedule`);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

// GET schedule by TrainNo
app.get("/train/:TrainNo", async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM Schedule WHERE TrainNo = ?`, [req.params.TrainNo]);
        rows.length > 0 ? res.json(rows) : res.status(404).json({ error: "No schedule found for this TrainNo" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

// GET schedule by StationNo
app.get("/station/:StationNo", async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM Schedule WHERE StationNo = ?`, [req.params.StationNo]);
        rows.length > 0 ? res.json(rows) : res.status(404).json({ error: "No schedule found for this StationNo" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

// ADD a new schedule
app.post("/", async (req, res) => {
    const { ScheduleId, TrainNo, StationNo, ArrivalTime, DepartureTime } = req.body;

    if (!ScheduleId || !TrainNo || !StationNo || !ArrivalTime || !DepartureTime) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO Schedule (ScheduleId, TrainNo, StationNo, ArrivalTime, DepartureTime) VALUES (?, ?, ?, ?, ?)`,
            [ScheduleId, TrainNo, StationNo, ArrivalTime, DepartureTime]
        );
        res.json({ success: true, insertId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

// UPDATE schedule by ScheduleId
app.put("/:ScheduleId", async (req, res) => {
    const { TrainNo, StationNo, ArrivalTime, DepartureTime } = req.body;
    const { ScheduleId } = req.params;

    if (!TrainNo || !StationNo || !ArrivalTime || !DepartureTime) {
        return res.status(400).json({ error: "All fields are required for update" });
    }

    try {
        const [result] = await pool.query(
            `UPDATE Schedule SET TrainNo = ?, StationNo = ?, ArrivalTime = ?, DepartureTime = ? WHERE ScheduleId = ?`,
            [TrainNo, StationNo, ArrivalTime, DepartureTime, ScheduleId]
        );

        result.affectedRows > 0
            ? res.json({ success: true, message: "Schedule updated successfully" })
            : res.status(404).json({ error: "Schedule not found" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = app;
