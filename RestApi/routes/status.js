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

// ✅ VIEW train status by Train ID
app.get("/train/:TrainNo", (req, res) => {
    const queryText = `SELECT * FROM Train WHERE TrainNo = ?`;

    pool.query(queryText, [req.params.TrainNo], (error, result) => {
        res.setHeader("Content-Type", "application/json");
        if (!error) {
            result.length > 0
                ? res.json(result[0])  // ✅ Return train details if found
                : res.status(404).json({ message: "Train not found" });
        } else {
            console.error("Error fetching train status:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});

// ✅ VIEW route status by Route ID
app.get("/route/:RouteId", (req, res) => {
    const queryText = `SELECT * FROM Route WHERE RouteId = ?`;

    pool.query(queryText, [req.params.RouteId], (error, result) => {
        res.setHeader("Content-Type", "application/json");
        if (!error) {
            result.length > 0
                ? res.json(result[0])  // ✅ Return route details if found
                : res.status(404).json({ message: "Route not found" });
        } else {
            console.error("Error fetching route status:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});

module.exports = app;
