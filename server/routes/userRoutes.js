const express = require("express");
const router = express.Router();

console.log("✅ userRoutes.js loaded");

// Test route
router.get("/test", (req, res) => {
    console.log("✅ TEST ROUTE HIT");
    res.json({
        success: true,
        message: "Backend working"
    });
});

const {
    registerUser,
    loginUser
} = require("../controllers/userControllers");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

module.exports = router;