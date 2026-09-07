const express = require("express");
const router = express.Router();

const reviewerController = require("../controllers/reviewerController");

// Reviewer Approve / Reject + Comment
router.put("/update-status", reviewerController.updateReviewerStatus);

module.exports = router;