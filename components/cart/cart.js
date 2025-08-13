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

  // Update subtotal and total in the DOM
  const subtotalCell = document.getElementById("cart-subtotal");
  const totalCell = document.getElementById("cart-total");
  //check if the cells exist before updating
  if (subtotalCell) subtotalCell.textContent = `$${subtotal}`;
  //check if totalCell exists before updating
  if (totalCell) totalCell.textContent = `$${subtotal}`;
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
