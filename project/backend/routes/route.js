const express = require('express');
const mysql = require('mysql2');
const config = require('config');

const app = express.Router();
app.use(express.json());

const connectionDetails = {
    host: config.get("host"),
    user: config.get("user"),
    password: config.get("password"),
    database: config.get("dbname"),
    port: config.get("port"),
};

// ADD a new route
app.post("/", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `INSERT INTO Route (Source, Destination, TrainId) VALUES (?, ?, ?)`;
    connection.query(
        queryText,
        [req.body.Source, req.body.Destination, req.body.TrainId],
        (error, result) => {
            res.setHeader("content-type", "application/json");
            if (!error) {
                res.json(result);
            } else {
                console.error(error);
                res.status(500).json(error);
            }
            connection.end();
        }
    );
});

// GET all routes
app.get("/", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `SELECT * FROM Route`;
    connection.query(queryText, (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(result);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});
app.post("/", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `INSERT INTO Route (TrainNo, Destinati, TrainId) VALUES (?, ?, ?)`;
    connection.query(
        queryText,
        [req.body.Source, req.body.Destination, req.body.TrainId],
        (error, result) => {
            res.setHeader("content-type", "application/json");
            if (!error) {
                res.json({ message: "Route added successfully!", result });
            } else {
                console.error(error);
                res.status(500).json(error);
            }
            connection.end();
        }
    );
});

// UPDATE a route
app.put("/:id", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `UPDATE Route SET Source = ?, Destination = ?, TrainId = ? WHERE id = ?`;
    connection.query(
        queryText,
        [req.body.Source, req.body.Destination, req.body.TrainId, req.params.id],
        (error, result) => {
            res.setHeader("content-type", "application/json");
            if (!error) {
                res.json({ message: "Route updated successfully!", result });
            } else {
                console.error(error);
                res.status(500).json(error);
            }
            connection.end();
        }
    );
});
// GET route by id
app.get("/:id", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `SELECT * FROM Route WHERE RouteId = ?`;
    connection.query(queryText, [req.params.id], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            if (result.length > 0) {
                res.json(result[0]); // Return the route object if found
            } else {
                res.status(404).json({ message: "Route not found" });
            }
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});


// DELETE a route
app.delete("/:id", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `DELETE FROM Route WHERE id = ?`;
    connection.query(queryText, [req.params.id], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json({ message: "Route deleted successfully!", result });
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

module.exports = app;
