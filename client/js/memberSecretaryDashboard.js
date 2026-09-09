// ========================================
// MEMBER SECRETARY DASHBOARD JS
// ========================================

console.log("MEMBER SECRETARY DASHBOARD LOADED");

const tableBody = document.getElementById("memberSecretaryTableBody");
const logoutBtn = document.getElementById("logoutBtn");

// ========================================
// LOAD APPLICATIONS
// ========================================

async function loadApplications() {

    try {

        const response = await fetch(
    API_BASE_URL + "/api/applications/all"
);
        const applications = await response.json();

        tableBody.innerHTML = "";

        if (applications.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;padding:20px;">
                        No Applications Found.
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

                    <!-- MEMBER SECRETARY STATUS -->
                    <td class="status-${(application.secretary_status || "Pending").toLowerCase()}">
                        ${application.secretary_status || "Pending"}
                    </td>

                    <!-- REVIEWER DECISION -->
                    <td class="status-${(application.reviewer_status || "Pending").toLowerCase()}">
                        ${application.reviewer_status || "Pending"}
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

function viewApplication(id) {
    window.location.href = `viewApplication.html?id=${id}&role=secretary`;
}

// ========================================
// APPROVE / REJECT
// ========================================

async function updateStatus(applicationId, status) {

    const { value: comment, isConfirmed } = await Swal.fire({
        title: `${status} Application`,
        input: "textarea",
        inputLabel: "Member Secretary Comment",
        inputPlaceholder: "Write your comments...",
        showCancelButton: true,
        confirmButtonText: status,
        confirmButtonColor: status === "Approved" ? "#2E8B57" : "#C0392B",
        cancelButtonColor: "#777"
    });

    if (!isConfirmed) return;

    try {

        const response = await fetch(
            API_BASE_URL + "/api/member-secretary/update-status",
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
            title: "Success!",
            text: result.message,
            icon: "success",
            confirmButtonColor: "#8B0000"
        });

        loadApplications();

    } catch (error) {

        console.error("Member Secretary Update Error:", error);

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

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        await Swal.fire({
            title: "Logged Out",
            text: "You have been logged out successfully.",
            icon: "success",
            timer: 1200,
            showConfirmButton: false
        });

        localStorage.clear();
        sessionStorage.clear();

        window.location.href = "login.html";

    });

}

// ========================================
// LOAD PAGE
// ========================================

loadApplications();