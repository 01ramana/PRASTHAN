require('dotenv').config(); // ✅ Load environment variables

const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');

const app = express.Router();
app.use(express.json());

// Create a MySQL connection pool with SSL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        ca: fs.readFileSync(process.env.CA_CERT) // ✅ Read CA cert from .env path
    },
    waitForConnections: true,
    connectionLimit: 10, // Adjust based on load
    queueLimit: 0
});

// ADD a new route
app.post("/", (req, res) => {
    const { RouteId, TrainNo, StationNo } = req.body;

    if (!RouteId || !TrainNo || !StationNo) {
        return res.status(400).json({ error: "RouteId, TrainNo, and StationNo are required" });
    }

    const queryText = `INSERT INTO Route (RouteId, TrainNo, StationNo) VALUES (?, ?, ?)`;

    pool.query(queryText, [RouteId, TrainNo, StationNo], (error, result) => {
        if (error) {
            console.error("Error inserting route:", error);
            return res.status(500).json({ error: "Failed to add route" });
        }
        res.status(201).json({ success: true, message: "Route added successfully", data: result });
    });
});

// GET all routes
app.get("/", (req, res) => {
    const queryText = `SELECT * FROM Route`;

    pool.query(queryText, (error, result) => {
        if (error) {
            console.error("Error fetching routes:", error);
            return res.status(500).json({ error: "Failed to retrieve routes" });
        }
        res.json({ success: true, data: result });
    });
});

// UPDATE a route
app.put("/:RouteId", (req, res) => {
    const { TrainNo, StationNo } = req.body;
    const { RouteId } = req.params;

    if (!TrainNo || !StationNo) {
        return res.status(400).json({ error: "TrainNo and StationNo are required for update" });
    }

    const queryText = `UPDATE Route SET TrainNo = ?, StationNo = ? WHERE RouteId = ?`;

    pool.query(queryText, [TrainNo, StationNo, RouteId], (error, result) => {
        if (error) {
            console.error("Error updating route:", error);
            return res.status(500).json({ error: "Failed to update route" });
        }
        if (result.affectedRows > 0) {
            res.json({ success: true, message: "Route updated successfully" });
        } else {
            res.status(404).json({ error: "Route not found" });
        }
    });
});

module.exports = app;
