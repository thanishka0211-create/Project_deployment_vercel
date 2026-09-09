const registerForm =
    document.getElementById("registerForm");


registerForm.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        // ========================================
        // GET VALUES
        // ========================================

        const full_name =
            document.getElementById("fullName")
                .value
                .trim();


        const email =
            document.getElementById("email")
                .value
                .trim();


        const role =
            document.getElementById("role")
                .value;


        const password =
            document.getElementById("password")
                .value;


        const confirmPassword =
            document.getElementById("confirmPassword")
                .value;



        // ========================================
        // ROLE VALIDATION
        // ========================================

        if (role === "") {

            Swal.fire({

                title: "Select Role",

                text:
                    "Please select your role.",

                icon: "warning"

            });

            return;
        }



        // ========================================
        // PASSWORD CHECK
        // ========================================

        if (password !== confirmPassword) {

            Swal.fire({

                title: "Password Mismatch",

                text:
                    "Password and Confirm Password must be the same.",

                icon: "warning"

            });

            return;
        }



        if (password.length < 6) {

            Swal.fire({

                title: "Weak Password",

                text:
                    "Password must contain at least 6 characters.",

                icon: "warning"

            });

            return;
        }



        try {


            // ========================================
            // REGISTER USER
            // ========================================

            const response =
                await fetch(API_BASE_URL + "/api/users/register",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                full_name,
                                email,
                                password,
                                role

                            })

                    }

                );


            const data =
                await response.json();



            // ========================================
            // SUCCESS
            // ========================================

            if (response.ok) {


                await Swal.fire({

                    title:
                        "Registration Successful!",

                    html:
                        `Account created successfully as <b>${role}</b>.`,

                    icon:
                        "success",

                    confirmButtonText:
                        "Go to Login"

                });


                window.location.href =
                    "login.html";

            }


            // ========================================
            // FAILED
            // ========================================

            else {


                Swal.fire({

                    title:
                        "Registration Failed",

                    text:
                        data.message ||
                        "Unable to create account.",

                    icon:
                        "error"

                });

            }


        } catch (error) {


            console.error(
                "Registration Error:",
                error
            );


            Swal.fire({

                title:
                    "Server Error",

                text:
                    "Unable to connect to the server.",

                icon:
                    "error"

            });

        }

    }

);