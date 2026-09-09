// =========================================
// VIEW APPLICATION (Reviewer / Secretary / Chairperson)
// =========================================

const params = new URLSearchParams(window.location.search);
const applicationId = params.get("id");

const applicationContainer = document.getElementById("applicationContainer");

const BASE_URL = API_BASE_URL;

// Get logged in role
const role = localStorage.getItem("role");

// =========================================
// LOAD APPLICATION
// =========================================

async function loadApplication() {

    try {

        const response = await fetch(
            `${BASE_URL}/api/applications/${applicationId}`
        );

        if (!response.ok) {
            throw new Error("Failed to load application.");
        }

        const data = await response.json();

        const application = data.application;
        const answers = data.answers;

        let html = `
            <div class="application-view-card">

                <h2 style="color:#8B0000;margin-bottom:20px;">
                    Research Ethics Committee Application
                </h2>

                <div class="application-info-grid">

                    <div class="info-box">
                        <strong>Application ID</strong><br>
                        ${application.application_id}
                    </div>

                    <div class="info-box">
                        <strong>Project Title</strong><br>
                        ${application.project_title || "-"}
                    </div>

                    <div class="info-box">
                        <strong>Principal Investigator</strong><br>
                        ${application.principal_investigator || "-"}
                    </div>

                    <div class="info-box">
                        <strong>Department</strong><br>
                        ${application.department || "-"}
                    </div>

                    <div class="info-box">
                        <strong>Project Type</strong><br>
                        ${application.project_type || "-"}
                    </div>

                    <div class="info-box">
                        <strong>Status</strong><br>
                        <span style="color:#8B0000;font-weight:bold;">
                            ${application.status || "Pending"}
                        </span>
                    </div>

                </div>

                <hr style="margin:30px 0;">

                <h3 style="color:#8B0000;">Submitted Application Details</h3>
        `;

        // =========================================
        // DISPLAY ALL ANSWERS
        // =========================================

        answers.forEach(answer => {

            let value = answer.field_value;

            if (!value || value === "") value = "-";

            // PDF Button
            if (
                typeof value === "string" &&
                value.toLowerCase().endsWith(".pdf")
            ) {

                value = `
                    <a href="${BASE_URL}/upload/${encodeURIComponent(value)}"
                       target="_blank"
                       class="pdf-view-btn"
                       style="
                            display:inline-block;
                            padding:10px 18px;
                            background:#8B0000;
                            color:white;
                            text-decoration:none;
                            border-radius:8px;
                            font-weight:bold;">
                        📄 View PDF
                    </a>
                `;
            }

            html += `
                <div class="answer-card"
                    style="
                        border-left:5px solid #8B0000;
                        padding:15px;
                        margin:15px 0;
                        background:#fafafa;
                        border-radius:8px;
                    ">

                    <h4 style="color:#8B0000;">
                        ${answer.field_name}
                    </h4>

                    <div style="white-space:pre-wrap;">
                        ${value}
                    </div>

                </div>
            `;
        });

        // =========================================
        // REVIEWER SECTION
        // =========================================

        if (role === "reviewer") {

            html += `

            <hr style="margin:40px 0;">

            <div class="committee-section">

                <h2 style="color:#8B0000;">
                    Reviewer Evaluation
                </h2>

                <label><strong>Decision</strong></label><br><br>

                <label>
                    <input type="radio"
                           name="reviewerStatus"
                           value="Approved">
                    Approve
                </label>

                <label style="margin-left:30px;">
                    <input type="radio"
                           name="reviewerStatus"
                           value="Rejected">
                    Reject
                </label>

                <br><br>

                <label><strong>Reviewer Comments</strong></label>

                <textarea
                    id="reviewerComment"
                    rows="5"
                    style="width:100%;margin-top:10px;"
                    placeholder="Enter reviewer comments..."></textarea>

                <br><br>

                <button
                    id="submitReviewerDecision"
                    class="submit-btn"
                    style="
                        background:#8B0000;
                        color:white;
                        padding:12px 30px;
                        border:none;
                        border-radius:8px;
                        cursor:pointer;">
                    Submit Review
                </button>

            </div>
            `;
        }

        html += `</div>`;

        applicationContainer.innerHTML = html;

        // Attach reviewer button event
        if (role === "reviewer") {
            document
                .getElementById("submitReviewerDecision")
                .addEventListener("click", submitReviewerDecision);
        }

    }

    catch (error) {

        console.error("VIEW ERROR:", error);

        applicationContainer.innerHTML = `
            <div style="text-align:center;padding:40px;">
                <h2 style="color:#8B0000;">
                    Unable to load application details.
                </h2>
            </div>
        `;
    }

}

// =========================================
// SUBMIT REVIEWER DECISION
// =========================================

async function submitReviewerDecision() {

    const status = document.querySelector(
        'input[name="reviewerStatus"]:checked'
    );

    const comment =
        document.getElementById("reviewerComment").value.trim();

    if (!status) {

        Swal.fire({
            icon: "warning",
            title: "Choose a decision",
            text: "Please select Approve or Reject."
        });

        return;
    }

    try {

        const response = await fetch(
            `${BASE_URL}/api/reviewer/update-status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    applicationId,
                    status: status.value,
                    comment
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        Swal.fire({
            icon: "success",
            title: "Review Submitted",
            text: "Reviewer decision saved successfully."
        });

        loadApplication();

    }

    catch (error) {

        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Submission Failed",
            text: error.message
        });

    }

}

// =========================================
// LOAD PAGE
// =========================================

loadApplication();