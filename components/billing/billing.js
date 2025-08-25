// Billing page functionality

// Load order summary from cart
function loadOrderSummary() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const productsContainer = document.getElementById("order-products");
  const subtotalEl = document.getElementById("order-subtotal");
  const totalEl = document.getElementById("order-total");
  
  if (!productsContainer || !subtotalEl || !totalEl) return;
  
  if (cart.length === 0) {
    productsContainer.innerHTML = '<p class="text-muted">No items in cart</p>';
    subtotalEl.textContent = '$0';
    totalEl.textContent = '$0';
    return;
  }
  
  // Display products
  productsContainer.innerHTML = cart.map(item => `
    <div class="d-flex align-items-center mb-3">
      <img src="../../${item.image}" alt="${item.title}" class="img-fluid me-3" style="width: 60px; height: 60px; object-fit: contain;">
      <div class="flex-grow-1">
        <h6 class="mb-1">${item.title}</h6>
        <small class="text-muted">Qty: ${item.qty || 1}</small>
      </div>
      <div class="text-end">
        <div class="fw-bold">$${item.price}</div>
        <small class="text-muted">$${(item.price * (item.qty || 1)).toFixed(2)}</small>
      </div>
    </div>
  `).join('');
  
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const appliedCoupon = localStorage.getItem("appliedCoupon");
  const discountFactor = appliedCoupon ? 0.7 : 1;
  const discountAmount = subtotal * 0.3;
  const total = subtotal * discountFactor;
  
  // Update display
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;
  
  // Show/hide discount row
  const discountRow = document.getElementById("discount-row");
  const discountAmountEl = document.getElementById("order-discount");
  if (discountRow && discountAmountEl) {
    if (appliedCoupon) {
      discountRow.style.display = "flex";
      discountAmountEl.textContent = `-$${discountAmount.toFixed(2)}`;
    } else {
      discountRow.style.display = "none";
    }
  }
  
  // Update header counts
  updateHeaderCounts();
}

// Apply coupon on checkout page
function applyCoupon() {
  const couponInput = document.getElementById("checkout-coupon");
  const code = (couponInput.value || "").trim().toUpperCase();
  
  if (!code) {
    alert("Please enter a coupon code");
    return;
  }
  
  // Check if coupon is valid (same logic as cart page)
  const expected = generateCouponCode();
  if (code === expected) {
    // Check if coupon has been used before
    const usedCoupons = JSON.parse(localStorage.getItem("usedCoupons") || "[]");
    if (usedCoupons.includes(code)) {
      alert("This coupon code has already been used!");
      return;
    }
    
    // Apply coupon
    localStorage.setItem("appliedCoupon", code);
    alert("Coupon applied successfully! 30% discount added.");
    loadOrderSummary(); // Refresh totals
  } else {
    localStorage.removeItem("appliedCoupon");
    alert("Invalid coupon code");
    loadOrderSummary(); // Refresh totals
  }
}

// Generate coupon code (same as cart page)
function generateCouponCode() {
  const now = new Date();
  const month = now.getMonth(); // 0=Jan
  const fyStart = month >= 3 ? now.getFullYear() : now.getFullYear() - 1; // FY starts in April
  const fy = `${String(fyStart).slice(-2)}${String(fyStart + 1).slice(-2)}`;
  const mon = now.toLocaleString("en-US", { month: "short" }).toUpperCase();
  
  // Get user prefix from API users
  try {
    const users = JSON.parse(localStorage.getItem("users") || "null");
    if (Array.isArray(users) && users.length) {
      const user = users[0]; // Use first user by default
      const first = (user.firstName || "HARD").toString().toUpperCase();
      const prefix = first.slice(0, 4).padEnd(4, "X");
      return `${prefix}DEVIT${fy}${mon}`;
    }
  } catch(_) {}
  
  return `HARDDEVIT${fy}${mon}`; // fallback
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

function validateStreetAddress() {
  const address = document.getElementById("streetAddress").value.trim();
  if (address.length < 10) {
    showFieldError("streetAddress", "Street address must be at least 10 characters");
    return false;
  }
  clearFieldError("streetAddress");
  return true;
}

function validateTownCity() {
  const townCity = document.getElementById("townCity").value.trim();
  if (townCity.length < 2) {
    showFieldError("townCity", "Town/City must be at least 2 characters");
    return false;
  }
  if (!/^[a-zA-Z\s]+$/.test(townCity)) {
    showFieldError("townCity", "Town/City can only contain letters and spaces");
    return false;
  }
  clearFieldError("townCity");
  return true;
}

function validatePostalCode() {
  const postalCode = document.getElementById("postalCode").value.trim();
  if (!/^\d{5,6}$/.test(postalCode)) {
    showFieldError("postalCode", "Postal code must be 5-6 digits");
    return false;
  }
  clearFieldError("postalCode");
  return true;
}

function validatePhoneNumber() {
  const phone = document.getElementById("phoneNumber").value.trim();
  if (!/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    showFieldError("phoneNumber", "Please enter a valid phone number");
    return false;
  }
  clearFieldError("phoneNumber");
  return true;
}

function validateEmail() {
  const email = document.getElementById("emailAddress").value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFieldError("emailAddress", "Please enter a valid email address");
    return false;
  }
  clearFieldError("emailAddress");
  return true;
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorDiv = document.getElementById(fieldId + "-error") || createErrorDiv(fieldId);
  
  field.classList.add("is-invalid");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorDiv = document.getElementById(fieldId + "-error");
  
  field.classList.remove("is-invalid");
  if (errorDiv) {
    errorDiv.style.display = "none";
  }
}

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
    validateStreetAddress(),
    validateTownCity(),
    validatePostalCode(),
    validatePhoneNumber(),
    validateEmail()
  ];
  
  return validations.every(validation => validation === true);
}

