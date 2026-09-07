console.log("APPLICATION JS LOADED");

// ========================================
// STEP NAVIGATION
// ========================================

const steps = document.querySelectorAll(".form-step");
let currentStep = 0;

function showStep(step) {

    steps.forEach((item) => item.classList.remove("active"));

    steps[step].classList.add("active");

    const progress = ((step + 1) / steps.length) * 100;

    document.getElementById("progressBar").style.width = progress + "%";

    document.getElementById("stepIndicator").innerText =
        `Step ${step + 1} of ${steps.length}`;
}

// First step
showStep(0);

// STEP 1
document.getElementById("nextBtn").addEventListener("click", () => {

    const applicant = document.getElementById("applicantName").value.trim();

    if (applicant === "") {
        Swal.fire({
            title: "Applicant Name Required",
            text: "Please enter Applicant Name.",
            icon: "warning",
            confirmButtonColor: "#8B0000"
        });
        return;
    }

    currentStep++;
    showStep(currentStep);

});

// Previous button of Step 2
document.getElementById("prevBtn").addEventListener("click", () => {
    currentStep--;
    showStep(currentStep);
});

// Remaining Steps
for (let i = 2; i <= 10; i++) {

    const nextBtn = document.getElementById(`nextBtn${i}`);
    const prevBtn = document.getElementById(`prevBtn${i}`);

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentStep++;
            showStep(currentStep);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            currentStep--;
            showStep(currentStep);
        });
    }
}

// ========================================
// FINAL SUBMIT
// ========================================

document.getElementById("applicationForm").addEventListener("submit", async function (e) {

    e.preventDefault();

    // Declaration
    const terms = document.getElementById("termsAccepted");

    if (terms && !terms.checked) {

        Swal.fire({
            title: "Declaration Required",
            text: "Please accept the declaration before submitting.",
            icon: "warning",
            confirmButtonColor: "#8B0000"
        });

        return;
    }

    // Logged-in User
    const userId = localStorage.getItem("user_id");

    if (!userId) {

        Swal.fire({
            title: "Login Required",
            text: "Please login again.",
            icon: "error",
            confirmButtonColor: "#8B0000"
        }).then(() => {
            window.location.href = "login.html";
        });

        return;
    }

    // Form
    const form = document.getElementById("applicationForm");
    const formData = new FormData(form);

    // ----------------------------------------
    // Main Application Fields
    // ----------------------------------------

    const piInput = document.getElementById("principalInvestigator");
    const titleInput = document.getElementById("researchTitle");
    const departmentInput = document.getElementById("department");
    const researchTypeInput = document.getElementById("researchType");

    const piName = piInput ? piInput.value.trim() : "";
    const projectTitle = titleInput ? titleInput.value.trim() : "";
    const department = departmentInput ? departmentInput.value.trim() : "";
    const projectType = researchTypeInput ? researchTypeInput.value.trim() : "";

    // Replace values (don't append duplicates)
    formData.set("user_id", userId);
    formData.set("pi_name", piName);
    formData.set("project_title", projectTitle);
    formData.set("department", department);
    formData.set("project_type", projectType);

    // ----------------------------------------
    // Debug
    // ----------------------------------------

    console.log("USER ID:", userId);
    console.log("PI:", piName);
    console.log("TITLE:", projectTitle);
    console.log("DEPARTMENT:", department);
    console.log("TYPE:", projectType);

    // Show all fields
    for (const pair of formData.entries()) {
        console.log(pair[0], ":", pair[1]);
    }

    // ----------------------------------------
    // Send to Backend
    // ----------------------------------------

    try {

        const response = await fetch(
            "http://localhost:5000/api/applications/submit",
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Application Submission Failed");
        }

       await Swal.fire({
            title: "Application Submitted! 🎉",
            text: "Your Research Ethics Committee application has been submitted successfully.",
            icon: "success",
            confirmButtonText: "View My Applications",
            confirmButtonColor: "#8B0000"
});

window.location.href = "myApplications.html";

    } catch (error) {

        console.error("SUBMISSION ERROR:", error);

        Swal.fire({
            title: "Submission Failed",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#8B0000"
        });

    }

});