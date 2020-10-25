const loginForm = document.getElementById("form-container");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    if (isEmpty(email) || isEmpty(password)) {
        loginErrorMsg.innerHTML = "E-mail & Password fields must be filled!";
        loginErrorMsg.style.borderColor = "red";
        loginErrorMsg.style.opacity = 1;
    } else {
        loginErrorMsg.style.opacity = 0;
        var User = {
            email: email,
            password: password
        }
        $.ajax({
            type: "POST",
            url: "/login",
            data: JSON.stringify(User),
            contentType: 'application/json',
            dataType: "text",
            error: function(response) {
                alert("Something went wrong!");
            },
            success: function(response) {
                if (response === "Succesful") {
                    loginErrorMsg.innerHTML = "Login Succesful!";
                    loginErrorMsg.style.borderColor = "green";
                    loginErrorMsg.style.opacity = 1;
                    setTimeout(() => {
                        localStorage.setItem("session", email);
                        window.location.replace("index.html");
                    }, 1500);
                } else if (response === "WrongPassword") {
                    loginErrorMsg.innerHTML = "Invalid password!";
                    loginErrorMsg.style.borderColor = "red";
                    loginErrorMsg.style.opacity = 1;
                } else {
                    loginErrorMsg.innerHTML = "No account found using the email provided!";
                    loginErrorMsg.style.borderColor = "red";
                    loginErrorMsg.style.opacity = 1;
                }
            }
        });
    }
});

function isEmpty(str) {
    return (!str || 0 === str.length);
}

document.getElementById('clickable').addEventListener('click', clickDiv);

function clickDiv() {
    window.location.replace("register.html");
}