// Place order function
function placeOrder() {
  // Validate all fields first
  if (!validateAllFields()) {
    alert("Please fix all validation errors before placing order");
    return;
  }
  
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
  if (!paymentMethod) {
    alert("Please select a payment method");
    return;
  }
  
  // Get form data
  const formData = {
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    companyName: document.getElementById("companyName").value.trim(),
    streetAddress: document.getElementById("streetAddress").value.trim(),
    apartment: document.getElementById("apartment").value.trim(),
    townCity: document.getElementById("townCity").value.trim(),
    postalCode: document.getElementById("postalCode").value.trim(),
    phoneNumber: document.getElementById("phoneNumber").value.trim(),
    emailAddress: document.getElementById("emailAddress").value.trim(),
    saveInfo: document.getElementById("saveInfo").checked,
    paymentMethod: paymentMethod.value,
    cart: JSON.parse(localStorage.getItem("cart") || "[]"),
    appliedCoupon: localStorage.getItem("appliedCoupon"),
    orderDate: new Date().toISOString()
  };
  
  // Save user info to localStorage if checkbox is checked
  if (formData.saveInfo) {
    const userInfo = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      companyName: formData.companyName,
      streetAddress: formData.streetAddress,
      apartment: formData.apartment,
      townCity: formData.townCity,
      postalCode: formData.postalCode,
      phoneNumber: formData.phoneNumber,
      emailAddress: formData.emailAddress
    };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }
  
  // Save order to localStorage
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const orderId = Date.now();
  orders.push({
    id: orderId,
    ...formData
  });
  localStorage.setItem("orders", JSON.stringify(orders));
  
  // Mark coupon as used if it was applied
  if (formData.appliedCoupon) {
    const usedCoupons = JSON.parse(localStorage.getItem("usedCoupons") || "[]");
    usedCoupons.push(formData.appliedCoupon);
    localStorage.setItem("usedCoupons", JSON.stringify(usedCoupons));
  }
  
  // Clear cart and coupon
  localStorage.removeItem("cart");
  localStorage.removeItem("appliedCoupon");
  
  // Show success toast and redirect shortly after
  if (window.showToast) {
    showToast(`Order placed! ID: ${orderId}`, { type: 'success', timeout: 1800 });
    setTimeout(() => {
      window.location.href = "../home/home.html";
    }, 1600);
  } else {
    alert(`Order placed successfully! Order ID: ${orderId}`);
    window.location.href = "../home/home.html";
  }
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
  loadOrderSummary();
  setupFormValidation();
  loadSavedUserInfo();
  
  // Set current month in month picker if it exists
  const monthPicker = document.getElementById("coupon-period");
  if (monthPicker) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    monthPicker.value = `${year}-${month}`;
  }
});

// Setup real-time form validation
function setupFormValidation() {
  const fields = [
    { id: "firstName", validator: validateFirstName },
    { id: "lastName", validator: validateLastName },
    { id: "streetAddress", validator: validateStreetAddress },
    { id: "townCity", validator: validateTownCity },
    { id: "postalCode", validator: validatePostalCode },
    { id: "phoneNumber", validator: validatePhoneNumber },
    { id: "emailAddress", validator: validateEmail }
  ];
  
  fields.forEach(field => {
    const element = document.getElementById(field.id);
    if (element) {
      element.addEventListener("blur", field.validator);
      element.addEventListener("input", () => clearFieldError(field.id));
    }
  });
}

// Load saved user info if available
function loadSavedUserInfo() {
  const savedInfo = localStorage.getItem("userInfo");
  if (savedInfo) {
    try {
      const userInfo = JSON.parse(savedInfo);
      Object.keys(userInfo).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
          element.value = userInfo[key];
        }
      });
    } catch (e) {
      console.error("Error loading saved user info:", e);
    }
  }
}

// Placeholder functions for header functionality
function showOrders() {
  alert("Orders functionality coming soon!");
}

function logout() {
  alert("Logout functionality coming soon!");
}
