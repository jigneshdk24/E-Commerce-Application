function renderCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  console.log(cart);

  const tbody = document.getElementById("cart-items");
  if (!tbody) return;

  if (cart.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center">Your cart is empty.</td></tr>`;
    return;
  }

  tbody.innerHTML = cart
    .map(
      (item,idx) => `
    <tr>
      <td>
      <div class="d-flex align-items-center gap-2" style="max-width: 50px;">
            <img src="../${item.image}" alt="${item.title}" class="img-fluid" />
            <span class="fw-semibold">
            ${item.title}
            </span>
            <button class="btn btn-sm btn-link text-danger p-0 ms-2" title="Remove" onclick="removeCartItem(${idx})">
              <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
      </td>
      <td>$${item.price}</td>
      <td class="d-flex justify-content-center">
         <input type="number" value="${
           item.qty ? item.qty : 1
         }" min="1" class="form-control cart-qty-input" data-idx="${idx}" style="width: 80px;" />
      </td>
      <td>$${item.price * (item.qty ? item.qty : 1)}</td>
    </tr>
  `
    )
    .join("");

  tbody.querySelectorAll(".cart-qty-input").forEach((input) => {    
    input.addEventListener("change", function () {
      const idx = parseInt(this.getAttribute("data-idx"));
      const newQty = parseInt(this.value);
      cart[idx].qty = newQty;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCartItems();
    });
  });

  
// Calculate subtotal
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.qty ? item.qty : 1),
    0
  );

  // Compute discount if coupon applied
  const coupon = (localStorage.getItem("appliedCoupon") || "").toUpperCase();
  const expected = generateCouponCode();
  const discountFactor = coupon === expected ? 0.7 : 1;
  const discountAmount = subtotal * 0.3;

  // Update subtotal and total in the DOM
  const subtotalCell = document.getElementById("cart-subtotal");
  const totalCell = document.getElementById("cart-total");
  const discountRow = document.getElementById("discount-row");
  const discountAmountCell = document.getElementById("discount-amount");
  const couponStatus = document.getElementById("coupon-status");
  
  //check if the cells exist before updating
  if (subtotalCell) subtotalCell.textContent = `$${subtotal.toFixed(2)}`;
  
  // Show/hide discount row and status
  if (discountRow) {
    discountRow.style.display = discountFactor === 0.7 ? "table-row" : "none";
  }
  if (discountAmountCell) {
    discountAmountCell.textContent = `-$${discountAmount.toFixed(2)}`;
  }
  if (couponStatus) {
    couponStatus.style.display = discountFactor === 0.7 ? "block" : "none";
  }
  
  // Show current coupon code for reference
  const couponFeedback = document.getElementById("coupon-feedback");
  const currentCouponCode = document.getElementById("current-coupon-code");
  if (couponFeedback && currentCouponCode) {
    if (discountFactor === 0.7) {
      currentCouponCode.textContent = expected;
      couponFeedback.style.display = "block";
    } else {
      couponFeedback.style.display = "none";
    }
  }
  
  //check if totalCell exists before updating
  if (totalCell) totalCell.textContent = `$${(subtotal * discountFactor).toFixed(2)}`;
}


// Remove item by index
function removeCartItem(idx) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.splice(idx, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCartItems();
  updateHeaderIcons();
}


// Update header icons
function updateHeaderIcons() {
  const wishlistCount = document.querySelector(".wishlist-count");
  if (wishlistCount) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    wishlistCount.textContent = wishlist.length;
  }

  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cartCount.textContent = cart.length;
    cartCount.style.display = cart.length ? "block" : "none";
  }
}


document.addEventListener("DOMContentLoaded", renderCartItems);

// Coupon format: <first4-of-user-firstName><DEVIT><FY><MON>
function getSelectedPeriodDate() {
  const input = document.getElementById("coupon-period");
  if (input && input.value) {
    const [y, m] = input.value.split("-").map(Number);
    if (y && m) return new Date(y, m - 1, 1);
  }
  return new Date();
}

function getUserPrefix() {
  try {
    const users = JSON.parse(localStorage.getItem("users") || "null");
    if (Array.isArray(users) && users.length) {
      const selectedId = localStorage.getItem("selectedUserId");
      const user = selectedId
        ? users.find(u => String(u.id) === String(selectedId)) || users[0]
        : users[0];
      const first = (user.firstName || "HARD").toString().toUpperCase();
      return first.slice(0, 4).padEnd(4, "X");
    }
  } catch(_) {}
  return "HARD"; // fallback
}

function generateCouponCode() {
  const date = getSelectedPeriodDate();
  const month = date.getMonth(); // 0=Jan
  const fyStart = month >= 3 ? date.getFullYear() : date.getFullYear() - 1; // FY starts in April
  const fy = `${String(fyStart).slice(-2)}${String(fyStart + 1).slice(-2)}`;
  const mon = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const prefix = getUserPrefix();
  return `${prefix}DEVIT${fy}${mon}`;
}

function setupCouponForm() {
  const input = document.getElementById("coupon");
  if (!input) return;
  const form = input.closest("form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = (input.value || "").trim().toUpperCase();
    if (!code) return;
    if (code === generateCouponCode()) {
      localStorage.setItem("appliedCoupon", code);
    } else {
      localStorage.removeItem("appliedCoupon");
      alert("Invalid coupon code");
    }
    renderCartItems();
  });

  // Re-evaluate coupon when period changes
  const period = document.getElementById("coupon-period");
  if (period) {
    period.addEventListener("change", () => {
      if (localStorage.getItem("appliedCoupon")) {
        // force re-validate stored code against new expected pattern
        const applied = localStorage.getItem("appliedCoupon");
        if (applied !== generateCouponCode()) {
          localStorage.removeItem("appliedCoupon");
        }
      }
      renderCartItems();
    });
  }
}

// Prefetch users (efficient, minimal) for future use
async function prefetchUsers() {
  try {
    const res = await fetch("https://dummyjson.com/users");
    const data = await res.json();
    if (data && data.users) localStorage.setItem("users", JSON.stringify(data.users));
  } catch (_) {}
}

document.addEventListener("DOMContentLoaded", () => {
  setupCouponForm();
  prefetchUsers();
});

// Proceed to checkout function
function proceedToCheckout() {
  window.location.href = '../billing/billing.html';
}
