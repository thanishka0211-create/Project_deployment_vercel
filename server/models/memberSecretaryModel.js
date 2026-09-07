const db = require("../config/db");

// ========================================
// GET ALL APPLICATIONS
// ========================================

const getApplications = (callback) => {
    const sql = `
        SELECT
            application_id,
            project_title,
            principal_investigator,
            department,
            reviewer_status,
            secretary_status,
            chairperson_status,
            final_status
        FROM applications
        ORDER BY application_id DESC
    `;

    db.query(sql, callback);
};

// ========================================
// UPDATE MEMBER SECRETARY DECISION
// ========================================

const updateMemberSecretaryDecision = (
    applicationId,
    status,
    comment,
    callback
) => {
    const sql = `
        UPDATE applications
        SET
            secretary_status = ?,
            secretary_comment = ?
        WHERE application_id = ?
    `;

    db.query(sql, [status, comment || "", applicationId], callback);
};

module.exports = {
    getApplications,
    updateMemberSecretaryDecision
};