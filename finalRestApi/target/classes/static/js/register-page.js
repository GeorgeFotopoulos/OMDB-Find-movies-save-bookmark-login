const registerForm = document.getElementById("form-container");
const registerButton = document.getElementById("register-form-submit");
const registerErrorMsg = document.getElementById("register-error-msg");

registerButton.addEventListener("click", (e) => {
    e.preventDefault();
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    const confirm_password = registerForm.confirm_password.value;

    if (isEmpty(email) || isEmpty(password) || isEmpty(confirm_password)) {
        registerErrorMsg.innerHTML = "E-mail, Password & Confirm Password fields must be filled!";
        registerErrorMsg.style.borderColor = "red";
        registerErrorMsg.style.opacity = 1;
    } else {
        if (password !== confirm_password) {
            registerErrorMsg.innerHTML = "Passwords do not match!";
            registerErrorMsg.style.borderColor = "red";
            registerErrorMsg.style.opacity = 1;
        } else {
            registerErrorMsg.style.opacity = 0;
            var User = {
                email: email,
                password: password
            }
            $.ajax({
                type: "POST",
                url: "/register",
                data: JSON.stringify(User),
                contentType: 'application/json',
                dataType: "text",
                error: function(response) {},
                success: function(response) {
                    if (response === "Succesful") {
                        registerErrorMsg.innerHTML = "Account successfully created!";
                        registerErrorMsg.style.borderColor = "green";
                        registerErrorMsg.style.opacity = 1;
                        setTimeout(() => {
                            localStorage.setItem("session", email);
                            window.location.replace("index.html");
                        }, 1500);
                    } else {
                        registerErrorMsg.innerHTML = "There is already an account using this email!";
                        registerErrorMsg.style.borderColor = "red";
                        registerErrorMsg.style.opacity = 1;
                    }
                }
            });
        }
    }
})

function isEmpty(str) {
    return (!str || 0 === str.length);
}

document.getElementById('clickable').addEventListener('click', clickDiv);

function clickDiv() {
    window.location.replace("login.html");
}