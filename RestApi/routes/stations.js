const express = require('express');
const mysql = require('mysql2');
const config = require('config');

const app = express.Router();
app.use(express.json());

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

// ADD a new station
app.post("/", (req, res) => {
    const { Name, TrainNo } = req.body;

    if (!Name || !TrainNo) {
        return res.status(400).json({ error: "Name and TrainNo are required" });
    }

    const queryText = `INSERT INTO Station (Name, TrainNo) VALUES (?, ?)`;
    pool.query(queryText, [Name, TrainNo], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json({ message: "Station added successfully!", result });
        } else {
            console.error(error);
            res.status(500).json(error);
        }
    });
});

// GET all stations
app.get("/", (req, res) => {
    const queryText = `SELECT * FROM Station`;
    pool.query(queryText, (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(result);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
    });
});

// GET station by StationNo
app.get("/:id", (req, res) => {
    const queryText = `SELECT * FROM Station WHERE StationNo = ?`;
    pool.query(queryText, [req.params.id], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).json({ message: "Station not found" });
            }
        } else {
            console.error(error);
            res.status(500).json(error);
        }
    });
});

// UPDATE a station
app.put("/:id", (req, res) => {
    const { Name, TrainNo } = req.body;

    if (!Name || !TrainNo) {
        return res.status(400).json({ error: "Name and TrainNo are required" });
    }

    const queryText = `UPDATE Station SET Name = ?, TrainNo = ? WHERE StationNo = ?`;
    pool.query(queryText, [Name, TrainNo, req.params.id], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            if (result.affectedRows > 0) {
                res.json({ message: "Station updated successfully!", result });
            } else {
                res.status(404).json({ error: "Station not found" });
            }
        } else {
            console.error(error);
            res.status(500).json(error);
        }
    });
});

// DELETE a station
app.delete("/:id", (req, res) => {
    const queryText = `DELETE FROM Station WHERE StationNo = ?`;
    pool.query(queryText, [req.params.id], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            if (result.affectedRows > 0) {
                res.json({ message: "Station deleted successfully!", result });
            } else {
                res.status(404).json({ error: "Station not found" });
            }
        } else {
            console.error(error);
            res.status(500).json(error);
        }
    });
});

module.exports = app;
