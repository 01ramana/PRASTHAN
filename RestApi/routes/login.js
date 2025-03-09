require('dotenv').config(); // ✅ Load .env variables

const mysql = require('mysql2');
const express = require('express');
const fs = require('fs');

const app = express.Router();
app.use(express.json()); // Middleware to parse JSON

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
    connectionLimit: 10, // Adjust as needed
    queueLimit: 0
});

// Login Route
app.post("/", (request, response) => {
    const { email, password } = request.body;

    // Validate input
    if (!email || !password) {
        return response.status(400).json({ error: "Email and password are required" });
    }

    // SQL query to fetch user details
    const statement = `
        SELECT AdminId AS Id, Name, EmailId, Password, 'admin' AS UserType FROM admin WHERE EmailId = ? 
        UNION 
        SELECT UserId AS Id, Name, EmailId, Password, 'user' AS UserType FROM user WHERE EmailId = ?;
    `;

    // Get a connection from the pool and execute query
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Database connection error:", err);
            return response.status(500).json({ error: "Database connection failed" });
        }

        connection.query(statement, [email, email], (err, results) => {
            connection.release(); // Release the connection back to the pool

            if (err) {
                console.error("Database query error:", err);
                return response.status(500).json({ error: "Internal server error" });
            }

            if (results.length === 0) {
                return response.status(404).json({ error: "No user found with the provided email" });
            }

            const user = results[0];
            console.log("User retrieved:", user);

            if (password === user.Password) {
                return response.status(200).json({
                    success: true,
                    data: {
                        id: user.Id,
                        name: user.Name,
                        email: user.EmailId,
                        userType: user.UserType,
                    },
                });
            } else {
                return response.status(401).json({ error: "Invalid credentials" });
            }
        });
    });
});

module.exports = app;
