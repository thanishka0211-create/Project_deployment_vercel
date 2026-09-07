// Logout
document.getElementById("logout").addEventListener("click", function () {

    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");

    window.location.href = "login.html";

});

// New Application
document.getElementById("newApplication").addEventListener("click", function () {

    window.location.href = "application.html";

});

// My Applications
document.getElementById("myApplications").addEventListener("click", function () {
    window.location.href="myApplications.html";
});