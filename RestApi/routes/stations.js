require('dotenv').config(); // ✅ Load .env variables

const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');

const app = express.Router();
app.use(express.json());

// ✅ Create MySQL connection pool with SSL
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

// ✅ ADD a new station
app.post("/", (req, res) => {
    const { Name, TrainNo } = req.body;

    if (!Name || !TrainNo) {
        return res.status(400).json({ error: "Name and TrainNo are required" });
    }

    const queryText = `INSERT INTO Station (Name, TrainNo) VALUES (?, ?)`;
    pool.query(queryText, [Name, TrainNo], (error, result) => {
        res.setHeader("Content-Type", "application/json");
        if (!error) {
            res.json({ message: "Station added successfully!", result });
        } else {
            console.error("Error inserting station:", error);
            res.status(500).json({ error: "Database error" });
        }
    });
});

// ✅ GET all stations
app.get("/", (req, res) => {
    const queryText = `SELECT * FROM Station`;
    pool.query(queryText, (error, result) => {
        res.setHeader("Content-Type", "application/json");
        if (!error) {
            res.json(result);
        } else {
            console.error("Error fetching stations:", error);
            res.status(500).json({ error: "Database error" });
        }
    });
});

// ✅ GET station by StationNo
app.get("/:id", (req, res) => {
    const queryText = `SELECT * FROM Station WHERE StationNo = ?`;
    pool.query(queryText, [req.params.id], (error, result) => {
        res.setHeader("Content-Type", "application/json");
        if (!error) {
            result.length > 0 ? res.json(result[0]) : res.status(404).json({ error: "Station not found" });
        } else {
            console.error("Error fetching station:", error);
            res.status(500).json({ error: "Database error" });
        }
    });
});

// ✅ UPDATE a station
app.put("/:id", (req, res) => {
    const { Name, TrainNo } = req.body;

    if (!Name || !TrainNo) {
        return res.status(400).json({ error: "Name and TrainNo are required" });
    }

    const queryText = `UPDATE Station SET Name = ?, TrainNo = ? WHERE StationNo = ?`;
    pool.query(queryText, [Name, TrainNo, req.params.id], (error, result) => {
        res.setHeader("Content-Type", "application/json");
        if (!error) {
            result.affectedRows > 0
                ? res.json({ message: "Station updated successfully!", result })
                : res.status(404).json({ error: "Station not found" });
        } else {
            console.error("Error updating station:", error);
            res.status(500).json({ error: "Database error" });
        }
    });
});

// ✅ DELETE a station
app.delete("/:id", (req, res) => {
    const queryText = `DELETE FROM Station WHERE StationNo = ?`;
    pool.query(queryText, [req.params.id], (error, result) => {
        res.setHeader("Content-Type", "application/json");
        if (!error) {
            result.affectedRows > 0
                ? res.json({ message: "Station deleted successfully!", result })
                : res.status(404).json({ error: "Station not found" });
        } else {
            console.error("Error deleting station:", error);
            res.status(500).json({ error: "Database error" });
        }
    });
});

module.exports = app;
