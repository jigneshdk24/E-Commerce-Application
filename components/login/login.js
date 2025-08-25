// Delegate form submission to handle dynamically injected forms
document.addEventListener("submit", async function (event) {
  const form = event.target;
  if (!form || form.tagName !== "FORM") return;

  const usernameField = form.querySelector("#userEmail");
  const passwordField = form.querySelector("#userPassword");
  if (!usernameField || !passwordField) return;

  event.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');

  // Basic validation
  if (!usernameField.value.trim() || !passwordField.value.trim()) {
    alert("Please enter username and password");
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
      localStorage.setItem("authToken", result.accessToken || "");
      localStorage.setItem("currentUser", JSON.stringify(result));
      localStorage.setItem("isLoggedIn", "true");

      // Redirect to home page
      location.href = "../home/home.html";
    } else {
      const errorMsg = result?.message || "Login failed!";
      alert(errorMsg);
      console.warn("Login failed:", errorMsg);
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Network error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Login";
    }
  }
});
