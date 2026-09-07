const express = require("express");
const router = express.Router();

console.log("🚨 CHAIRPERSON ROUTES FILE EXECUTED");

const chairpersonController = require("../controllers/chairpersonController");

// Test Route
router.get("/test", (req, res) => {
    console.log("✅ CHAIRPERSON TEST HIT");
    res.json({
        success: true,
        message: "Chairperson route works!"
    });
});

// Get all applications
router.get("/all", chairpersonController.getApplications);

// Approve / Reject application
router.put("/update-status", chairpersonController.updateStatus);

module.exports = router;