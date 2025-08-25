// Delegate form submission to handle dynamically injected forms
document.addEventListener("submit", async function (event) {
  const form = event.target;
  if (!form || form.tagName !== "FORM") return;

  const usernameField = form.querySelector("#userEmail");
  const passwordField = form.querySelector("#userPassword");
  const errorBox = form.querySelector("#login-error");
  if (!usernameField || !passwordField) return;

  event.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');

  // Reset error state
  if (errorBox) {
    errorBox.style.display = "none";
    errorBox.textContent = "";
  }

  // Basic validation
  if (!usernameField.value.trim() || !passwordField.value.trim()) {
    if (errorBox) {
      errorBox.textContent = "Please enter username and password";
      errorBox.style.display = "block";
    } else {
      alert("Please enter username and password");
    }
    return;
  }

  // Disable button while logging in
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";
  }

  try {
    console.log("Sending login request...");

    const response = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameField.value.trim(),
        password: passwordField.value.trim(),
      }),
    });

    const result = await response.json();
    console.log("Login API response:", result);

    if (response.ok) {
      // Save user session
      // dummyjson returns `token` for auth
      localStorage.setItem("authToken", result.token || result.accessToken || "");
      localStorage.setItem("currentUser", JSON.stringify(result));
      localStorage.setItem("isLoggedIn", "true");

      // Redirect to home page
      location.href = "../home/home.html";
    } else {
      const errorMsg = result?.message || result?.error || "Invalid username or password";
      if (errorBox) {
        errorBox.textContent = errorMsg;
        errorBox.style.display = "block";
      } else {
        alert(errorMsg);
      }
      console.warn("Login failed:", errorMsg);
    }
  } catch (error) {
    console.error("Network error:", error);
    if (errorBox) {
      errorBox.textContent = "Network error. Please try again.";
      errorBox.style.display = "block";
    } else {
      alert("Network error");
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Login";
    }
  }
});
