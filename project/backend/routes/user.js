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

app.get("/", (request, response) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `SELECT * FROM User`;

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
app.get("/:UserId", (request, response) => {
    var UserId = request.params.UserId;
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `SELECT * FROM User WHERE UserId = ${UserId}`;

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

app.post("/", (request, response) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `INSERT INTO User (Name, Gender, Age, MobileNo, City, State, Pincode, EmailId, Password)
                     VALUES ('${request.body.Name}', '${request.body.Gender}', '${request.body.Age}', 
                             '${request.body.MobileNo}', '${request.body.City}', '${request.body.State}', 
                             '${request.body.Pincode}', '${request.body.EmailId}', '${request.body.Password}')`;

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

app.put("/:UserId", (request, response) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `UPDATE User SET Name = '${request.body.Name}', Gender = '${request.body.Gender}', 
                     Age = '${request.body.Age}', MobileNo = '${request.body.MobileNo}', City = '${request.body.City}', 
                     State = '${request.body.State}', Pincode = '${request.body.Pincode}', 
                     EmailId = '${request.body.EmailId}', Password = '${request.body.Password}' 
                     WHERE UserId = ${request.params.UserId}`;

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

app.delete("/:UserId", (request, response) => {
    var UserId = request.params.UserId;
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `DELETE FROM User WHERE UserId = ${UserId}`;

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
