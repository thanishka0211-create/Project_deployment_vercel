const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    submitApplication,
    getAllApplications,
    getApplicationById,
    getMyApplications
} = require("../controllers/applicationController");

// Upload PDFs + submit application
router.post(
    "/submit",
    upload.any(),          // Handles all PDF uploads
    submitApplication
);

// Researcher's applications
router.get("/user/:userId", getMyApplications);

// All applications
router.get("/all", getAllApplications);

// Single application
router.get("/:id", getApplicationById);

module.exports = router;