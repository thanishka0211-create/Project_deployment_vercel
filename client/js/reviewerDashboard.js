// ========================================
// REVIEWER DASHBOARD JS (FINAL)
// ========================================

console.log("REVIEWER DASHBOARD LOADED");

const tableBody = document.getElementById("reviewerTableBody");

// ========================================
// LOAD ALL APPLICATIONS
// ========================================

async function loadApplications() {
    try {
        const response = await fetch(API_BASE_URL + "/api/reviewer/applications");

        if (!response.ok) {
            throw new Error("Failed to fetch applications.");
        }

        const applications = await response.json();

        console.log("Applications Loaded:", applications);

        tableBody.innerHTML = "";

        if (applications.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">
                        No applications submitted.
                    </td>
                </tr>
            `;
            return;
        }

        applications.forEach((application) => {

            tableBody.innerHTML += `
                <tr>

                    <td>${application.application_id}</td>

                    <td>${application.project_title || "-"}</td>

                    <td>${application.principal_investigator || "-"}</td>

                    <td>${application.department || "-"}</td>

                    <td>
                        <span style="font-weight:bold;color:#8B0000;">
                            ${application.reviewer_status || "Pending"}
                        </span>
                    </td>

                    <td>

                        <button class="view-btn"
                            onclick="viewApplication(${application.application_id})">
                            View
                        </button>

                        <button class="approve-btn"
                            onclick="updateStatus(${application.application_id}, 'Approved')">
                            Approve
                        </button>

                        <button class="reject-btn"
                            onclick="updateStatus(${application.application_id}, 'Rejected')">
                            Reject
                        </button>

                    </td>

                </tr>
            `;
        });

    } catch (error) {

        console.error("Load Applications Error:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;color:red;">
                    Failed to load applications.
                </td>
            </tr>
        `;
    }
}

// ========================================
// VIEW APPLICATION
// ========================================

function viewApplication(applicationId) {
    window.location.href =
        `viewApplication.html?id=${applicationId}&role=reviewer`;
}

// ========================================
// APPROVE / REJECT WITH COMMENT
// ========================================

async function updateStatus(applicationId, status) {

    const { value: comment, isConfirmed } = await Swal.fire({

        title: `${status} Application`,

        input: "textarea",

        inputLabel: "Reviewer Comment",

        inputPlaceholder: "Enter your review comments...",

        showCancelButton: true,

        confirmButtonColor:
            status === "Approved" ? "#2E8B57" : "#C0392B",

        cancelButtonColor: "#777",

        confirmButtonText: status

    });

    if (!isConfirmed) return;

    try {

        const response = await fetch(
            "http://localhost:5000/api/reviewer/update-status",
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    applicationId,
                    status,
                    comment
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        await Swal.fire({
            title: "Success",
            text: result.message,
            icon: "success",
            confirmButtonColor: "#8B0000"
        });

        // Reload table
        loadApplications();

    } catch (error) {

        console.error("Update Error:", error);

        Swal.fire({
            title: "Update Failed",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#8B0000"
        });

    }
}

// ========================================
// LOGOUT BUTTON
// ========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {

        Swal.fire({
            title: "Logout?",
            text: "Do you want to logout from Reviewer Dashboard?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#8B0000",
            confirmButtonText: "Logout"

        }).then((result) => {

            if (result.isConfirmed) {
                localStorage.clear();
                window.location.href = "login.html";
            }

        });

    });
}

// ========================================
// LOAD DASHBOARD
// ========================================

loadApplications();