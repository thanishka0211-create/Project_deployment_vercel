const db = require("../config/db");

// ========================================
// SAVE MAIN APPLICATION
// ========================================

const createApplication = (application, callback) => {

    const sql = `
        INSERT INTO applications
        (
            user_id,
            project_title,
            principal_investigator,
            department,
            project_type
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            application.user_id || null,
            application.project_title || "",
            application.pi_name || "",
            application.department || "",
            application.project_type || ""
        ],
        callback
    );
};

// ========================================
// SAVE ALL APPLICATION ANSWERS
// ========================================

const saveApplicationAnswers = (applicationId, answers, callback) => {

    const values = Object.entries(answers)
        .filter(([fieldName]) =>
            ![
                "user_id",
                "pi_name",
                "department",
                "project_title",
                "project_type"
            ].includes(fieldName)
        )
        .filter(([fieldName, fieldValue]) =>
            fieldValue !== undefined &&
            fieldValue !== null
        )
        .map(([fieldName, fieldValue]) => {

            if (Array.isArray(fieldValue)) {
                fieldValue = fieldValue.join(", ");
            }

            if (typeof fieldValue === "object") {
                fieldValue = JSON.stringify(fieldValue);
            }

            return [applicationId, fieldName, String(fieldValue)];
        });

    if (values.length === 0) {
        return callback(null, { affectedRows: 0 });
    }

    const sql = `
        INSERT INTO application_answers
        (application_id, field_name, field_value)
        VALUES ?
    `;

    db.query(sql, [values], callback);
};

// ========================================
// GET ALL APPLICATIONS
// ========================================

const getAllApplications = (callback) => {

    const sql = `
        SELECT *
        FROM applications
        ORDER BY application_id DESC
    `;

    db.query(sql, callback);
};

// ========================================
// GET APPLICATIONS OF LOGGED-IN RESEARCHER
// ========================================

const getApplicationsByUserId = (userId, callback) => {

    const sql = `
        SELECT *
        FROM applications
        WHERE user_id = ?
        ORDER BY application_id DESC
    `;

    db.query(sql, [userId], callback);
};

// ========================================
// GET ONE APPLICATION
// ========================================

const getApplicationById = (applicationId, callback) => {

    const sql = `
        SELECT *
        FROM applications
        WHERE application_id = ?
    `;

    db.query(sql, [applicationId], callback);
};

// ========================================
// GET ALL ANSWERS OF ONE APPLICATION
// ========================================

const getAllApplicationAnswers = (applicationId, callback) => {

    const sql = `
        SELECT answer_id, application_id, field_name, field_value
        FROM application_answers
        WHERE application_id = ?
        ORDER BY answer_id ASC
    `;

    db.query(sql, [applicationId], callback);
};

// ========================================
// EXPORTS
// ========================================

module.exports = {
    createApplication,
    saveApplicationAnswers,
    getAllApplications,
    getApplicationsByUserId,
    getApplicationById,
    getAllApplicationAnswers
};