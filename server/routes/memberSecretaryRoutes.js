const express = require("express");
const router = express.Router();

const memberSecretaryController = require("../controllers/memberSecretaryController");

// Load all applications
router.get(
    "/applications",
    memberSecretaryController.getApplications
);

// Member Secretary Approve / Reject
router.put(
    "/update-status",
    memberSecretaryController.updateStatus
);

module.exports = router;