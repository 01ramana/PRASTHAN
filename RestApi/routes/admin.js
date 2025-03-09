const express = require('express');
const mysql = require('mysql2');
const config = require('config');
const fs = require('fs');

const app = express.Router();
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: config.get("host"),
    user: config.get("user"),
    password: config.get("password"),
    database: config.get("dbname"),
    port: config.get("port"),
    ssl: {
        ca: fs.readFileSync(config.get("ca")),
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// GET all admins
app.get("/", (req, res) => {
    pool.query("SELECT * FROM Admin", (error, results) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(results);
        } else {
            console.error("Database Query Error:", error);
            res.status(500).json(error);
        }
    });
});

// GET admin by AdminId
app.get("/:AdminId", (req, res) => {
    pool.query("SELECT * FROM Admin WHERE AdminId = ?", [req.params.AdminId], (error, results) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(results);
        } else {
            console.error("Database Query Error:", error);
            res.status(500).json(error);
        }
    });
});

// POST new admin
app.post("/", (req, res) => {
    const { Name, EmailId, Password } = req.body;
    pool.query("INSERT INTO Admin (Name, EmailId, Password) VALUES (?, ?, ?)", [Name, EmailId, Password], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json({ message: "Admin added successfully", result });
        } else {
            console.error("Database Insert Error:", error);
            res.status(500).json(error);
        }
    });
});

// PUT update admin
app.put("/:AdminId", (req, res) => {
    const { Name, EmailId, Password } = req.body;
    pool.query("UPDATE Admin SET Name = ?, EmailId = ?, Password = ? WHERE AdminId = ?", 
        [Name, EmailId, Password, req.params.AdminId], (error, result) => {
            res.setHeader("content-type", "application/json");
            if (!error) {
                res.json({ message: "Admin updated successfully", result });
            } else {
                console.error("Database Update Error:", error);
                res.status(500).json(error);
            }
        }
    );
});

// DELETE admin by AdminId
app.delete("/:AdminId", (req, res) => {
    pool.query("DELETE FROM Admin WHERE AdminId = ?", [req.params.AdminId], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json({ message: "Admin deleted successfully", result });
        } else {
            console.error("Database Delete Error:", error);
            res.status(500).json(error);
        }
    });
});

module.exports = app;
