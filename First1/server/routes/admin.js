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

app.get("/Admin", (request, response) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `SELECT * FROM Admin`;

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

app.get("/Admin/:AdminId", (request, response) => {
    var AdminId = request.params.AdminId;
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `SELECT * FROM Admin WHERE AdminId = ${AdminId}`;

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

app.post("/Admin", (request, response) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `INSERT INTO Admin (Name, EmailId, Password)
                     VALUES ('${request.body.Name}', '${request.body.EmailId}', '${request.body.Password}')`;

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

app.put("/Admin/:AdminId", (request, response) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `UPDATE Admin SET Name = '${request.body.Name}', EmailId = '${request.body.EmailId}', 
                     Password = '${request.body.Password}' WHERE AdminId = ${request.params.AdminId}`;

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

app.delete("/Admin/:AdminId", (request, response) => {
    var AdminId = request.params.AdminId;
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `DELETE FROM Admin WHERE AdminId = ${AdminId}`;

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
