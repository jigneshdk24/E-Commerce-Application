
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


// Auth utilities
function isLoggedIn() {
	try {
		return localStorage.getItem("isLoggedIn") === "true" && !!localStorage.getItem("authToken");
	} catch (e) {
		return false;
	}
}

function logout() {
	try {
		localStorage.removeItem("authToken");
		localStorage.removeItem("currentUser");
		localStorage.removeItem("isLoggedIn");
		// Also clear optional user data used by profile/billing
		localStorage.removeItem("userProfile");
		localStorage.removeItem("userInfo");
	} catch (e) {}
	// Use replace to avoid going back to an authenticated history entry
	const base = getComponentsBasePath();
	location.replace(`${base}/login/login.html`);
}

function updateHeaderAuthUI() {
	const authNavItem = document.querySelector('#header #auth-nav-item');
	const authLink = document.querySelector('#header #auth-link');
	const logoutLink = document.querySelector('#header #logout-link');
	if (isLoggedIn()) {
		if (authLink) {
			authLink.textContent = "My Account";
			authLink.href = `${getComponentsBasePath()}/edit-profile/edit-profile.html`;
		}
		if (logoutLink) logoutLink.style.display = "block";
	} else {
		if (authLink) {
			authLink.textContent = "Sign up";
			authLink.href = `${getComponentsBasePath()}/login/login.html`;
		}
		if (logoutLink) logoutLink.style.display = "none";
	}
}

// Require auth for protected pages
function requireAuth(options) {
	const { redirectTo = `${getComponentsBasePath()}/login/login.html` } = options || {};
	if (!isLoggedIn()) {
		location.replace(redirectTo);
		return false;
	}
	return true;
}

// Prevent showing stale authenticated pages from bfcache after logout
window.addEventListener("pageshow", function (event) {
	// If page was restored from bfcache, re-validate session
	if (event.persisted) {
		if (!isLoggedIn()) {
			// Replace so back button won't return to this page
			location.replace(`${getComponentsBasePath()}/login/login.html`);
			return;
		}
	}
	// Always update header auth UI on view
	updateHeaderAuthUI();
});

// Keep UI in sync when storage changes in another tab or same tab
window.addEventListener("storage", function (e) {
	if (e.key === "isLoggedIn" || e.key === "authToken" || e.key === null) {
		updateHeaderAuthUI();
		if (!isLoggedIn()) {
			location.replace(`${getComponentsBasePath()}/login/login.html`);
		}
	}
});

// Expose helpers globally for inline onclick handlers in HTML
window.logout = logout;
window.requireAuth = requireAuth;
window.isLoggedIn = isLoggedIn;

// After header loads, also toggle auth UI
const enhanceHeaderAfterLoad = async () => {
	try {
		// wait a tick for header HTML injection
		setTimeout(updateHeaderAuthUI, 0);
	} catch (e) {}
};

enhanceHeaderAfterLoad();

