// Wishlist page logic using PRODUCTS_DATA from assets/js/products.js

// Generate star rating HTML
function createStars(ratingValue) {
  const fullStars = Math.floor(ratingValue);
  const halfStar = ratingValue % 1 !== 0;
  let starHTML = "";

  for (let i = 0; i < fullStars; i++)
    starHTML += '<i class="fa-solid fa-star text-warning"></i>';
  if (halfStar)
    starHTML += '<i class="fa-solid fa-star-half-stroke text-warning"></i>';
  for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++)
    starHTML += '<i class="fa-regular fa-star text-secondary"></i>'

  return starHTML;
}

// Get current wishlist from localStorage
function fetchWishlist() {
  try {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  } catch (err) {
    return [];
  }
}

// Save wishlist back to localStorage
function saveWishlist(ids) {
  localStorage.setItem("wishlist", JSON.stringify(ids));
}

// Render main wishlist section
function displayWishlist() {
  const container = document.getElementById("wishlist-container");
  const countEl = document.getElementById("wishlist-count");

  if (!container || !Array.isArray(PRODUCTS_DATA)) return;

  const wishlistIds = fetchWishlist();
  if (countEl) countEl.textContent = wishlistIds.length;

  if (!wishlistIds.length) {
    container.innerHTML = `
      <div class="text-center py-5">
        <p class="mb-3">Your wishlist is empty.</p>
        <a href="/components/home/home.html" class="btn btn-dark">Go Shopping</a>
      </div>
    `;
  } else {
    const wishlistItems = PRODUCTS_DATA.filter((item) =>
      wishlistIds.includes(item.id)
    );
    container.innerHTML = `
      <div class="row g-4">
        ${wishlistItems
          .map(
            (item) => `
          <div class="col-md-3 col-sm-6 d-flex">
            <div class="card border-0 h-100 flex-fill position-relative">
              <button class="btn btn-sm btn-light rounded-circle position-absolute top-0 end-0 m-2" onclick="removeFromWishlist(${item.id})" title="Remove">
                <i class="fa-solid fa-trash text-danger"></i>
              </button>
              <div class="card-img-top p-4 bg-secondary-subtle d-flex justify-content-center align-items-center" style="min-height: 220px;">
                <img src="${item.image}" alt="${item.title}" class="img-fluid" style="max-height: 160px; object-fit: contain;">
              </div>
              <button class="btn btn-dark mt-auto" onclick="addToCart(${item.id})"><i class="fa-solid fa-cart-plus me-2"></i>Add to Cart</button>
              <div class="card-body d-flex flex-column">
                <h6 class="card-title">${item.title}</h6>
                <div class="d-flex align-items-center mb-2">
                  <span class="fw-bold text-danger me-2">$${item.price}</span>
                </div>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  displayRecommendations(wishlistIds);
}

// Render Just For You recommendations
function displayRecommendations(wishlistIds) {
  const container = document.getElementById("product-list-just-for-you");
  if (!container || !Array.isArray(PRODUCTS_DATA)) return;

  const recommended = PRODUCTS_DATA.filter(
    (p) => !wishlistIds.includes(p.id)
  ).slice(0, 4);

  container.innerHTML = recommended
    .map(
      (prod) => `
    <div class="col-md-3 col-sm-6 d-flex">
      <div class="card border-0 flex-fill position-relative h-100">
        <div class="card-img-top p-4 bg-secondary-subtle d-flex justify-content-center align-items-center" style="min-height: 220px;">
          <button class="btn btn-outline-secondary position-absolute top-0 end-0 m-2 rounded-5 bg-white border-0" onclick="addToWishlist(${prod.id})" title="Add to Wishlist">
            <i class="fa-regular fa-heart text-secondary"></i>
          </button>
          <img src="${prod.image}" alt="${
        prod.title
      }" class="img-fluid" style="max-height: 160px; object-fit: contain;">
        </div>
        <button class="btn btn-dark mt-auto" onclick="addToCart(${prod.id})"><i class="fa-solid fa-cart-plus me-2"></i>Add to Cart</button>
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${prod.title}</h6>
          <div class="d-flex align-items-center mb-2">
            <span class="fw-bold text-danger me-2">$${prod.price}</span>
          </div>
          <div class="d-flex align-items-center mb-2">
            <span class="text-warning">${createStars(prod.rating)}</span>
            <span class="text-secondary small ms-2">(${prod.reviews})</span>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// Add product to wishlist
function addToWishlist(productId) {
  const ids = fetchWishlist();
  if (!ids.includes(productId)) {
    ids.push(productId);
    saveWishlist(ids);
    displayWishlist();
    updateHeaderCount();
    
    // Show success message
    const btn = event.target.closest('button');
    const originalIcon = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-heart text-danger"></i>';
    btn.classList.replace('btn-outline-secondary', 'btn-danger');
    
    setTimeout(() => {
      btn.innerHTML = originalIcon;
      btn.classList.replace('btn-danger', 'btn-outline-secondary');
    }, 1500);
  }
}

// Remove product from wishlist
function removeFromWishlist(productId) {
  const updatedIds = fetchWishlist().filter((id) => id !== productId);
  saveWishlist(updatedIds);
  displayWishlist();
  updateHeaderCount();
}

// Add product to cart
function addToCart(productId) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    if (product) {
      cart.push({ ...product, qty: 1 });
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  
  // Show success message
  const btn = event.target.closest('button');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Added!';
  btn.classList.replace('btn-dark', 'btn-success');
  
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.classList.replace('btn-success', 'btn-dark');
  }, 1500);
}

// Move all wishlist items to cart
function moveAllToCart() {
  const wishlistIds = fetchWishlist();
  if (wishlistIds.length === 0) {
    alert('Your wishlist is empty!');
    return;
  }
  
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  wishlistIds.forEach(id => {
    const product = PRODUCTS_DATA.find((p) => p.id === id);
    if (product) {
      const existing = cart.find((item) => item.id === id);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ ...product, qty: 1 });
      }
    }
  });
  
  localStorage.setItem("cart", JSON.stringify(cart));
  
  // Clear wishlist
  saveWishlist([]);
  
  // Show success message
  alert(`Moved ${wishlistIds.length} items to cart!`);
  
  // Refresh display
  displayWishlist();
  updateHeaderCount();
}

// Update header wishlist count
function updateHeaderCount() {
  const wishlistCount = fetchWishlist().length;
  
  // Try to update the header count if it exists
  const headerCount = document.querySelector('#header .wishlist-count');
  if (headerCount) {
    headerCount.textContent = wishlistCount;
    headerCount.style.display = wishlistCount ? "block" : "none";
  }
  
  // Also update the local count on the page
  const localCount = document.getElementById('wishlist-count');
  if (localCount) {
    localCount.textContent = wishlistCount;
  }
}

// Wait for header to load before initializing
function waitForHeader() {
  return new Promise((resolve) => {
    const checkHeader = () => {
      const header = document.getElementById('header');
      if (header && header.innerHTML.trim() !== '') {
        resolve();
      } else {
        setTimeout(checkHeader, 100);
      }
    };
    checkHeader();
  });
}

// Expose functions globally
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.addToCart = addToCart;
window.moveAllToCart = moveAllToCart;

// Initialize wishlist after header loads
async function initializeWishlist() {
  try {
    // Wait for header to load
    await waitForHeader();
    
    // Small delay to ensure everything is ready
    setTimeout(() => {
      displayWishlist();
      updateHeaderCount();
    }, 200);
  } catch (error) {
    console.error('Error initializing wishlist:', error);
    // Fallback: initialize without waiting for header
    displayWishlist();
    updateHeaderCount();
  }
}

// Initialize wishlist on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initializeWishlist();
});
