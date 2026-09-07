const reviewerModel = require("../models/reviewerModel");

// ========================================
// REVIEWER APPROVE / REJECT
// ========================================

const updateReviewerStatus = (req, res) => {

    const { applicationId, status, comment } = req.body;

    reviewerModel.updateReviewerStatus(
        applicationId,
        status,
        comment,
        (err) => {

            if (err) {
                console.error("Reviewer Status Error:", err);

                return res.status(500).json({
                    message: "Failed to update reviewer status."
                });
            }

            res.status(200).json({
                message: `Reviewer ${status} successfully.`
            });

        }
    );
};

module.exports = {
    updateReviewerStatus
};