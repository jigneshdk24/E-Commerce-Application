// Billing functionality - using centralized data
// This file now uses the centralized data from assets/js/data.js

function renderBillingDetails() {
  let paymentDetails = document.getElementById("payment-details");
  let paymentTable = document.querySelector("#payment-table tbody");
  
  if (!paymentTable) {
    console.error("Payment table tbody element not found");
    return;
  }

  let html = "";
  CART_PRODUCTS.forEach((product, idx) => {
    html += `
          <tr>
              <td>
                  <img src="${product.image}" alt="${product.title}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;"/>
                  <span>${product.title}</span>
              </td>
              <td>
                  $${product.price}
              </td>
          </tr>
          `;
  });

  paymentTable.innerHTML += html;

  const subtotal = CART_PRODUCTS.reduce((prev, product) => prev + product.price, 0);
  
  paymentTable.innerHTML += `
              <tr>
                  <td>
                      Subtotal:
                  </td>
                  <td>
                  $${subtotal}
                  </td>
              </tr>
              <tr>
                  <td>
                      Shipping:
                  </td>
                  <td>
                  Free
                  </td>
              </tr>
              <tr>
                  <td>
                      Total:
                  </td>
                  <td>
                  $${subtotal}
                  </td>
              </tr>
  `;
}

// Make the function available globally
window.renderBillingDetails = renderBillingDetails;

// Auto-initialize when this page is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (typeof renderBillingDetails === "function") {
    renderBillingDetails();
  }
});


