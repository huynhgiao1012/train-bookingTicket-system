require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const Mongo = require("./config/db");
const EmailService = require("./utils/EmailService");
const catchError = require("./middleware/error");
const authRoutes = require("./route/authRoutes");
const ticketRoutes = require("./route/ticketRoutes");
const tripRoutes = require("./route/tripRoutes");
const userRoutes = require("./route/userRoutes");
const app = express();
app.use(express.json());
app.use(cors());
EmailService.init();
Mongo.connect();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/ticket", ticketRoutes);
app.use("/api/v1/trip", tripRoutes);
app.use("/api/v1/user", userRoutes);
app.use(catchError);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
