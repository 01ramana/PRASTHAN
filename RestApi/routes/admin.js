require('dotenv').config();  // ✅ Load .env variables globally

const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');

const app = express.Router();
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: process.env.CA_CERT ? { ca: fs.readFileSync(process.env.CA_CERT) } : undefined, // ✅ Prevent crash if CA_CERT is missing
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ✅ Check if the database connection works
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ MySQL Connection Failed:", err);
    } else {
        console.log("✅ MySQL Connected Successfully");
        connection.release();
    }
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
