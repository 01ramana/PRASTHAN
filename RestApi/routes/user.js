const express = require('express');
const mysql = require('mysql2/promise'); // Use promise-based MySQL for async/await
const config = require('config');
const bcrypt = require('bcrypt');

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
    queueLimit: 0,
});

// GET all users
app.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM User`);
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// GET user by UserId
app.get("/:UserId", async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM User WHERE UserId = ?`, [req.params.UserId]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// POST new user (Register)
app.post("/", async (req, res) => {
    try {
        const { Name, Gender, Age, MobileNo, City, State, Pincode, EmailId, Password } = req.body;

        // Validate required fields
        if (!Name || !Gender || !Age || !MobileNo || !City || !State || !Pincode || !EmailId || !Password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if email already exists
        const [existingUser] = await pool.query(`SELECT * FROM User WHERE EmailId = ?`, [EmailId]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(Password, 10);

        const queryText = `
            INSERT INTO User (Name, Gender, Age, MobileNo, City, State, Pincode, EmailId, Password) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const [result] = await pool.query(queryText, [Name, Gender, Age, MobileNo, City, State, Pincode, EmailId, hashedPassword]);

        res.json({ success: true, message: "User registered successfully", userId: result.insertId });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// DELETE user by UserId
app.delete("/:UserId", async (req, res) => {
    try {
        const [result] = await pool.query(`DELETE FROM User WHERE UserId = ?`, [req.params.UserId]);
        if (result.affectedRows > 0) {
            res.json({ success: true, message: "User deleted successfully" });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = app;
