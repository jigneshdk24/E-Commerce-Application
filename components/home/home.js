// Render star rating HTML
function getStarHTML(ratingValue) {
  const full = Math.floor(ratingValue);
  const half = ratingValue % 1 >= 0.5;
  const empty = 5 - Math.ceil(ratingValue);
  let html = "";

  for (let i = 0; i < full; i++)
    html += '<i class="fa-solid fa-star text-warning"></i>';
  if (half) html += '<i class="fa-solid fa-star-half-stroke text-warning"></i>';
  for (let i = 0; i < empty; i++)
    html += '<i class="fa-regular fa-star text-warning"></i>';

  return html;
}

// Render product cards
function showProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;

  container.innerHTML = PRODUCTS_DATA.map((product) => {
    const inWishlist = checkWishlist(product.id);
    return `
      <div class="col-md-3 mb-4 d-flex">
        <div class="card border-0 h-100 w-100 d-flex flex-column" id="prod-${
          product.id
        }">
          <div class="p-5 bg-secondary-subtle rounded-3 position-relative d-flex justify-content-center align-items-center" style="min-height:220px;">
            <button class="btn position-absolute top-0 end-0 m-2 rounded-circle bg-white border-0 wishlist-btn" 
                    id="wish-${product.id}" 
                    onclick="toggleWishlistItem(${product.id})">
              <i class="fa-${inWishlist ? "solid" : "regular"} fa-heart text-${
      inWishlist ? "danger" : "secondary"
    }"></i>
            </button>
            <button class="btn btn-outline-secondary position-absolute top-0 end-0 m-2 mt-5 rounded-circle bg-white border-0">
              <i class="fa-regular fa-eye text-secondary"></i>
            </button>
            <img src="${product.image}" class="img-fluid" alt="${
      product.title
    }" style="max-width:120px; max-height:120px; object-fit:contain;">
          </div>

          <button class="btn btn-dark opacity-0" id="cart-${
            product.id
          }">Add to Cart</button>

          <div class="card-body d-flex flex-column flex-grow-1">
            <h6 class="fw-bold">${product.title}</h6>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <span class="text-danger fw-bold">$${product.price}</span>
              <span>${getStarHTML(product.rating)}</span>
              <span class="text-secondary small">(${product.reviews})</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Add hover & cart logic
  PRODUCTS_DATA.forEach((product) => {
    const card = document.getElementById(`prod-${product.id}`);
    const cartBtn = document.getElementById(`cart-${product.id}`);
    if (!card || !cartBtn) return;

    card.addEventListener("mouseenter", () =>
      cartBtn.classList.replace("opacity-0", "opacity-100")
    );
    card.addEventListener("mouseleave", () =>
      cartBtn.classList.replace("opacity-100", "opacity-0")
    );

    cartBtn.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((item) => item.id === product.id);
      if (existing) existing.qty++;
      else cart.push({ ...product, qty: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      updateIcons();

      // toast
      if (window.showToast) {
        showToast(`${product.title} added to cart`, { type: 'success' });
      }
    });
  });
}

// Render feature cards
function showFeatures() {
  const container = document.getElementById("features");
  if (!container) return;

  container.innerHTML = FEATURES_DATA.map(
    (f) => `
    <div class="col-md-4 mb-4">
      <div class="card border-0 h-100 d-flex flex-column align-items-center">
        <div class="rounded-circle bg-secondary-subtle d-flex justify-content-center align-items-center p-4 mt-3">
          <div class="rounded-circle bg-dark d-flex justify-content-center align-items-center p-3">
            <i class="fa-solid ${f.icon} text-white fs-1"></i>
          </div>
        </div>
        <div class="card-body text-center">
          <h5 class="mt-3 fw-bold">${f.title}</h5>
          <p class="text-muted fw-medium">${f.description}</p>
        </div>
      </div>
    </div>
  `
  ).join("");
}

// Wishlist helpers
function checkWishlist(id) {
  const list = JSON.parse(localStorage.getItem("wishlist") || "[]");
  return list.includes(id);
}

function toggleWishlistItem(id) {
  const list = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const btn = document.getElementById(`wish-${id}`);
  const icon = btn.querySelector("i");

  if (list.includes(id)) {
    localStorage.setItem(
      "wishlist",
      JSON.stringify(list.filter((x) => x !== id))
    );
    icon.className = "fa-regular fa-heart text-secondary";
  } else {
    list.push(id);
    localStorage.setItem("wishlist", JSON.stringify(list));
    icon.className = "fa-solid fa-heart text-danger";
    if (window.showToast) {
      const product = PRODUCTS_DATA.find(p => p.id === id);
      showToast(`${product ? product.title : 'Item'} added to wishlist`, { type: 'success' });
    }
  }

  updateIcons();
}

// Update cart & wishlist counts in header
function updateIcons() {
  const wishCount = document.querySelector(".wishlist-count");
  const cartCount = document.querySelector(".cart-count");
  wishCount &&
    (wishCount.textContent = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    ).length);
  cartCount &&
    (cartCount.textContent = JSON.parse(
      localStorage.getItem("cart") || "[]"
    ).length);
}

// Expose globally
window.showProducts = showProducts;
window.showFeatures = showFeatures;
window.toggleWishlistItem = toggleWishlistItem;

document.addEventListener("DOMContentLoaded", () => {
  showProducts();
  showFeatures();
  updateIcons();
});