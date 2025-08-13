
// Header Loading & LocalStorage Updates

const loadHeader = async () => {
  try {
    const res = await fetch("/components/header/header.html");
    const html = await res.text();
    document.getElementById("header").innerHTML = html;

    // Update wishlist & cart counts
    const refreshCounts = () => {
      const wishlistItems = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

      const wishlistBadge = document.querySelector("#header .wishlist-count");
      const cartBadge = document.querySelector("#header .cart-count");
      const wishlistIcon = document.querySelector(
        '#header a[title="Wishlist"] i'
      );

      if (wishlistBadge) {
        wishlistBadge.textContent = wishlistItems.length;
        wishlistBadge.style.display = wishlistItems.length ? "block" : "none";
      }
      if (wishlistIcon) {
        wishlistIcon.className = wishlistItems.length
          ? "fa-solid fa-heart fs-5 text-danger"
          : "fa-solid fa-heart fs-5";
      }
      if (cartBadge) {
        cartBadge.textContent = cartItems.length;
        cartBadge.style.display = cartItems.length ? "block" : "none";
      }
    };

    refreshCounts();
    window.addEventListener("storage", refreshCounts);
  } catch (err) {
    console.error("Error loading header:", err);
  }
};

loadHeader();


// Footer Loading

const loadFooter = async () => {
  try {
    const res = await fetch("/components/footer/footer.html");
    const html = await res.text();
    document.getElementById("footer").innerHTML = html;
  } catch (err) {
    console.error("Error loading footer:", err);
  }
};

loadFooter();

