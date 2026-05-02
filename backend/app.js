// app.js

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
app.use("/api/weather", weatherRoute);
app.use("/api/news", newsRoute);
app.use("/api/currency", currencyRoute);
// Sample API route
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Test API working fine"
    });
});

// Port setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});