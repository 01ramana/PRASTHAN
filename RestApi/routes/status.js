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

// VIEW train status by Train ID
app.get("/train/:TrainNo", (req, res) => {
    const queryText = `SELECT * FROM Train WHERE TrainNo = ?`;
    
    pool.query(queryText, [req.params.TrainNo], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            if (result.length > 0) {
                res.json(result[0]);  // Return train details if found
            } else {
                res.status(404).json({ message: "Train not found" });
            }
        } else {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});

// VIEW route status by Route ID
app.get("/route/:RouteId", (req, res) => {
    const queryText = `SELECT * FROM Route WHERE RouteId = ?`;
    
    pool.query(queryText, [req.params.RouteId], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            if (result.length > 0) {
                res.json(result[0]);  // Return route details if found
            } else {
                res.status(404).json({ message: "Route not found" });
            }
        } else {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});

module.exports = app;
