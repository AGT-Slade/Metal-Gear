  const loginForm = document.querySelector("form.login");
  const signupForm = document.querySelector("form.signup");
  const loginBtn = document.querySelector("label.login");
  const signupBtn = document.querySelector("label.signup");
  const signupLink = document.querySelector(".signup-link a");
  const loginText = document.querySelector(".title-text .login");


  signupBtn.onclick = function () {
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
  }

  loginBtn.onclick = function () {
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
  }

  signupLink.onclick = function () {
    signupBtn.click();
    return false;
  }