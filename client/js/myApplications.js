const tableBody = document.getElementById("applicationTableBody");

// ==========================================
// LOAD ONLY LOGGED-IN RESEARCHER'S APPLICATIONS
// ==========================================

async function loadMyApplications() {

    const userId = localStorage.getItem("user_id");

    try {

        const response = await fetch(API_BASE_URL + "/api/login")

        if (!response.ok) {
            throw new Error("Failed to fetch applications");
        }

        const data = await response.json();

        tableBody.innerHTML = "";

        // ==================================
        // NO APPLICATIONS
        // ==================================

        if (data.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">
                        No applications found.
                    </td>
                </tr>
            `;

            return;
        }

        // ==================================
        // DISPLAY APPLICATIONS
        // ==================================

        data.forEach(application => {

            const row = `
                <tr>

                    <td>${application.application_id}</td>

                    <td>${application.project_title || "-"}</td>

                    <td>${application.principal_investigator || "-"}</td>

                    <td>${application.department || "-"}</td>

                    <td>
                        <span class="status-badge ${(application.final_status || "Pending").toLowerCase()}">
                            ${application.final_status || "Pending"}
                        </span>
                    </td>
                    <td>
                        <button
                            class="view-btn"
                            onclick="viewApplication(${application.application_id})">
                            View
                        </button>
                    </td>

                </tr>
            `;

            tableBody.innerHTML += row;

        });

    } catch (error) {

        console.error("LOAD APPLICATION ERROR:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;color:red;">
                    Failed to load applications.
                </td>
            </tr>
        `;

    }

}

// ==========================================
// VIEW APPLICATION
// ==========================================

function viewApplication(applicationId) {

    window.location.href =
        `viewApplication.html?id=${applicationId}`;

}

// ==========================================
// START
// ==========================================

loadMyApplications();