const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    try {
        const response = await fetch(API_BASE_URL + "/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                role
            })
        });

        const data = await response.json();

        if (!response.ok) {
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: data.message
            });
            return;
        }

        // Save login details
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.name);

        Swal.fire({
            icon: "success",
            title: "Login Successful!",
            timer: 1200,
            showConfirmButton: false
        }).then(() => {

            if (data.role === "Researcher") {
                window.location.href = "dashboard.html";
            } else if (data.role === "Reviewer") {
                window.location.href = "reviewerDashboard.html";
            } else if (data.role === "Member Secretary") {
                window.location.href = "memberSecretaryDashboard.html";
            } else if (data.role === "Chairperson") {
                window.location.href = "chairpersonDashboard.html";
            }

        });

    } catch (error) {
        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Server Error",
            text: "Cannot connect to backend."
        });
    }
});