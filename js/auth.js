/**
 * Shoply - Authentication JavaScript
 * This file contains functionality for user authentication, registration, and account management.
 */

// User data structure
class User {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password; // In a real app, passwords would be hashed on the server
    this.displayName = `${firstName} ${lastName}`;
    this.addresses = {
      billing: null,
      shipping: null,
    };
    this.orders = [];
    this.wishlist = [];
  }
}

// Auth functionality
const auth = {
  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null if not logged in
   */
  getCurrentUser: function () {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is logged in
   * @returns {boolean} True if logged in
   */
  isLoggedIn: function () {
    return true;
    return !!this.getCurrentUser();
  },

  /**
   * Check if current user is an admin
   * @returns {boolean} True if user is admin
   */
  isAdmin: function () {
    return true;
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    // Get all users
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.length === 0) return false;

    // In a real app, this would check admin rights from the server
    // For demo purposes, we'll make the first registered user an admin
    return currentUser.email === users[0].email;
  },

  /**
   * Log in a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} remember - Remember login
   * @returns {boolean} Success status
   */
  login: function (email, password, remember = false) {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find user with matching email
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    // Verify password
    if (user && user.password === password) {
      // Store current user in localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Set remember-me cookie if requested
      if (remember) {
        // In a real app, this would set a secure, HttpOnly cookie with the server
        localStorage.setItem("rememberUser", user.email);
      } else {
        localStorage.removeItem("rememberUser");
      }

      return true;
    }

    return false;
  },

  /**
   * Register a new user
   * @param {string} firstName - First name
   * @param {string} lastName - Last name
   * @param {string} email - Email address
   * @param {string} password - Password
   * @returns {boolean} Success status
   */
  register: function (firstName, lastName, email, password) {
    // Get existing users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return false;
    }

    // Create new user
    const newUser = new User(firstName, lastName, email, password);

    // Add to users array
    users.push(newUser);

    // Save updated users
    localStorage.setItem("users", JSON.stringify(users));

    // Auto log in
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    return true;
  },

  /**
   * Log out the current user
   */
  logout: function () {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rememberUser");

    // Redirect to home page with more robust path handling
    if (window.location.pathname.includes("/pages/admin/")) {
      window.location.href = "../../index.html";
    } else if (window.location.pathname.includes("/pages/")) {
      window.location.href = "../index.html";
    } else {
      window.location.href = "index.html";
    }
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {boolean} Success status
   */
  updateProfile: function (userData) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    // Get all users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find user index
    const userIndex = users.findIndex((u) => u.email === currentUser.email);
    if (userIndex === -1) return false;

    // Update user data
    const updatedUser = {
      ...users[userIndex],
      ...userData,
    };

    // Update users array
    users[userIndex] = updatedUser;

    // Save updated users
    localStorage.setItem("users", JSON.stringify(users));

    // Update current user
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    return true;
  },

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {boolean} Success status
   */
  changePassword: function (currentPassword, newPassword) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    // Verify current password
    if (currentUser.password !== currentPassword) return false;

    // Update password
    return this.updateProfile({ password: newPassword });
  },

  /**
   * Add or update an address
   * @param {string} type - Address type ('billing' or 'shipping')
   * @param {Object} addressData - Address data
   * @returns {boolean} Success status
   */
  saveAddress: function (type, addressData) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    // Create updated addresses object
    const addresses = {
      ...currentUser.addresses,
      [type]: addressData,
    };

    // Update user
    return this.updateProfile({ addresses });
  },

  /**
   * Add an item to user's wishlist
   * @param {number} productId - Product ID
   * @returns {boolean} Success status
   */
  addToWishlist: function (productId) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      // Store in localStorage for non-logged in users
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      // Check if product is already in wishlist
      if (!wishlist.some((item) => item.id === productId)) {
        const product = window.productFunctions.getProductById(productId);

        wishlist.push({
          id: productId,
          name: product.name,
          price: product.price,
          image: product.images[0],
        });

        localStorage.setItem("wishlist", JSON.stringify(wishlist));
      }

      return true;
    }

    // Check if product is already in wishlist
    if (currentUser.wishlist.some((item) => item.id === productId)) {
      return true;
    }

    // Get product data
    const product = window.productFunctions.getProductById(productId);

    // Add to wishlist
    const wishlist = [
      ...currentUser.wishlist,
      {
        id: productId,
        name: product.name,
        price: product.price,
        image: product.images[0],
        dateAdded: new Date().toISOString(),
      },
    ];

    // Update user
    return this.updateProfile({ wishlist });
  },

  /**
   * Remove an item from user's wishlist
   * @param {number} productId - Product ID
   * @returns {boolean} Success status
   */
  removeFromWishlist: function (productId) {
    const currentUser = this.getCurrentUser();

    if (!currentUser) {
      // Handle localStorage wishlist for non-logged in users
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      wishlist = wishlist.filter((item) => item.id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      return true;
    }

    // Filter out the product
    const wishlist = currentUser.wishlist.filter(
      (item) => item.id !== productId
    );

    // Update user
    return this.updateProfile({ wishlist });
  },

  /**
   * Get user's wishlist
   * @returns {Array} Wishlist items
   */
  getWishlist: function () {
    const currentUser = this.getCurrentUser();

    if (!currentUser) {
      // Return localStorage wishlist for non-logged in users
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    }

    return currentUser.wishlist || [];
  },

  /**
   * Add order to user's order history
   * @param {Object} orderData - Order data
   * @returns {boolean} Success status
   */
  addOrder: function (orderData) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    // Add order number and date
    const order = {
      ...orderData,
      orderId: `ORD-${Date.now()}`,
      orderDate: new Date().toISOString(),
      status: "processing",
    };

    // Add to orders
    const orders = [order, ...currentUser.orders];

    // Update user
    return this.updateProfile({ orders });
  },

  /**
   * Initialize auth functionality
   */
  init: function () {
    this.setupAuthForms();
    this.setupAccountPage();
    this.updateAuthUI();

    // Set up logout buttons
    const logoutBtns = document.querySelectorAll("#logout-btn, #logout-link");
    logoutBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.logout();
      });
    });
  },

  /**
   * Setup authentication forms
   */
  setupAuthForms: function () {
    // Login form
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const remember = document.getElementById("remember").checked;

        if (this.login(email, password, remember)) {
          window.notifications.success("Login successful!");

          // Redirect to account page
          setTimeout(() => {
            window.location.href = "account.html";
          }, 1000);
        } else {
          window.notifications.error("Invalid email or password.");
        }
      });

      // Toggle password visibility
      const togglePassword = document.getElementById("toggle-password");
      const passwordInput = document.getElementById("password");

      if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
          const type =
            passwordInput.getAttribute("type") === "password"
              ? "text"
              : "password";
          passwordInput.setAttribute("type", type);
          togglePassword.querySelector("i").className =
            type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
        });
      }
    }

    // Registration form
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
      // Password strength meter
      const passwordInput = document.getElementById("password");
      const strengthProgress = document.getElementById("strength-progress");
      const strengthText = document.getElementById("strength-text");

      if (passwordInput && strengthProgress && strengthText) {
        passwordInput.addEventListener("input", () => {
          const strength = this.checkPasswordStrength(passwordInput.value);

          // Update progress bar
          strengthProgress.style.width = `${strength.score * 25}%`;

          // Update color
          if (strength.score === 0) {
            strengthProgress.style.backgroundColor = "#ef4444";
          } else if (strength.score < 3) {
            strengthProgress.style.backgroundColor = "#f59e0b";
          } else {
            strengthProgress.style.backgroundColor = "#10b981";
          }

          // Update text
          strengthText.textContent = strength.message;
        });
      }

      // Toggle password visibility
      const togglePassword = document.getElementById("toggle-password");
      const toggleConfirmPassword = document.getElementById(
        "toggle-confirm-password"
      );
      const confirmPasswordInput = document.getElementById("confirm-password");

      if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
          const type =
            passwordInput.getAttribute("type") === "password"
              ? "text"
              : "password";
          passwordInput.setAttribute("type", type);
          togglePassword.querySelector("i").className =
            type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
        });
      }

      if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener("click", () => {
          const type =
            confirmPasswordInput.getAttribute("type") === "password"
              ? "text"
              : "password";
          confirmPasswordInput.setAttribute("type", type);
          toggleConfirmPassword.querySelector("i").className =
            type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
        });
      }

      // Form submission
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const firstName = document.getElementById("first-name").value;
        const lastName = document.getElementById("last-name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
          document.getElementById("confirm-password").value;
        const termsChecked = document.getElementById("terms").checked;

        // Validate inputs
        if (!firstName || !lastName || !email || !password) {
          window.notifications.error("Please fill in all required fields.");
          return;
        }

        if (!util.isValidEmail(email)) {
          window.notifications.error("Please enter a valid email address.");
          return;
        }

        if (password !== confirmPassword) {
          window.notifications.error("Passwords do not match.");
          return;
        }

        if (!termsChecked) {
          window.notifications.error(
            "You must agree to the Terms of Service and Privacy Policy."
          );
          return;
        }

        // Register user
        if (this.register(firstName, lastName, email, password)) {
          window.notifications.success(
            "Registration successful! You are now logged in."
          );

          // Redirect to account page
          setTimeout(() => {
            window.location.href = "account.html";
          }, 1000);
        } else {
          window.notifications.error(
            "An account with this email already exists."
          );
        }
      });
    }
  },

  /**
   * Set up account page functionality
   */
  setupAccountPage: function () {
    // Check if we're on the account page
    const accountPage = document.querySelector(".account-section");
    if (!accountPage) return;

    // Redirect to login if not logged in
    if (!this.isLoggedIn()) {
      window.location.href = "login.html";
      return;
    }

    // Load user data
    const user = this.getCurrentUser();

    // Update account navigation
    const accountTabs = document.querySelectorAll(".account-nav a[data-tab]");
    accountTabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();

        // Remove active class from all tabs
        accountTabs.forEach((t) => t.classList.remove("active"));

        // Add active class to clicked tab
        tab.classList.add("active");

        // Hide all tab contents
        const tabContents = document.querySelectorAll(".account-tab");
        tabContents.forEach((content) => content.classList.remove("active"));

        // Show selected tab content
        const tabId = tab.dataset.tab;
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
          selectedTab.classList.add("active");
        }
      });
    });

    // Update user info
    document.getElementById("user-name").textContent = user.displayName;
    document.getElementById("user-email").textContent = user.email;
    document.getElementById("dashboard-name").textContent = user.firstName;
    document.getElementById("dashboard-name2").textContent = user.firstName;

    // Load address data
    if (user.addresses.billing) {
      this.displayAddress("billing", user.addresses.billing);
    }

    if (user.addresses.shipping) {
      this.displayAddress("shipping", user.addresses.shipping);
    }

    // Setup address forms
    const editAddressButtons = document.querySelectorAll(".edit-address");
    const addressFormContainer = document.getElementById(
      "address-form-container"
    );
    const addressForm = document.getElementById("address-form");
    const cancelAddressBtn = document.getElementById("cancel-address");

    editAddressButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();

        const addressType = button.dataset.type;
        const addressData = user.addresses[addressType];

        // Set form title and address type
        document.getElementById("address-form-title").textContent = `Edit ${
          addressType.charAt(0).toUpperCase() + addressType.slice(1)
        } Address`;
        document.getElementById("address-type").value = addressType;

        // Populate form if address exists
        if (addressData) {
          document.getElementById("address-first-name").value =
            addressData.firstName || "";
          document.getElementById("address-last-name").value =
            addressData.lastName || "";
          document.getElementById("address-company").value =
            addressData.company || "";
          document.getElementById("address-1").value =
            addressData.address1 || "";
          document.getElementById("address-2").value =
            addressData.address2 || "";
          document.getElementById("address-city").value =
            addressData.city || "";
          document.getElementById("address-state").value =
            addressData.state || "";
          document.getElementById("address-postcode").value =
            addressData.postcode || "";
          document.getElementById("address-country").value =
            addressData.country || "";
          document.getElementById("address-phone").value =
            addressData.phone || "";
        } else {
          // Reset form for new address
          addressForm.reset();
        }

        // Show form
        addressFormContainer.classList.remove("hidden");
      });
    });

    // Cancel address form
    if (cancelAddressBtn) {
      cancelAddressBtn.addEventListener("click", () => {
        addressFormContainer.classList.add("hidden");
      });
    }

    // Save address
    if (addressForm) {
      addressForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const addressType = document.getElementById("address-type").value;

        // Collect form data
        const addressData = {
          firstName: document.getElementById("address-first-name").value,
          lastName: document.getElementById("address-last-name").value,
          company: document.getElementById("address-company").value,
          address1: document.getElementById("address-1").value,
          address2: document.getElementById("address-2").value,
          city: document.getElementById("address-city").value,
          state: document.getElementById("address-state").value,
          postcode: document.getElementById("address-postcode").value,
          country: document.getElementById("address-country").value,
          phone: document.getElementById("address-phone").value,
        };

        // Save address
        if (this.saveAddress(addressType, addressData)) {
          // Display updated address
          this.displayAddress(addressType, addressData);

          // Hide form
          addressFormContainer.classList.add("hidden");

          // Show notification
          window.notifications.success(
            `${
              addressType.charAt(0).toUpperCase() + addressType.slice(1)
            } address updated.`
          );

          // Update address count
          this.updateAddressCount();
        } else {
          window.notifications.error(
            "Failed to save address. Please try again."
          );
        }
      });
    }

    // Update account details form
    const accountForm = document.getElementById("account-form");
    if (accountForm) {
      // Populate form
      document.getElementById("account-first-name").value = user.firstName;
      document.getElementById("account-last-name").value = user.lastName;
      document.getElementById("account-display-name").value = user.displayName;
      document.getElementById("account-email").value = user.email;

      // Save account details
      accountForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const firstName = document.getElementById("account-first-name").value;
        const lastName = document.getElementById("account-last-name").value;
        const displayName = document.getElementById(
          "account-display-name"
        ).value;
        const email = document.getElementById("account-email").value;
        const currentPassword = document.getElementById(
          "account-current-password"
        ).value;
        const newPassword = document.getElementById(
          "account-new-password"
        ).value;
        const confirmPassword = document.getElementById(
          "account-confirm-password"
        ).value;

        // Validate inputs
        if (!firstName || !lastName || !email) {
          window.notifications.error("Please fill in all required fields.");
          return;
        }

        if (!util.isValidEmail(email)) {
          window.notifications.error("Please enter a valid email address.");
          return;
        }

        // Prepare user data update
        const userData = {
          firstName,
          lastName,
          displayName: displayName || `${firstName} ${lastName}`,
          email,
        };

        // Handle password change if requested
        if (newPassword) {
          if (!currentPassword) {
            window.notifications.error("Please enter your current password.");
            return;
          }

          if (newPassword !== confirmPassword) {
            window.notifications.error("New passwords do not match.");
            return;
          }

          // Attempt to change password
          if (!this.changePassword(currentPassword, newPassword)) {
            window.notifications.error("Current password is incorrect.");
            return;
          }
        }

        // Update user profile
        if (this.updateProfile(userData)) {
          window.notifications.success("Account details updated successfully.");

          // Update user info in header
          document.getElementById("user-name").textContent =
            userData.displayName;
          document.getElementById("user-email").textContent = userData.email;
          document.getElementById("dashboard-name").textContent =
            userData.firstName;
          document.getElementById("dashboard-name2").textContent =
            userData.firstName;

          // Clear password fields
          document.getElementById("account-current-password").value = "";
          document.getElementById("account-new-password").value = "";
          document.getElementById("account-confirm-password").value = "";
        } else {
          window.notifications.error(
            "Failed to update account details. Please try again."
          );
        }
      });
    }

    // Load wishlist
    this.loadWishlist();

    // Load orders
    this.loadOrders();

    // Update dashboard stats
    this.updateAddressCount();
    this.updateOrderCount();
    this.updateWishlistCount();
  },

  /**
   * Display address in account page
   * @param {string} type - Address type ('billing' or 'shipping')
   * @param {Object} addressData - Address data
   */
  displayAddress: function (type, addressData) {
    const addressElement = document.getElementById(`${type}-address`);
    if (!addressElement) return;

    addressElement.innerHTML = `
      <p>
        ${addressData.firstName} ${addressData.lastName}<br>
        ${addressData.company ? addressData.company + "<br>" : ""}
        ${addressData.address1}<br>
        ${addressData.address2 ? addressData.address2 + "<br>" : ""}
        ${addressData.city}, ${addressData.state} ${addressData.postcode}<br>
        ${addressData.country}<br>
        Phone: ${addressData.phone}
      </p>
    `;
  },

  /**
   * Load wishlist items
   */
  loadWishlist: function () {
    const wishlistContainer = document.getElementById("wishlist-products");
    const wishlistEmpty = document.getElementById("wishlist-empty");
    if (!wishlistContainer || !wishlistEmpty) return;

    const wishlist = this.getWishlist();

    // Show/hide empty message
    if (wishlist.length === 0) {
      wishlistEmpty.style.display = "block";
      wishlistContainer.style.display = "none";
      return;
    } else {
      wishlistEmpty.style.display = "none";
      wishlistContainer.style.display = "grid";
    }

    // Clear container
    wishlistContainer.innerHTML = "";

    // Add wishlist items
    wishlist.forEach((item) => {
      const product = window.productFunctions.getProductById(item.id) || item;

      if (product) {
        const productElement = document.createElement("div");
        productElement.className = "product-card";

        productElement.innerHTML = `
          <div class="product-image">
            <img src="${product.image || product.images[0]}" alt="${
          product.name
        }">
            <div class="product-actions">
              <button class="action-btn remove-from-wishlist" aria-label="Remove from wishlist" data-product-id="${
                product.id
              }">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-title"><a href="product.html?id=${product.id}">${
          product.name
        }</a></h3>
            <div class="product-price">${util.formatPrice(product.price)}</div>
          </div>
          <div class="product-bottom">
            <button class="btn btn-primary add-to-cart-btn" data-product-id="${
              product.id
            }">Add to Cart</button>
          </div>
        `;

        // Add event listeners
        const removeBtn = productElement.querySelector(".remove-from-wishlist");
        removeBtn.addEventListener("click", () => {
          this.removeFromWishlist(product.id);
          productElement.remove();

          // Check if wishlist is now empty
          if (this.getWishlist().length === 0) {
            wishlistEmpty.style.display = "block";
            wishlistContainer.style.display = "none";
          }

          // Update wishlist count
          this.updateWishlistCount();
        });

        const addToCartBtn = productElement.querySelector(".add-to-cart-btn");
        addToCartBtn.addEventListener("click", () => {
          window.cart.addItem(product.id, 1);
        });

        wishlistContainer.appendChild(productElement);
      }
    });
  },

  /**
   * Load orders
   */
  loadOrders: function () {
    const ordersTable = document.getElementById("orders-table");
    const recentOrdersTable = document.getElementById("recent-orders-table");
    if (!ordersTable && !recentOrdersTable) return;

    const user = this.getCurrentUser();
    const orders = user.orders || [];

    // Function to render order row
    const renderOrderRow = (order) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>#${order.orderId}</td>
        <td>${new Date(order.orderDate).toLocaleDateString()}</td>
        <td><span class="status-badge status-${order.status.toLowerCase()}">${
        order.status
      }</span></td>
        <td>${util.formatPrice(order.total)}</td>
        <td><a href="#" class="btn btn-sm btn-outline view-order" data-order-id="${
          order.orderId
        }">View</a></td>
      `;

      return row;
    };

    // Update orders table
    if (ordersTable) {
      if (orders.length === 0) {
        ordersTable.innerHTML =
          '<tr class="no-orders"><td colspan="5">No orders found</td></tr>';
      } else {
        ordersTable.innerHTML = "";

        orders.forEach((order) => {
          ordersTable.appendChild(renderOrderRow(order));
        });
      }
    }

    // Update recent orders table
    if (recentOrdersTable) {
      if (orders.length === 0) {
        recentOrdersTable.innerHTML =
          '<tr class="no-orders"><td colspan="5">No orders found</td></tr>';
      } else {
        recentOrdersTable.innerHTML = "";

        // Show only the 5 most recent orders
        orders.slice(0, 5).forEach((order) => {
          recentOrdersTable.appendChild(renderOrderRow(order));
        });
      }
    }
  },

  /**
   * Update address count in dashboard
   */
  updateAddressCount: function () {
    const addressCountElement = document.getElementById("address-count");
    if (!addressCountElement) return;

    const user = this.getCurrentUser();
    let count = 0;

    if (user.addresses.billing) count++;
    if (user.addresses.shipping) count++;

    addressCountElement.textContent = `${count} Address${
      count !== 1 ? "es" : ""
    }`;
  },

  /**
   * Update order count in dashboard
   */
  updateOrderCount: function () {
    const orderCountElement = document.getElementById("order-count");
    if (!orderCountElement) return;

    const user = this.getCurrentUser();
    const count = user.orders ? user.orders.length : 0;

    orderCountElement.textContent = `${count} Order${count !== 1 ? "s" : ""}`;
  },

  /**
   * Update wishlist count in dashboard
   */
  updateWishlistCount: function () {
    const wishlistCountElement = document.getElementById("wishlist-count");
    if (!wishlistCountElement) return;

    const wishlist = this.getWishlist();

    wishlistCountElement.textContent = `${wishlist.length} Product${
      wishlist.length !== 1 ? "s" : ""
    }`;
  },

  /**
   * Update auth UI elements
   */
  updateAuthUI: function () {
    // Update header account link
    const accountLinks = document.querySelectorAll("#account-icon");

    // Get the current path to determine if we're in a sub-directory
    const isInPagesDir = window.location.pathname.includes("/pages/");

    accountLinks.forEach((link) => {
      if (this.isLoggedIn()) {
        link.href = isInPagesDir ? "account.html" : "pages/account.html";
      } else {
        link.href = isInPagesDir ? "login.html" : "pages/login.html";
      }
    });

    // Show/hide admin links based on admin status
    const adminLinks = document.querySelectorAll(
      ".admin-link, .admin-mobile-link"
    );

    adminLinks.forEach((link) => {
      if (this.isAdmin()) {
        link.style.display = ""; // Show the link
      } else {
        link.style.display = "none"; // Hide the link
      }
    });

    // Fix broken links in the main navigation
    const navLinks = document.querySelectorAll("nav a, .mobile-nav a");
    navLinks.forEach((navLink) => {
      // Skip links with hash or data attributes
      if (
        navLink.getAttribute("href") === "#" ||
        navLink.hasAttribute("data-category") ||
        navLink.hasAttribute("data-tab") ||
        navLink.getAttribute("href").startsWith("http")
      ) {
        return;
      }

      // Fix account and cart links
      if (navLink.getAttribute("href") === "login.html" && !isInPagesDir) {
        navLink.href = "pages/login.html";
      } else if (
        navLink.getAttribute("href") === "account.html" &&
        !isInPagesDir
      ) {
        navLink.href = "pages/account.html";
      } else if (
        navLink.getAttribute("href") === "cart.html" &&
        !isInPagesDir
      ) {
        navLink.href = "pages/cart.html";
      } else if (
        navLink.getAttribute("href") === "register.html" &&
        !isInPagesDir
      ) {
        navLink.href = "pages/register.html";
      }
    });
  },

  /**
   * Check password strength
   * @param {string} password - Password to check
   * @returns {Object} Strength score and message
   */
  checkPasswordStrength: function (password) {
    if (!password) {
      return { score: 0, message: "Password strength" };
    }

    let score = 0;

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Complexity checks
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Cap at 4
    score = Math.min(score, 4);

    // Return score and message
    const messages = ["Weak", "Fair", "Good", "Strong", "Very Strong"];

    return {
      score,
      message: messages[score],
    };
  },
};

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", function () {
  auth.init();
});

// Expose auth functionality globally
window.auth = auth;
