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
// UPDATE CHAIRPERSON DECISION
// ========================================

const updateChairpersonDecision = (
    applicationId,
    status,
    comment,
    callback
) => {

    const sql = `
        UPDATE applications
        SET
            chairperson_status = ?,
            chairperson_comment = ?,
            final_status = ?
        WHERE application_id = ?
    `;

    db.query(
        sql,
        [status, comment, status, applicationId],
        callback
    );
};

module.exports = {
    getApplications,
    updateChairpersonDecision
};