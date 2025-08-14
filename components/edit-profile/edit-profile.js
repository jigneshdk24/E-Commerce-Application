// Edit Profile Page Functionality

// Load user profile data
function loadUserProfile() {
  // Try to load from localStorage first
  const savedUserInfo = localStorage.getItem("userInfo");
  const savedProfile = localStorage.getItem("userProfile");
  
  if (savedUserInfo) {
    try {
      const userInfo = JSON.parse(savedUserInfo);
      populateFormFields(userInfo);
    } catch (e) {
      console.error("Error loading saved user info:", e);
    }
  } else if (savedProfile) {
    try {
      const profile = JSON.parse(savedProfile);
      populateFormFields(profile);
    } catch (e) {
      console.error("Error loading saved profile:", e);
    }
  }
  
  // Update welcome message
  updateWelcomeMessage();
}

// Populate form fields with user data
function populateFormFields(userData) {
  const fields = ['firstName', 'lastName', 'email', 'address'];
  fields.forEach(field => {
    const element = document.getElementById(field);
    if (element && userData[field]) {
      element.value = userData[field];
    }
  });
}

// Update welcome message
function updateWelcomeMessage() {
  const firstName = document.getElementById("firstName")?.value || "Md";
  const lastName = document.getElementById("lastName")?.value || "Rimel";
  const welcomeElement = document.getElementById("welcome-user");
  
  if (welcomeElement) {
    welcomeElement.textContent = `${firstName} ${lastName}`;
  }
}

// Form validation functions
function validateFirstName() {
  const firstName = document.getElementById("firstName").value.trim();
  if (firstName.length < 2) {
    showFieldError("firstName", "First name must be at least 2 characters");
    return false;
  }
  if (!/^[a-zA-Z\s]+$/.test(firstName)) {
    showFieldError("firstName", "First name can only contain letters and spaces");
    return false;
  }
  clearFieldError("firstName");
  return true;
}

function validateLastName() {
  const lastName = document.getElementById("lastName").value.trim();
  if (lastName.length < 2) {
    showFieldError("lastName", "Last name must be at least 2 characters");
    return false;
  }
  if (!/^[a-zA-Z\s]+$/.test(lastName)) {
    showFieldError("lastName", "Last name can only contain letters and spaces");
    return false;
  }
  clearFieldError("lastName");
  return true;
}

function validateEmail() {
  const email = document.getElementById("email").value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFieldError("email", "Please enter a valid email address");
    return false;
  }
  clearFieldError("email");
  return true;
}

function validateAddress() {
  const address = document.getElementById("address").value.trim();
  if (address.length < 10) {
    showFieldError("address", "Address must be at least 10 characters");
    return false;
  }
  clearFieldError("address");
  return true;
}

function validatePasswordChange() {
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  
  // If any password field is filled, validate all
  if (currentPassword || newPassword || confirmPassword) {
    if (!currentPassword) {
      showFieldError("currentPassword", "Current password is required to change password");
      return false;
    }
    if (!newPassword) {
      showFieldError("newPassword", "New password is required");
      return false;
    }
    if (newPassword.length < 6) {
      showFieldError("newPassword", "New password must be at least 6 characters");
      return false;
    }
    if (newPassword !== confirmPassword) {
      showFieldError("confirmPassword", "Passwords do not match");
      return false;
    }
    
    // Clear errors if validation passes
    clearFieldError("currentPassword");
    clearFieldError("newPassword");
    clearFieldError("confirmPassword");
  }
  
  return true;
}

// Show field error
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorDiv = document.getElementById(fieldId + "-error") || createErrorDiv(fieldId);
  
  field.classList.add("is-invalid");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}

// Clear field error
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorDiv = document.getElementById(fieldId + "-error");
  
  field.classList.remove("is-invalid");
  if (errorDiv) {
    errorDiv.style.display = "none";
  }
}

