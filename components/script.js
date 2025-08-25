
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
		container.style.zIndex = "9999"; // ensure on top
		container.style.pointerEvents = "none"; // allow clicks to pass through except toast itself
		document.body.appendChild(container);
	}
	return container;
}

function showToast(message, options) {
	const opts = Object.assign({ type: "success", timeout: 2000 }, options);
	const container = ensureToastContainer();
	const toast = document.createElement("div");
	// Standalone styles (no Bootstrap required)
	toast.style.display = "flex";
	toast.style.alignItems = "center";
	toast.style.gap = "0.75rem";
	toast.style.padding = "0.75rem 1rem";
	toast.style.marginBottom = "0.5rem";
	toast.style.minWidth = "240px";
	toast.style.borderRadius = "0.5rem";
	toast.style.boxShadow = "0 0.5rem 1rem rgba(0,0,0,0.15)";
	toast.style.pointerEvents = "auto";
	toast.setAttribute("role", "status");
	toast.setAttribute("aria-live", "polite");
	toast.setAttribute("aria-atomic", "true");

	const bgByType = { success: "#198754", danger: "#dc3545", warning: "#ffc107", info: "#0dcaf0" };
	const fgByType = { success: "#fff", danger: "#fff", warning: "#000", info: "#000" };
	toast.style.backgroundColor = bgByType[opts.type] || "#198754";
	toast.style.color = fgByType[opts.type] || "#fff";

	const text = document.createElement("div");
	text.textContent = message;
	text.style.flex = "1";

	const closeBtn = document.createElement("button");
	closeBtn.type = "button";
	closeBtn.textContent = "×";
	closeBtn.setAttribute("aria-label", "Close");
	closeBtn.style.background = "transparent";
	closeBtn.style.border = "0";
	closeBtn.style.color = "inherit";
	closeBtn.style.fontSize = "1.25rem";
	closeBtn.style.lineHeight = "1";
	closeBtn.style.cursor = "pointer";

	toast.appendChild(text);
	toast.appendChild(closeBtn);
	closeBtn.addEventListener("click", () => {
		if (toast.parentElement === container) container.removeChild(toast);
	});

	container.appendChild(toast);
	setTimeout(() => {
		if (toast.parentElement === container) container.removeChild(toast);
	}, opts.timeout);
}

window.showToast = showToast;

