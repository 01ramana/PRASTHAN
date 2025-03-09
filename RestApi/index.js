require('dotenv').config();

const express = require('express');
const cors = require('cors');


const adminRoutes = require('./routes/admin');
const trainRoutes = require('./routes/train');
const routeRoutes = require('./routes/route');
const statusRoutes = require('./routes/status');
const stationRoutes = require('./routes/stations');
const userRoutes = require('./routes/user');
const loginRoutes= require('./routes/login');
const bookingRoutes = require('./routes/booking');
const adminFunctionRoutes = require('./routes/adminFunctions');
const scheduleRoutes = require('./routes/schedules');

// Create an Express application
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.DB_PORT || 4000;

// Mount routes
app.use("/admin", adminRoutes);
app.use("/train", trainRoutes);
app.use("/route", routeRoutes);
app.use("/status", statusRoutes);
app.use("/user",userRoutes);
app.use("/login",loginRoutes);
app.use("/station",stationRoutes);
app.use("/",bookingRoutes);
app.use("/",adminFunctionRoutes);
app.use("/schedule",scheduleRoutes);



// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
