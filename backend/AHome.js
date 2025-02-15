const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.json());

var connectionDetails = {
                              host     : 'localhost',
                              user     : 'root',
                              password : 'manager',
                              database : 'prasthan',
                              port: 3306
                        };
app.use((request, response, next)=>{
    response.setHeader("Access-Control-Allow-Origin", "*");
    next();
})

app.get("/Admin", (request, response)=>{
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `select * from Admin`;

    connection.query(queryText, (error, result)=>
        {
            response.setHeader("content-type", "application/json");
            if(error == null)
            {
                var dataInJSON = JSON.stringify(result); 
                response.write(dataInJSON)
                response.end();
            }
            else
            {
                console.log(error);
                response.write(error);
                response.end();
            }
        connection.end();
    })
});

app.get("/Admin/:No", (request, response)=>{
    var No = request.params.No;
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `select * from Admin where AdminId = ${No}`;

    connection.query(queryText, (error, result)=>
        {
            response.setHeader("content-type", "application/json");
            if(error == null)
            {
                var dataInJSON = JSON.stringify(result); 
                response.write(dataInJSON)
                response.end();
            }
            else
            {
                console.log(error);
                response.write(error);
                response.end();
            }
        connection.end();
    })
});

app.post("/Admin", (request, response)=>{

    console.log("Data Received from request Body is: ");
    console.log(request.body);

    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `insert into Admin(AdminId,Name, EmailId,Password) 
                     values('${request.body.AdminId}','${request.body.Name}', '${request.body.EmailId}','${request.body.Password}')`;

    console.log(queryText);

    connection.query(queryText, (error, result)=>
        {
            response.setHeader("content-type", "application/json");
            if(error == null)
            {
                var dataInJSON = JSON.stringify(result); 
                response.write(dataInJSON)
                response.end();
            }
            else
            {
                console.log(error);
                response.write(error);
                response.end();
            }
        connection.end();
    })
});

app.put("/Admin/:No", (request, response)=>
{
    var No = request.params.No; //No from Header
    var Name = request.body.Name;   //Name from Body
    var EmailId = request.body.EmailId; //EmailId from Body
    var Password = request.body.Password; //Password from Body
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `update Admin set Name = '${Name}', 
                            EmailId= '${EmailId}', Password='${Password}' where AdminId = ${No}`;

    console.log(queryText);

    connection.query(queryText, (error, result)=>
        {
            response.setHeader("content-type", "application/json");
            if(error == null)
            {
                var dataInJSON = JSON.stringify(result); 
                response.write(dataInJSON)
                response.end();
            }
            else
            {
                console.log(error);
                response.write(error);
                response.end();
            }
        connection.end();
    })
});

app.delete("/Admin/:No", (request, response)=>
{
    var No = request.params.No; //No from Header
 
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    var queryText = `delete from Admin where AdminId = ${No}`;

    console.log(queryText);

    connection.query(queryText, (error, result)=>
        {
            response.setHeader("content-type", "application/json");
            if(error == null)
            {
                var dataInJSON = JSON.stringify(result); 
                response.write(dataInJSON)
                response.end();
            }
            else
            {
                console.log(error);
                response.write(error);
                response.end();
            }
        connection.end();
    })
});

app.listen(9898,()=>{console.log("Server started at PORT No 9898 ")});