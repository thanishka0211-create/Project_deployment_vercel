const memberSecretaryModel = require("../models/memberSecretaryModel");

// Get all applications
const getApplications = (req, res) => {

    memberSecretaryModel.getApplications((err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to fetch applications."
            });
        }

        res.json(results);
    });

};

// Member Secretary Approve / Reject
const updateStatus = (req, res) => {

    console.log("========== MEMBER SECRETARY UPDATE ==========");
    console.log(req.body);

    const { applicationId, status, comment } = req.body;

    if (!applicationId || !status) {
        return res.status(400).json({
            success: false,
            message: "Application ID and Status are required."
        });
    }

    memberSecretaryModel.updateMemberSecretaryDecision(
        applicationId,
        status,
        comment || "",
        (err, result) => {

            if (err) {
                console.error("DATABASE ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage || err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Application not found."
                });
            }

            res.status(200).json({
                success: true,
                message: `Application ${status} successfully.`
            });
        }
    );
};
module.exports = {
    getApplications,
    updateStatus
};