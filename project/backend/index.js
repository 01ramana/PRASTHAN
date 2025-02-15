const express = require('express');
const config = require('config');
const adminRoutes = require('./routes/admin');
const trainRoutes = require('./routes/train');
const routeRoutes = require('./routes/route');
const statusRoutes = require('./routes/status');
const userRoutes = require('./routes/user');
const stationsRoutes = require('./routes/stations');
const loginRoutes= require('./routes/login');
const bookingRoutes = require('./routes/booking');
const adminFunctionRoutes = require('./routes/adminFunctions');


const app = express();
app.use(express.json());

// Mount routes
app.use("/admin", adminRoutes);
app.use("/train", trainRoutes);
app.use("/route", routeRoutes);
app.use("/status", statusRoutes);
app.use("/user",userRoutes);
app.use("/stations",stationsRoutes)
app.use("/login",loginRoutes);
app.use("/",bookingRoutes);
app.use("/",adminFunctionRoutes);

// Start the server
const httpPort = config.get("httpport");
app.listen(httpPort, () => {
    console.log(`Server is running on http://localhost:${httpPort}`);
});
