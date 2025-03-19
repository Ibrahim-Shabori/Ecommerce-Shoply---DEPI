/**
 * Shoply - Cart JavaScript
 * This file contains functionality for managing the shopping cart.
 */

// Cart functionality
const cart = {
  /**
   * Get current cart items from localStorage
   * @returns {Array} Cart items array
   */
  getItems: function () {
    return JSON.parse(localStorage.getItem("cart")) || [];
  },

  /**
   * Save cart items to localStorage
   * @param {Array} items - Cart items array
   */
  saveItems: function (items) {
    localStorage.setItem("cart", JSON.stringify(items));
  },

  /**
   * Add item to cart
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @param {Object} options - Additional options (color, size)
   */
  addItem: function (productId, quantity = 1, options = {}) {
    console.log(quantity);
    const product = window.productFunctions.getProductById(productId);
    if (!product) return;

    let items = this.getItems();

    // Check if product already exists in cart with same options
    const existingItemIndex = items.findIndex(
      (item) =>
        item.id === productId &&
        item.color === (options.color || "") &&
        item.size === (options.size || "")
    );

    if (existingItemIndex !== -1) {
      // Update quantity
      items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      items.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
        color: options.color || "",
        size: options.size || "",
      });
    }

    this.saveItems(items);
    this.updateCartUI();
    window.productFunctions.updateCartCount();

    // Show notification
    window.notifications.success(`${product.name} added to cart!`);
  },

  /**
   * Update item quantity in cart
   * @param {number} index - Item index in cart
   * @param {number} quantity - New quantity
   */
  updateItemQuantity: function (index, quantity) {
    let items = this.getItems();

    if (index >= 0 && index < items.length) {
      if (quantity <= 0) {
        // Remove item if quantity is zero or negative
        this.removeItem(index);
      } else {
        // Update quantity
        items[index].quantity = quantity;
        this.saveItems(items);
        this.updateCartUI();
        window.productFunctions.updateCartCount();
      }
    }
  },

  /**
   * Remove item from cart
   * @param {number} index - Item index in cart
   */
  removeItem: function (index) {
    let items = this.getItems();

    if (index >= 0 && index < items.length) {
      const removedItem = items[index];
      items.splice(index, 1);
      this.saveItems(items);
      this.updateCartUI();
      window.productFunctions.updateCartCount();

      // Show notification
      window.notifications.info(`${removedItem.name} removed from cart.`);
    }
  },

  /**
   * Clear all items from cart
   */
  clearCart: function () {
    this.saveItems([]);
    this.updateCartUI();
    window.productFunctions.updateCartCount();

    // Show notification
    window.notifications.info("Cart cleared.");
  },

  /**
   * Calculate cart totals
   * @returns {Object} Cart totals
   */
  calculateTotals: function () {
    const items = this.getItems();

    // Calculate subtotal
    const subtotal = items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Calculate shipping (free if subtotal >= $50, otherwise $5.99)
    const shipping = subtotal >= 50 ? 0 : 5.99;

    // Apply discount if a coupon code is present
    const couponCode = localStorage.getItem("couponCode");
    let discount = 0;

    if (couponCode) {
      // In a real app, this would validate the coupon with the backend
      // For now, we'll just apply a 10% discount
      discount = subtotal * 0.1;
    }

    // Calculate total
    const total = subtotal + shipping - discount;

    return {
      subtotal,
      shipping,
      discount,
      total,
    };
  },

  /**
   * Apply coupon code
   * @param {string} code - Coupon code
   */
  applyCoupon: function (code) {
    if (!code) return;

    // In a real app, this would validate the coupon with the backend
    // For now, we'll just accept any code
    localStorage.setItem("couponCode", code);

    // Show notification
    window.notifications.success("Coupon applied successfully!");

    // Update cart UI to reflect discount
    this.updateCartUI();
  },

  /**
   * Remove coupon code
   */
  removeCoupon: function () {
    localStorage.removeItem("couponCode");

    // Show notification
    window.notifications.info("Coupon removed.");

    // Update cart UI to remove discount
    this.updateCartUI();
  },

  /**
   * Update cart UI
   */
  updateCartUI: function () {
    // Check if we're on the cart page
    const cartItems = document.getElementById("cart-items");
    const cartEmpty = document.getElementById("cart-empty");
    const cartContent = document.getElementById("cart-content");

    if (!cartItems) return;

    const items = this.getItems();

    // Show/hide empty cart message
    if (items.length === 0) {
      cartEmpty.classList.remove("hidden");
      cartContent.classList.add("hidden");
      return;
    } else {
      cartEmpty.classList.add("hidden");
      cartContent.classList.remove("hidden");
    }

    // Clear existing items
    cartItems.innerHTML = "";

    // Add each item to the cart
    items.forEach((item, index) => {
      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";

      const totalPrice = item.price * item.quantity;

      itemElement.innerHTML = `
        <div class="cart-item-product">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h3><a href="product.html?id=${item.id}">${item.name}</a></h3>
            <p>
              ${item.color ? `Color: ${item.color}` : ""}
              ${item.color && item.size ? " | " : ""}
              ${item.size ? `Size: ${item.size}` : ""}
            </p>
          </div>
        </div>
        <div class="cart-item-price" data-label="Price:">${util.formatPrice(
          item.price
        )}</div>
        <div class="cart-item-quantity" data-label="Quantity:">
          <div class="quantity-selector">
            <button class="quantity-btn decrease-btn">-</button>
            <input type="number" value="${
              item.quantity
            }" min="1" max="10" class="quantity-input" data-index="${index}">
            <button class="quantity-btn increase-btn">+</button>
          </div>
        </div>
        <div class="cart-item-total" data-label="Total:">${util.formatPrice(
          totalPrice
        )}</div>
        <button class="cart-item-remove" data-index="${index}">
          <i class="fas fa-trash-alt"></i>
        </button>
      `;

      cartItems.appendChild(itemElement);

      // Add event listeners for quantity buttons
      const decreaseBtn = itemElement.querySelector(".decrease-btn");
      const increaseBtn = itemElement.querySelector(".increase-btn");
      const quantityInput = itemElement.querySelector(".quantity-input");
      const removeBtn = itemElement.querySelector(".cart-item-remove");

      decreaseBtn.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
          this.updateItemQuantity(index, currentValue - 1);
        }
      });

      increaseBtn.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
          quantityInput.value = currentValue + 1;
          this.updateItemQuantity(index, currentValue + 1);
        }
      });

      quantityInput.addEventListener("change", function () {
        const newValue = parseInt(this.value);
        if (newValue >= 1 && newValue <= 10) {
          cart.updateItemQuantity(index, newValue);
        } else {
          this.value = newValue < 1 ? 1 : 10;
          cart.updateItemQuantity(index, parseInt(this.value));
        }
      });

      removeBtn.addEventListener("click", () => {
        this.removeItem(parseInt(removeBtn.dataset.index));
      });
    });

    // Update cart summary
    this.updateCartSummary();
  },

  /**
   * Update cart summary
   */
  updateCartSummary: function () {
    const subtotalElement = document.getElementById("cart-subtotal");
    const shippingElement = document.getElementById("cart-shipping");
    const discountElement = document.getElementById("cart-discount");
    const discountRow = document.getElementById("discount-row");
    const totalElement = document.getElementById("cart-total");

    if (!subtotalElement || !totalElement) return;

    const totals = this.calculateTotals();

    // Update prices
    subtotalElement.textContent = util.formatPrice(totals.subtotal);
    shippingElement.textContent =
      totals.shipping === 0 ? "Free" : util.formatPrice(totals.shipping);
    totalElement.textContent = util.formatPrice(totals.total);

    // Show/hide discount row
    if (totals.discount > 0) {
      discountRow.classList.remove("hidden");
      discountElement.textContent = `-${util.formatPrice(totals.discount)}`;
    } else {
      discountRow.classList.add("hidden");
    }
  },

  /**
   * Initialize cart functionality
   */
  init: function () {
    // Check if we're on the cart page
    const cartPage = document.querySelector(".cart-section");
    if (cartPage) {
      this.updateCartUI();

      // Set up update cart button
      const updateCartBtn = document.getElementById("update-cart");
      if (updateCartBtn) {
        updateCartBtn.addEventListener("click", () => {
          this.updateCartUI();
          window.notifications.success("Cart updated.");
        });
      }

      // Set up apply coupon button
      const applyCouponBtn = document.getElementById("apply-coupon");
      const couponInput = document.getElementById("coupon-code");

      if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener("click", () => {
          const code = couponInput.value.trim();
          if (code) {
            this.applyCoupon(code);
          } else {
            window.notifications.error("Please enter a coupon code.");
          }
        });
      }

      // Set up checkout button
      const checkoutBtn = document.getElementById("checkout-btn");
      if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
          // In a real app, this would redirect to a checkout page
          window.notifications.info(
            "Checkout functionality would be implemented here."
          );
        });
      }
    }

    // Set up add to cart buttons throughout the site
    document.addEventListener("click", (e) => {
      if (e.target.closest(".add-to-cart-btn")) {
        const button = e.target.closest(".add-to-cart-btn");
        const productId = parseInt(button.dataset.productId);
        this.addItem(productId, 1);
      }
    });

    // Initialize cart count
    window.productFunctions.updateCartCount();
  },
};

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", function () {
  cart.init();
});

// Expose cart functionality globally
window.cart = cart;
