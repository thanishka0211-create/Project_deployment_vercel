// ========================================
// CHAIRPERSON DASHBOARD JS
// ========================================

console.log("CHAIRPERSON DASHBOARD LOADED");

const tableBody = document.getElementById("chairpersonTableBody");

// ========================================
// LOAD ALL APPLICATIONS
// ========================================

async function loadApplications() {
    try {
        const response = await fetch(API_BASE_URL + "/api/chairperson/applications/all")

        if (!response.ok) {
            throw new Error("Failed to fetch applications.");
        }

        const applications = await response.json();

        tableBody.innerHTML = "";

        if (applications.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center;padding:20px;">
                        No Applications Submitted Yet.
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

                    <!-- FINAL STATUS -->
                    <td class="status-${(application.final_status || "Pending").toLowerCase()}">
                        ${application.final_status || "Pending"}
                    </td>

                    <!-- REVIEWER STATUS -->
                    <td class="status-${(application.reviewer_status || "Pending").toLowerCase()}">
                        ${application.reviewer_status || "Pending"}
                    </td>

                    <!-- MEMBER SECRETARY STATUS -->
                    <td class="status-${(application.secretary_status || "Pending").toLowerCase()}">
                        ${application.secretary_status || "Pending"}
                    </td>

                    <!-- ACTION BUTTONS -->
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

        Swal.fire({
            title: "Error",
            text: "Unable to load applications.",
            icon: "error",
            confirmButtonColor: "#8B0000"
        });
    }
}

// ========================================
// VIEW APPLICATION
// ========================================

function viewApplication(applicationId) {
    window.location.href =
        `viewApplication.html?id=${applicationId}&role=chairperson`;
}

// ========================================
// APPROVE / REJECT APPLICATION
// ========================================

async function updateStatus(applicationId, status) {

    const { value: comment, isConfirmed } = await Swal.fire({
        title: `${status} Application`,
        input: "textarea",
        inputLabel: "Chairperson Comment",
        inputPlaceholder: "Write your final comments...",
        showCancelButton: true,
        confirmButtonText: status,
        confirmButtonColor:
            status === "Approved" ? "#2E8B57" : "#C0392B",
        cancelButtonColor: "#777"
    });

    if (!isConfirmed) return;

    try {
        const response = await fetch(
            "http://localhost:5000/api/chairperson/update-status",
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
            throw new Error(result.message || "Update failed.");
        }

        await Swal.fire({
            title: "Success!",
            text: result.message,
            icon: "success",
            confirmButtonColor: "#8B0000"
        });

        loadApplications();

    } catch (error) {

        console.error("Chairperson Update Error:", error);

        Swal.fire({
            title: "Update Failed",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#8B0000"
        });
    }
}

// ========================================
// LOGOUT
// ========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {

        localStorage.clear();

        Swal.fire({
            title: "Logged Out",
            icon: "success",
            timer: 1200,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "login.html";
        });

    });
}

// ========================================
// LOAD PAGE
// ========================================

loadApplications();