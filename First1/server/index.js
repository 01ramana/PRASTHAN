const express = require("express");
const cors = require("cors");
const config = require("config");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const adminRoutes = require("./routes/admin");
const trainRoutes = require("./routes/train");
const userRoutes = require("./routes/user");

app.use("/admin", adminRoutes);
app.use("/train", trainRoutes);
app.use("/user", userRoutes);

const PORT = config.get("port") || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
