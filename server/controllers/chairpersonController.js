const chairpersonModel = require("../models/chairpersonModel");

// ========================================
// GET ALL APPLICATIONS
// ========================================
const getApplications = (req, res) => {

    chairpersonModel.getApplications((err, results) => {

        if (err) {
            console.error("❌ SQL ERROR:", err);

            return res.status(500).json({
                success: false,
                message: err.sqlMessage || err.message
            });
        }

        res.status(200).json(results);

    });

};

// ========================================
// CHAIRPERSON FINAL APPROVE / REJECT
// ========================================
const updateStatus = (req, res) => {

    console.log("========== CHAIRPERSON UPDATE ==========");
    console.log(req.body);

    const { applicationId, status, comment } = req.body;

    if (!applicationId || !status) {
        return res.status(400).json({
            success: false,
            message: "Application ID and Status are required."
        });
    }

    chairpersonModel.updateChairpersonDecision(
        applicationId,
        status,
        comment || "",
        (err, result) => {

            if (err) {
                console.error("❌ DATABASE ERROR:", err);

                return res.status(500).json({
                success: false,
                message: err.sqlMessage || err.message || "Database error"
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

// ========================================
// EXPORTS
// ========================================
module.exports = {
    getApplications,
    updateStatus
};