const express = require('express');
const mysql = require('mysql2');
const config = require('config');

const app = express.Router();
app.use(express.json());

// Create a MySQL connection pool
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

// Get booking details by Booking ID
app.get('/booking/:BookingId', (req, res) => {
    const queryText = `SELECT * FROM booking WHERE BookingId = ?`;
    pool.query(queryText, [req.params.BookingId], (error, results) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(results);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
    });
});

// Book a ticket
app.post('/ticket', (req, res) => {
    const { UserId, TrainNo, TicketId, NoOfPassengers, TotalFare, BookingDate } = req.body;

    if (!UserId || !TrainNo || !TicketId || !NoOfPassengers || !TotalFare || !BookingDate) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const queryText = `
        INSERT INTO booking (UserId, TrainNo, TicketId, NoOfPassengers, TotalFare, BookingDate)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    pool.query(queryText, [UserId, TrainNo, TicketId, NoOfPassengers, TotalFare, BookingDate], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.status(201).json({ message: "Ticket booked successfully", BookingId: result.insertId });
        } else {
            console.error('Error executing query:', error);
            res.status(500).json({ message: "Internal Server Error", error });
        }
    });
});

// Cancel a booking
app.post('/cancellation', (req, res) => {
    const { BookingId, CancellationDate, RefundAmount, RefundStatus } = req.body;
    const queryText = `INSERT INTO cancellation (BookingId, CancellationDate, RefundAmount, RefundStatus) VALUES (?, ?, ?, ?)`;
    
    pool.query(queryText, [BookingId, CancellationDate, RefundAmount, RefundStatus], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.status(201).json({ message: "Booking canceled successfully", CancellationId: result.insertId });
        } else {
            console.error(error);
            res.status(500).json(error);
        }
    });
});

// View payment details by Booking ID
app.get('/payment/:BookingId', (req, res) => {
    const queryText = `SELECT * FROM payment WHERE BookingId = ?`;
    pool.query(queryText, [req.params.BookingId], (error, results) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(results);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
    });
});

// View train schedules
app.get("/schedules", (req, res) => {
    const queryText = `
        SELECT 
            train.TrainNo, 
            train.Source, 
            train.Destination, 
            schedule.ArrivalTime, 
            schedule.DepartureTime, 
            station.Name AS StationName 
        FROM 
            train 
        JOIN 
            schedule ON train.TrainNo = schedule.TrainNo 
        JOIN 
            station ON schedule.StationNo = station.StationNo
    `;
    pool.query(queryText, (error, results) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(results);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
    });
});

// Check ticket status by User ID
app.get("/tickets/:UserId", (req, res) => {
    const queryText = `
        SELECT 
            booking.BookingId, 
            booking.TrainNo, 
            train.Source, 
            train.Destination, 
            booking.TotalFare, 
            booking.NoOfPassengers, 
            booking.BookingDate 
        FROM 
            booking 
        JOIN 
            train ON booking.TrainNo = train.TrainNo 
        WHERE 
            booking.UserId = ?
    `;
    pool.query(queryText, [req.params.UserId], (error, results) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(results);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
    });
});

// View train route
app.get('/route/:TrainNo', (req, res) => {
    const queryText = `
        SELECT 
            route.RouteId, 
            route.TrainNo, 
            station.Name AS StationName 
        FROM 
            route 
        JOIN 
            station ON route.StationNo = station.StationNo 
        WHERE 
            route.TrainNo = ?
    `;
    pool.query(queryText, [req.params.TrainNo], (error, results) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(results);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
    });
});

// Export the router
module.exports = app;