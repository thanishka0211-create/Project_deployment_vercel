const applicationModel = require("../models/applicationModel");
// ========================================
// SUBMIT APPLICATION
// ========================================

const submitApplication = (req, res) => {

    const applicationData = req.body;

    console.log("BODY RECEIVED:", applicationData);

    // Save uploaded PDF filenames
    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            applicationData[file.fieldname] = file.filename;
        });
    }

    // Convert arrays into single values
    const singleValue = (value) => {
        if (Array.isArray(value)) {
            return value.find(v => v !== "") || "";
        }
        return value || "";
    };

    // Main application object
    const application = {
        user_id: singleValue(applicationData.user_id),
        pi_name: singleValue(applicationData.pi_name || applicationData.principalInvestigator),
        project_title: singleValue(applicationData.project_title || applicationData.researchTitle),
        department: singleValue(applicationData.department),
        project_type: singleValue(applicationData.project_type || applicationData.researchType)
    };

    console.log("APPLICATION OBJECT:", application);

    applicationModel.createApplication(application, (err, result) => {

        if (err) {
            console.error("Application creation error:", err);

            return res.status(500).json({
                message: "Application Submission Failed"
            });
        }

        const applicationId = result.insertId;

        applicationModel.saveApplicationAnswers(
            applicationId,
            applicationData,
            (answerErr) => {

                if (answerErr) {
                    console.error("Answer saving error:", answerErr);

                    return res.status(500).json({
                        message: "Application created, but answers could not be saved."
                    });
                }

                res.status(201).json({
                    message: "Application Submitted Successfully",
                    application_id: applicationId
                });
            }
        );
    });
};

// ========================================
// GET ALL APPLICATIONS
// ========================================

const getAllApplications = (req, res) => {

    applicationModel.getAllApplications((err, results) => {

        if (err) {
            console.error("Fetch applications error:", err);

            return res.status(500).json({
                message: "Failed to Fetch Applications"
            });
        }

        res.status(200).json(results);
    });
};

// ========================================
// GET APPLICATIONS OF LOGGED-IN USER
// ========================================

const getMyApplications = (req, res) => {

    const userId = req.params.userId;

    applicationModel.getApplicationsByUserId(userId, (err, results) => {

        if (err) {
            console.error("Fetch My Applications Error:", err);

            return res.status(500).json({
                message: "Failed to fetch applications"
            });
        }

        res.status(200).json(results);
    });
};

// ========================================
// GET ONE APPLICATION + ALL ANSWERS
// ========================================

const getApplicationById = (req, res) => {

    const applicationId = req.params.id;

    applicationModel.getApplicationById(applicationId, (err, applicationResults) => {

        if (err) {
            console.error("Application fetch error:", err);

            return res.status(500).json({
                message: "Failed to Fetch Application"
            });
        }

        if (applicationResults.length === 0) {
            return res.status(404).json({
                message: "Application Not Found"
            });
        }

        const application = applicationResults[0];

        // ✅ Correct function name
        applicationModel.getAllApplicationAnswers(applicationId, (answerErr, answers) => {

            if (answerErr) {
                console.error("Answer fetch error:", answerErr);

                return res.status(500).json({
                    message: "Failed to Fetch Application Answers"
                });
            }

            res.status(200).json({
                application,
                answers
            });

        });

    });

};

// ========================================
// EXPORTS
// ========================================

module.exports = {
    submitApplication,
    getAllApplications,
    getMyApplications,
    getApplicationById
};