// Create error div
function createErrorDiv(fieldId) {
  const field = document.getElementById(fieldId);
  const errorDiv = document.createElement("div");
  errorDiv.id = fieldId + "-error";
  errorDiv.className = "invalid-feedback";
  errorDiv.style.display = "none";
  
  field.parentNode.appendChild(errorDiv);
  return errorDiv;
}

// Validate all fields
function validateAllFields() {
  const validations = [
    validateFirstName(),
    validateLastName(),
    validateEmail(),
    validateAddress(),
    validatePasswordChange()
  ];
  
  return validations.every(validation => validation === true);
}

// Save profile changes
function saveProfileChanges() {
  if (!validateAllFields()) {
    alert("Please fix all validation errors before saving");
    return;
  }
  
  // Get form data
  const profileData = {
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    email: document.getElementById("email").value.trim(),
    address: document.getElementById("address").value.trim(),
    lastUpdated: new Date().toISOString()
  };
  
  // Handle password change if provided
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  
  if (currentPassword && newPassword) {
    // In a real app, you would verify current password and hash the new one
    profileData.passwordChanged = true;
    profileData.passwordLastChanged = new Date().toISOString();
    
    // Clear password fields
    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
  }
  
  // Save to localStorage
  localStorage.setItem("userProfile", JSON.stringify(profileData));
  
  // Also update userInfo if it exists (for billing purposes)
  const existingUserInfo = localStorage.getItem("userInfo");
  if (existingUserInfo) {
    try {
      const userInfo = JSON.parse(existingUserInfo);
      const updatedUserInfo = { ...userInfo, ...profileData };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
    } catch (e) {
      console.error("Error updating userInfo:", e);
    }
  }
  
  // Update welcome message
  updateWelcomeMessage();
  
  // Show success message
  alert("Profile updated successfully!");
  
  // Clear any password fields
  clearPasswordFields();
}

// Cancel changes
function cancelChanges() {
  if (confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
    loadUserProfile(); // Reload original data
    clearPasswordFields();
    clearAllErrors();
  }
}

// Clear password fields
function clearPasswordFields() {
  document.getElementById("currentPassword").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmPassword").value = "";
}

// Clear all field errors
function clearAllErrors() {
  const fields = ['firstName', 'lastName', 'email', 'address', 'currentPassword', 'newPassword', 'confirmPassword'];
  fields.forEach(fieldId => clearFieldError(fieldId));
}

// Setup form validation
function setupFormValidation() {
  const fields = [
    { id: "firstName", validator: validateFirstName },
    { id: "lastName", validator: validateLastName },
    { id: "email", validator: validateEmail },
    { id: "address", validator: validateAddress }
  ];
  
  fields.forEach(field => {
    const element = document.getElementById(field.id);
    if (element) {
      element.addEventListener("blur", field.validator);
      element.addEventListener("input", () => clearFieldError(field.id));
    }
  });
  
  // Password validation on blur
  const passwordFields = ["currentPassword", "newPassword", "confirmPassword"];
  passwordFields.forEach(fieldId => {
    const element = document.getElementById(fieldId);
    if (element) {
      element.addEventListener("blur", validatePasswordChange);
      element.addEventListener("input", () => clearFieldError(fieldId));
    }
  });
}

// Update header counts
function updateHeaderCounts() {
  const wishlistCount = document.querySelector(".wishlist-count");
  const cartCount = document.querySelector(".cart-count");
  
  if (wishlistCount) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    wishlistCount.textContent = wishlist.length;
    wishlistCount.style.display = wishlist.length ? "block" : "none";
  }
  
  if (cartCount) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cartCount.textContent = cart.length;
    cartCount.style.display = cart.length ? "block" : "none";
  }
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  setupFormValidation();
  updateHeaderCounts();
  
  // Setup form submission
  const form = document.getElementById("profile-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      saveProfileChanges();
    });
  }
});

// Placeholder functions for header functionality
function showOrders() {
  alert("Orders functionality coming soon!");
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    // Clear user session data
    localStorage.removeItem("userProfile");
    localStorage.removeItem("userInfo");
    
    // Redirect to home page
    window.location.href = "../home/home.html";
  }
}
