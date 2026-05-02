const express = require("express");
const cors = require("cors");
const weatherRoute = require("./routes/weather");
const newsRoute = require("./routes/news");
const currencyRoute = require("./routes/currency");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.send("API is running successfully 🚀");
});

// APIs
app.use("/api/weather", weatherRoute);
app.use("/api/news", newsRoute);
app.use("/api/currency", currencyRoute);

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Test API working fine"
    });
});


module.exports = app;