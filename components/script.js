
// Header Loading & LocalStorage Updates

function getComponentsBasePath() {
	// Determine absolute path to the `/components` folder based on how this script was loaded
	try {
		const scripts = document.getElementsByTagName("script");
		for (const script of scripts) {
			if (!script.src) continue;
			const url = new URL(script.src, window.location.origin);
			const path = url.pathname;
			const marker = "/components/script.js";
			const idx = path.lastIndexOf(marker);
			if (idx !== -1) {
				return path.slice(0, idx + "/components".length);
			}
		}
	} catch (e) {
		// noop, fallback below
	}
	// Fallback: assume site is served from project root
	return "/components";
}

const loadHeader = async () => {
	try {
		const base = getComponentsBasePath();
		const res = await fetch(`${base}/header/header.html`);
		const html = await res.text();
		document.getElementById("header").innerHTML = html;

		// Fix header links so they work regardless of current page depth
		const wishlistLink = document.querySelector('#header a[title="Wishlist"]');
		if (wishlistLink) wishlistLink.href = `${base}/wishlist/wishlist-page.html`;
		const cartLink = document.querySelector('#header a[title="Cart"]');
		if (cartLink) cartLink.href = `${base}/cart/cart.html`;
		const brandLink = document.querySelector('#header .navbar-brand');
		if (brandLink) brandLink.href = `${base}/home/home.html`;
		const authLink = document.querySelector('#header #auth-link');
		if (authLink) authLink.href = `${base}/login/login.html`;

		// Update wishlist & cart counts
		const refreshCounts = () => {
			const wishlistItems = JSON.parse(localStorage.getItem("wishlist") || "[]");
			const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

			const wishlistBadge = document.querySelector("#header .wishlist-count");
			const cartBadge = document.querySelector("#header .cart-count");
			const wishlistIcon = document.querySelector('#header a[title="Wishlist"] i');

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
		const base = getComponentsBasePath();
		const res = await fetch(`${base}/footer/footer.html`);
		const html = await res.text();
		document.getElementById("footer").innerHTML = html;
	} catch (err) {
		console.error("Error loading footer:", err);
	}
};

loadFooter();


// Lightweight toast utility

function ensureToastContainer() {
	let container = document.getElementById("app-toasts");
	if (!container) {
		container = document.createElement("div");
		container.id = "app-toasts";
		container.style.position = "fixed";
		container.style.top = "1rem";
		container.style.right = "1rem";
		container.style.zIndex = "1080"; // above header
		document.body.appendChild(container);
	}
	return container;
}

function showToast(message, options) {
	const opts = Object.assign({ type: "success", timeout: 2000 }, options);
	const container = ensureToastContainer();
	const toast = document.createElement("div");
	toast.className = `toast align-items-center text-bg-${opts.type} border-0 show`;
	toast.role = "alert";
	toast.ariaLive = "assertive";
	toast.ariaAtomic = "true";
	toast.style.marginBottom = "0.5rem";
	toast.innerHTML = `
		<div class="d-flex">
			<div class="toast-body">${message}</div>
			<button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button>
		</div>`;

	toast.querySelector(".btn-close").addEventListener("click", () => {
		container.removeChild(toast);
	});

	container.appendChild(toast);
	setTimeout(() => {
		if (toast.parentElement === container) container.removeChild(toast);
	}, opts.timeout);
}

window.showToast = showToast;

