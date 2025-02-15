const express = require('express');
const mysql = require('mysql2');
const config = require('config');

const app = express.Router();

var connectionDetails = {
    host: config.get("server"),
    user: config.get("username"),
    password: config.get("password"),
    database: config.get("database"),
    port: config.get("port")
};

app.get("/Train", (request, response) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `SELECT * FROM Train`;

    connection.query(queryText, (error, result) => {
        response.setHeader("content-type", "application/json");
        if (error == null) {
            var dataInJSON = JSON.stringify(result);
            response.write(dataInJSON);
            response.end();
        } else {
            console.log(error);
            response.write(error);
            response.end();
        }
        connection.end();
    });
});

app.get("/Train/:No", (request, response) => {
    var No = request.params.No;
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `SELECT * FROM Train WHERE TrainNo = ${No}`;

    connection.query(queryText, (error, result) => {
        response.setHeader("content-type", "application/json");
        if (error == null) {
            var dataInJSON = JSON.stringify(result);
            response.write(dataInJSON);
            response.end();
        } else {
            console.log(error);
            response.write(error);
            response.end();
        }
        connection.end();
    });
});

app.post("/Train", (request, response) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `INSERT INTO Train (TrainNo, ArrivalTime, DepartureTime, Destination, Source, Date)
                     VALUES ('${request.body.TrainNo}', '${request.body.ArrivalTime}', '${request.body.DepartureTime}',
                             '${request.body.Destination}', '${request.body.Source}', '${request.body.Date}')`;

    connection.query(queryText, (error, result) => {
        response.setHeader("content-type", "application/json");
        if (error == null) {
            var dataInJSON = JSON.stringify(result);
            response.write(dataInJSON);
            response.end();
        } else {
            console.log(error);
            response.write(error);
            response.end();
        }
        connection.end();
    });
});

app.put("/Train/:No", (request, response) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `UPDATE Train SET ArrivalTime = '${request.body.ArrivalTime}',
                                      DepartureTime = '${request.body.DepartureTime}',
                                      Destination = '${request.body.Destination}',
                                      Source = '${request.body.Source}',
                                      Date = '${request.body.Date}' WHERE TrainNo = ${request.params.No}`;

    connection.query(queryText, (error, result) => {
        response.setHeader("content-type", "application/json");
        if (error == null) {
            var dataInJSON = JSON.stringify(result);
            response.write(dataInJSON);
            response.end();
        } else {
            console.log(error);
            response.write(error);
            response.end();
        }
        connection.end();
    });
});

app.delete("/Train/:No", (request, response) => {
    var No = request.params.No;
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `DELETE FROM Train WHERE TrainNo = ${No}`;

    connection.query(queryText, (error, result) => {
        response.setHeader("content-type", "application/json");
        if (error == null) {
            var dataInJSON = JSON.stringify(result);
            response.write(dataInJSON);
            response.end();
        } else {
            console.log(error);
            response.write(error);
            response.end();
        }
        connection.end();
    });
});

module.exports = app;
