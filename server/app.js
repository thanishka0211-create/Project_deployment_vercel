const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload folder
app.use("/upload", express.static(path.join(__dirname, "upload")));

// Test routes
app.get("/hello", (req, res) => {
    res.send("HELLO WORKS");
});

app.get("/api/chairperson/test", (req, res) => {
    console.log("✅ TEST ROUTE HIT");
    res.json({
        success: true,
        message: "Chairperson route works!"
    });
});

// Import routes
const userRoutes = require("./routes/userRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const reviewerRoutes = require("./routes/reviewerRoutes");
const memberSecretaryRoutes = require("./routes/memberSecretaryRoutes");
const chairpersonRoutes = require("./routes/chairpersonRoutes");

// DEBUG ROUTE
app.get("/api/chairperson/test", (req, res) => {
    res.send("APP.JS TEST WORKS");
});

app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/reviewer", reviewerRoutes);
app.use("/api/member-secretary", memberSecretaryRoutes);
app.use("/api/chairperson", chairpersonRoutes);

app.get("/", (req, res) => {
    res.send("Research Ethics Portal API is Running...");
});

// TEST ROUTE
app.get("/api/chairperson/test", (req, res) => {
    console.log("✅ CHAIRPERSON TEST HIT");
    res.json({
        success: true,
        message: "Chairperson route works!"
    });
});
module.exports = app;