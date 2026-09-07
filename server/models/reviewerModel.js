const db = require("../config/db");

// ========================================
// REVIEWER UPDATE STATUS + COMMENT
// ========================================

const updateReviewerStatus = (applicationId, status, comment, callback) => {

    const sql = `
        UPDATE applications
        SET
            reviewer_status = ?,
            reviewer_comment = ?
        WHERE application_id = ?
    `;

    db.query(sql, [status, comment, applicationId], callback);
};

module.exports = {
    updateReviewerStatus
};