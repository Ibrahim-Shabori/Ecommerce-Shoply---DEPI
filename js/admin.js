/**
 * Shoply - Admin Dashboard JavaScript
 * This file contains functionality for the admin dashboard, including user and product management.
 */

// Admin functionality
const admin = {
  /**
   * Check if user is an admin
   * @returns {boolean} True if the user is an admin
   */
  isAdmin: function () {
    return true;
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
    // In a real app, this would check admin rights on the server
    // For demo purposes, we'll make the first registered user an admin
    if (!currentUser) return false;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.length === 0) return false;

    return currentUser.email === users[0].email;
  },

  /**
   * Get all users
   * @returns {Array} Array of users
   */
  getAllUsers: function () {
    return JSON.parse(localStorage.getItem("users")) || [];
  },

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Object|null} User object or null
   */
  getUserByEmail: function (email) {
    const users = this.getAllUsers();
    return users.find((user) => user.email === email) || null;
  },

  /**
   * Delete user
   * @param {string} email - User email
   * @returns {boolean} Success status
   */
  deleteUser: function (email) {
    if (!this.isAdmin()) return false;

    let users = this.getAllUsers();
    const initialLength = users.length;

    users = users.filter((user) => user.email !== email);

    if (users.length < initialLength) {
      localStorage.setItem("users", JSON.stringify(users));
      return true;
    }

    return false;
  },

  /**
   * Update user
   * @param {string} email - User email
   * @param {Object} userData - Updated user data
   * @returns {boolean} Success status
   */
  updateUser: function (email, userData) {
    if (!this.isAdmin()) return false;

    let users = this.getAllUsers();
    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex !== -1) {
      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        ...userData,
      };

      localStorage.setItem("users", JSON.stringify(users));
      return true;
    }

    return false;
  },

  /**
   * Add a new product
   * @param {Object} productData - Product data
   * @returns {boolean} Success status
   */
  addProduct: function (productData) {
    if (!this.isAdmin()) return false;

    // Get existing products
    let products = window.productFunctions.getAllProducts();

    // Generate new product ID
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;

    // Create new product
    const newProduct = {
      id: newId,
      ...productData,
    };

    // Add to products array
    products.push(newProduct);

    // Save updated products
    // In a real app, this would be an API call
    // For demo, we'll just update the global variable and localStorage
    window.PRODUCTS = products;
    localStorage.setItem("adminProducts", JSON.stringify(products));

    return true;
  },

  /**
   * Update product
   * @param {number} productId - Product ID
   * @param {Object} productData - Updated product data
   * @returns {boolean} Success status
   */
  updateProduct: function (productId, productData) {
    if (!this.isAdmin()) return false;

    // Get existing products
    let products = window.productFunctions.getAllProducts();

    const productIndex = products.findIndex(
      (p) => p.id === parseInt(productId)
    );

    if (productIndex !== -1) {
      // Update product data
      products[productIndex] = {
        ...products[productIndex],
        ...productData,
      };

      // Save updated products
      window.PRODUCTS = products;
      localStorage.setItem("adminProducts", JSON.stringify(products));

      return true;
    }

    return false;
  },

  /**
   * Delete product
   * @param {number} productId - Product ID
   * @returns {boolean} Success status
   */
  deleteProduct: function (productId) {
    if (!this.isAdmin()) return false;

    // Get existing products
    let products = window.productFunctions.getAllProducts();

    const initialLength = products.length;
    products = products.filter((p) => p.id !== parseInt(productId));

    if (products.length < initialLength) {
      // Save updated products
      window.PRODUCTS = products;
      localStorage.setItem("adminProducts", JSON.stringify(products));

      return true;
    }

    return false;
  },

  /**
   * Initialize admin dashboard
   */
  init: function () {
    // Check if on admin page
    if (!document.querySelector(".admin-container")) return;

    // Check if user is logged in first
    if (!window.auth.isLoggedIn()) {
      window.location.href = "../login.html?redirect=admin";
      return;
    }

    // Then check if user is admin
    if (!this.isAdmin()) {
      // window.notifications.error(
      //   "Access denied. You must be an admin to view this page."
      // );
      // setTimeout(() => {
      //   window.location.href = "../../index.html";
      // }, 2000);
      // return;
    }

    // Initialize navigation
    this.initNavigation();

    // Load initial view
    this.loadDashboard();

    // Setup event listeners
    this.setupEventListeners();
  },

  /**
   * Initialize admin navigation
   */
  initNavigation: function () {
    const navLinks = document.querySelectorAll(".admin-nav a");

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        // Remove active class from all links
        navLinks.forEach((l) => l.classList.remove("active"));

        // Add active class to clicked link
        link.classList.add("active");

        // Get view name from data attribute
        const view = link.dataset.view;

        // Load view
        switch (view) {
          case "dashboard":
            this.loadDashboard();
            break;
          case "users":
            this.loadUsers();
            break;
          case "products":
            this.loadProducts();
            break;
          case "orders":
            this.loadOrders();
            break;
          case "settings":
            this.loadSettings();
            break;
        }
      });
    });
  },

  /**
   * Setup general event listeners
   */
  setupEventListeners: function () {
    // Logout button
    const logoutBtn = document.getElementById("admin-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.auth.logout();
      });
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const sidebar = document.querySelector(".admin-sidebar");
    const overlay = document.getElementById("mobile-overlay");

    if (mobileMenuToggle && sidebar && overlay) {
      mobileMenuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("show");
        overlay.classList.toggle("show");
      });

      // Close menu when clicking outside
      overlay.addEventListener("click", () => {
        sidebar.classList.remove("show");
        overlay.classList.remove("show");
      });

      // Close menu when clicking on a menu item (on mobile)
      const navLinks = document.querySelectorAll(".admin-nav a");
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 767) {
            sidebar.classList.remove("show");
            overlay.classList.remove("show");
          }
        });
      });
    }
  },

  /**
   * Load dashboard view
   */
  loadDashboard: function () {
    const contentArea = document.querySelector(".admin-content");
    if (!contentArea) return;

    // Get stats
    const users = this.getAllUsers();
    const products = window.productFunctions.getAllProducts();

    // Calculate total orders and revenue
    let totalOrders = 0;
    let totalRevenue = 0;

    users.forEach((user) => {
      if (user.orders) {
        totalOrders += user.orders.length;
        user.orders.forEach((order) => {
          totalRevenue += order.total || 0;
        });
      }
    });

    // Create dashboard HTML
    const html = `
      <h1>Admin Dashboard</h1>
      
      <div class="admin-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <h3>Total Users</h3>
            <p class="stat-value">${users.length}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-box"></i>
          </div>
          <div class="stat-content">
            <h3>Total Products</h3>
            <p class="stat-value">${products.length}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-shopping-bag"></i>
          </div>
          <div class="stat-content">
            <h3>Total Orders</h3>
            <p class="stat-value">${totalOrders}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-money-bill-wave"></i>
          </div>
          <div class="stat-content">
            <h3>Total Revenue</h3>
            <p class="stat-value">${window.util.formatPrice(totalRevenue)}</p>
          </div>
        </div>
      </div>
      
      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">
              <i class="fas fa-user-plus"></i>
            </div>
            <div class="activity-content">
              <p>New user registered: <strong>${
                users.length > 0 ? users[users.length - 1].email : "None"
              }</strong></p>
              <p class="activity-time">Today</p>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="activity-content">
              <p>New order placed: <strong>ORD-${Date.now()
                .toString()
                .substring(5, 13)}</strong></p>
              <p class="activity-time">Yesterday</p>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon">
              <i class="fas fa-box"></i>
            </div>
            <div class="activity-content">
              <p>New product added: <strong>${
                products.length > 0
                  ? products[products.length - 1].name
                  : "None"
              }</strong></p>
              <p class="activity-time">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    `;

    contentArea.innerHTML = html;
  },

  /**
   * Load users view
   */
  loadUsers: function () {
    const contentArea = document.querySelector(".admin-content");
    if (!contentArea) return;

    // Get users
    const users = this.getAllUsers();

    // Create users HTML
    let usersHtml = "";

    users.forEach((user) => {
      usersHtml += `
        <tr data-email="${user.email}">
          <td>${user.firstName} ${user.lastName}</td>
          <td>${user.email}</td>
          <td>${user.orders ? user.orders.length : 0} orders</td>
          <td>${new Date().toLocaleDateString()}</td>
          <td>
            <button class="btn btn-sm edit-user-btn">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-sm btn-danger delete-user-btn">
              <i class="fas fa-trash"></i> Delete
            </button>
          </td>
        </tr>
      `;
    });

    const html = `
      <div class="admin-header">
        <h1>Manage Users</h1>
        <button class="btn btn-primary" id="add-user-btn">
          <i class="fas fa-plus"></i> Add User
        </button>
      </div>
      
      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Registration Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${
              usersHtml.length > 0
                ? usersHtml
                : '<tr><td colspan="5">No users found</td></tr>'
            }
          </tbody>
        </table>
      </div>
      
      <div class="modal" id="user-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="user-modal-title">Add User</h2>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <form id="user-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="user-first-name">First Name</label>
                  <input type="text" id="user-first-name" name="firstName" required>
                </div>
                <div class="form-group">
                  <label for="user-last-name">Last Name</label>
                  <input type="text" id="user-last-name" name="lastName" required>
                </div>
              </div>
              <div class="form-group">
                <label for="user-email">Email</label>
                <input type="email" id="user-email" name="email" required>
              </div>
              <div class="form-group">
                <label for="user-password">Password</label>
                <input type="password" id="user-password" name="password" required>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block">Save User</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    contentArea.innerHTML = html;

    // Setup event listeners
    this.setupUserEventListeners();
  },

  /**
   * Setup user-related event listeners
   */
  setupUserEventListeners: function () {
    // Add user button
    const addUserBtn = document.getElementById("add-user-btn");
    if (addUserBtn) {
      addUserBtn.addEventListener("click", () => {
        const modal = document.getElementById("user-modal");
        const modalTitle = document.getElementById("user-modal-title");
        const form = document.getElementById("user-form");

        // Set modal title
        modalTitle.textContent = "Add User";

        // Reset form
        form.reset();

        // Show modal
        modal.classList.add("show");
      });
    }

    // Edit user buttons
    const editUserBtns = document.querySelectorAll(".edit-user-btn");
    editUserBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const email = btn.closest("tr").dataset.email;
        const user = this.getUserByEmail(email);

        if (user) {
          const modal = document.getElementById("user-modal");
          const modalTitle = document.getElementById("user-modal-title");
          const form = document.getElementById("user-form");

          // Set modal title
          modalTitle.textContent = "Edit User";

          // Populate form
          document.getElementById("user-first-name").value = user.firstName;
          document.getElementById("user-last-name").value = user.lastName;
          document.getElementById("user-email").value = user.email;
          document.getElementById("user-email").readOnly = true; // Can't change email
          document.getElementById("user-password").value = ""; // Don't show password
          document.getElementById("user-password").placeholder =
            "Leave blank to keep current password";
          document.getElementById("user-password").required = false;

          // Store original email for reference
          form.dataset.originalEmail = user.email;

          // Show modal
          modal.classList.add("show");
        }
      });
    });

    // Delete user buttons
    const deleteUserBtns = document.querySelectorAll(".delete-user-btn");
    deleteUserBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this user?")) {
          const email = btn.closest("tr").dataset.email;

          if (this.deleteUser(email)) {
            // Remove row from table
            btn.closest("tr").remove();
            window.notifications.success("User deleted successfully.");
          } else {
            window.notifications.error("Failed to delete user.");
          }
        }
      });
    });

    // Close modal
    const modalCloseBtns = document.querySelectorAll(".modal-close");
    modalCloseBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.closest(".modal").classList.remove("show");
      });
    });

    // User form submission
    const userForm = document.getElementById("user-form");
    if (userForm) {
      userForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const firstName = document.getElementById("user-first-name").value;
        const lastName = document.getElementById("user-last-name").value;
        const email = document.getElementById("user-email").value;
        const password = document.getElementById("user-password").value;

        if (userForm.dataset.originalEmail) {
          // Update existing user
          const originalEmail = userForm.dataset.originalEmail;
          const userData = {
            firstName,
            lastName,
          };

          // Only update password if provided
          if (password) {
            userData.password = password;
          }

          if (this.updateUser(originalEmail, userData)) {
            window.notifications.success("User updated successfully.");
            this.loadUsers(); // Reload users view
          } else {
            window.notifications.error("Failed to update user.");
          }
        } else {
          // Create new user
          if (window.auth.register(firstName, lastName, email, password)) {
            window.notifications.success("User created successfully.");
            this.loadUsers(); // Reload users view
          } else {
            window.notifications.error(
              "Failed to create user. Email may already be in use."
            );
          }
        }

        // Close modal
        document.getElementById("user-modal").classList.remove("show");
      });
    }
  },

  /**
   * Load products view
   */
  loadProducts: function () {
    const contentArea = document.querySelector(".admin-content");
    if (!contentArea) return;

    // Get products
    const products = window.productFunctions.getAllProducts();

    // Create products HTML
    let productsHtml = "";

    products.forEach((product) => {
      productsHtml += `
        <tr data-id="${product.id}">
          <td>
            <div class="product-info">
              <img src="${product.images[0]}" alt="${product.name}">
              <div>
                <h4>${product.name}</h4>
                <p>${product.category}</p>
              </div>
            </div>
          </td>
          <td>${window.util.formatPrice(product.price)}</td>
          <td>${product.stock}</td>
          <td>${
            product.isFeatured
              ? '<span class="badge badge-success">Yes</span>'
              : "No"
          }</td>
          <td>
            <button class="btn btn-sm edit-product-btn">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-sm btn-danger delete-product-btn">
              <i class="fas fa-trash"></i> Delete
            </button>
          </td>
        </tr>
      `;
    });

    const html = `
      <div class="admin-header">
        <h1>Manage Products</h1>
        <button class="btn btn-primary" id="add-product-btn">
          <i class="fas fa-plus"></i> Add Product
        </button>
      </div>
      
      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${
              productsHtml.length > 0
                ? productsHtml
                : '<tr><td colspan="5">No products found</td></tr>'
            }
          </tbody>
        </table>
      </div>
      
      <div class="modal" id="product-modal">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h2 id="product-modal-title">Add Product</h2>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <form id="product-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="product-name">Product Name</label>
                  <input type="text" id="product-name" name="name" required>
                </div>
                <div class="form-group">
                  <label for="product-category">Category</label>
                  <select id="product-category" name="category" required>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="home">Home & Kitchen</option>
                    <option value="beauty">Beauty</option>
                  </select>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="product-price">Price ($)</label>
                  <input type="number" id="product-price" name="price" step="0.01" min="0" required>
                </div>
                <div class="form-group">
                  <label for="product-original-price">Original Price ($)</label>
                  <input type="number" id="product-original-price" name="originalPrice" step="0.01" min="0">
                </div>
                <div class="form-group">
                  <label for="product-stock">Stock</label>
                  <input type="number" id="product-stock" name="stock" min="0" required>
                </div>
              </div>
              
              <div class="form-group">
                <label for="product-description">Description</label>
                <textarea id="product-description" name="description" rows="3" required></textarea>
              </div>
              
              <div class="form-group">
                <label for="product-image">Image URL</label>
                <input type="url" id="product-image" name="image" required placeholder="https://example.com/image.jpg">
                <p class="form-hint">For multiple images, separate URLs with a comma</p>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="product-sku">SKU</label>
                  <input type="text" id="product-sku" name="sku" required>
                </div>
                <div class="form-group">
                  <label for="product-colors">Colors</label>
                  <input type="text" id="product-colors" name="colors" placeholder="Black, White, Blue">
                </div>
                <div class="form-group">
                  <label for="product-sizes">Sizes</label>
                  <input type="text" id="product-sizes" name="sizes" placeholder="S, M, L, XL">
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group checkbox-group">
                  <label>
                    <input type="checkbox" id="product-featured" name="isFeatured">
                    Featured Product
                  </label>
                </div>
                <div class="form-group checkbox-group">
                  <label>
                    <input type="checkbox" id="product-new" name="isNew">
                    New Product
                  </label>
                </div>
              </div>
              
              <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    contentArea.innerHTML = html;

    // Setup event listeners
    this.setupProductEventListeners();
  },

  /**
   * Setup product-related event listeners
   */
  setupProductEventListeners: function () {
    // Add product button
    const addProductBtn = document.getElementById("add-product-btn");
    if (addProductBtn) {
      addProductBtn.addEventListener("click", () => {
        const modal = document.getElementById("product-modal");
        const modalTitle = document.getElementById("product-modal-title");
        const form = document.getElementById("product-form");

        // Set modal title
        modalTitle.textContent = "Add Product";

        // Reset form
        form.reset();

        // Show modal
        modal.classList.add("show");
      });
    }

    // Edit product buttons
    const editProductBtns = document.querySelectorAll(".edit-product-btn");
    editProductBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const productId = parseInt(btn.closest("tr").dataset.id);
        const product = window.productFunctions.getProductById(productId);

        if (product) {
          const modal = document.getElementById("product-modal");
          const modalTitle = document.getElementById("product-modal-title");
          const form = document.getElementById("product-form");

          // Set modal title
          modalTitle.textContent = "Edit Product";

          // Populate form
          document.getElementById("product-name").value = product.name;
          document.getElementById("product-category").value = product.category;
          document.getElementById("product-price").value = product.price;
          document.getElementById("product-original-price").value =
            product.originalPrice || "";
          document.getElementById("product-stock").value = product.stock;
          document.getElementById("product-description").value =
            product.description;
          document.getElementById("product-image").value =
            product.images.join(",");
          document.getElementById("product-sku").value = product.sku;
          document.getElementById("product-colors").value = product.colors
            ? product.colors.join(", ")
            : "";
          document.getElementById("product-sizes").value = product.sizes
            ? product.sizes.join(", ")
            : "";
          document.getElementById("product-featured").checked =
            product.isFeatured;
          document.getElementById("product-new").checked = product.isNew;

          // Store product ID for reference
          form.dataset.productId = product.id;

          // Show modal
          modal.classList.add("show");
        }
      });
    });

    // Delete product buttons
    const deleteProductBtns = document.querySelectorAll(".delete-product-btn");
    deleteProductBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this product?")) {
          const productId = parseInt(btn.closest("tr").dataset.id);

          if (this.deleteProduct(productId)) {
            // Remove row from table
            btn.closest("tr").remove();
            window.notifications.success("Product deleted successfully.");
          } else {
            window.notifications.error("Failed to delete product.");
          }
        }
      });
    });

    // Close modal
    const modalCloseBtns = document.querySelectorAll(".modal-close");
    modalCloseBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.closest(".modal").classList.remove("show");
      });
    });

    // Product form submission
    const productForm = document.getElementById("product-form");
    if (productForm) {
      productForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById("product-name").value;
        const category = document.getElementById("product-category").value;
        const price = parseFloat(
          document.getElementById("product-price").value
        );
        const originalPrice = document.getElementById("product-original-price")
          .value
          ? parseFloat(document.getElementById("product-original-price").value)
          : price;
        const stock = parseInt(document.getElementById("product-stock").value);
        const description = document.getElementById(
          "product-description"
        ).value;
        const imagesStr = document.getElementById("product-image").value;
        const sku = document.getElementById("product-sku").value;
        const colorsStr = document.getElementById("product-colors").value;
        const sizesStr = document.getElementById("product-sizes").value;
        const isFeatured = document.getElementById("product-featured").checked;
        const isNew = document.getElementById("product-new").checked;

        // Process arrays
        const images = imagesStr.split(",").map((img) => img.trim());

        const colors = colorsStr
          ? colorsStr.split(",").map((color) => color.trim())
          : [];

        const sizes = sizesStr
          ? sizesStr.split(",").map((size) => size.trim())
          : [];

        // Calculate discount percentage
        const discount =
          originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : 0;

        // Construct product data
        const productData = {
          name,
          description,
          price,
          originalPrice: originalPrice > price ? originalPrice : price,
          discount,
          category,
          images,
          isNew,
          isFeatured,
          colors,
          sizes,
          stock,
          sku,
          rating: 4.5, // Default rating
          reviewCount: 0,
        };

        if (productForm.dataset.productId) {
          // Update existing product
          const productId = parseInt(productForm.dataset.productId);

          if (this.updateProduct(productId, productData)) {
            window.notifications.success("Product updated successfully.");
            this.loadProducts(); // Reload products view
          } else {
            window.notifications.error("Failed to update product.");
          }
        } else {
          // Create new product
          if (this.addProduct(productData)) {
            window.notifications.success("Product created successfully.");
            this.loadProducts(); // Reload products view
          } else {
            window.notifications.error("Failed to create product.");
          }
        }

        // Close modal
        document.getElementById("product-modal").classList.remove("show");
      });
    }
  },

  /**
   * Load orders view
   */
  loadOrders: function () {
    const contentArea = document.querySelector(".admin-content");
    if (!contentArea) return;

    // Get all users to extract orders
    const users = this.getAllUsers();
    const orders = [];

    // Collect all orders from users
    users.forEach((user) => {
      if (user.orders) {
        user.orders.forEach((order) => {
          orders.push({
            ...order,
            user: {
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
            },
          });
        });
      }
    });

    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    // Create orders HTML
    let ordersHtml = "";

    orders.forEach((order) => {
      const date = new Date(order.orderDate);
      const dateStr = date.toLocaleDateString();

      ordersHtml += `
        <tr data-id="${order.orderId}">
          <td>${order.orderId}</td>
          <td>${order.user.name}</td>
          <td>${dateStr}</td>
          <td>${window.util.formatPrice(order.total)}</td>
          <td>
            <span class="status-badge status-${order.status}">
              ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </td>
          <td>
            <button class="btn btn-sm view-order-btn">
              <i class="fas fa-eye"></i> View
            </button>
            <button class="btn btn-sm update-status-btn">
              <i class="fas fa-sync"></i> Status
            </button>
          </td>
        </tr>
      `;
    });

    const html = `
      <div class="admin-header">
        <h1>Manage Orders</h1>
      </div>
      
      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${
              ordersHtml.length > 0
                ? ordersHtml
                : '<tr><td colspan="6">No orders found</td></tr>'
            }
          </tbody>
        </table>
      </div>
      
      <div class="modal" id="order-modal">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h2 id="order-modal-title">Order Details</h2>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body" id="order-details-container">
            <!-- Order details will be populated here -->
          </div>
        </div>
      </div>
      
      <div class="modal" id="status-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Update Order Status</h2>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <form id="status-form">
              <div class="form-group">
                <label for="order-status">Status</label>
                <select id="order-status" name="status" required>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block">Update Status</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    contentArea.innerHTML = html;

    // Setup event listeners
    this.setupOrderEventListeners();
  },

  /**
   * Setup order-related event listeners
   */
  setupOrderEventListeners: function () {
    // View order buttons
    const viewOrderBtns = document.querySelectorAll(".view-order-btn");
    viewOrderBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const orderId = btn.closest("tr").dataset.id;
        this.showOrderDetails(orderId);
      });
    });

    // Update status buttons
    const updateStatusBtns = document.querySelectorAll(".update-status-btn");
    updateStatusBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const orderId = btn.closest("tr").dataset.id;
        const statusModal = document.getElementById("status-modal");
        const statusForm = document.getElementById("status-form");

        // Store order ID for reference
        statusForm.dataset.orderId = orderId;

        // Show modal
        statusModal.classList.add("show");
      });
    });

    // Close modals
    const modalCloseBtns = document.querySelectorAll(".modal-close");
    modalCloseBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.closest(".modal").classList.remove("show");
      });
    });

    // Status form submission
    const statusForm = document.getElementById("status-form");
    if (statusForm) {
      statusForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const orderId = statusForm.dataset.orderId;
        const status = document.getElementById("order-status").value;

        if (this.updateOrderStatus(orderId, status)) {
          window.notifications.success("Order status updated successfully.");

          // Update status in the table
          const statusCell = document.querySelector(
            `tr[data-id="${orderId}"] .status-badge`
          );
          if (statusCell) {
            statusCell.className = `status-badge status-${status}`;
            statusCell.textContent =
              status.charAt(0).toUpperCase() + status.slice(1);
          }
        } else {
          window.notifications.error("Failed to update order status.");
        }

        // Close modal
        document.getElementById("status-modal").classList.remove("show");
      });
    }
  },

  /**
   * Show order details
   * @param {string} orderId - Order ID
   */
  showOrderDetails: function (orderId) {
    // Get all users to find the order
    const users = this.getAllUsers();
    let foundOrder = null;
    let foundUser = null;

    // Find the order
    for (const user of users) {
      if (user.orders) {
        const order = user.orders.find((o) => o.orderId === orderId);
        if (order) {
          foundOrder = order;
          foundUser = user;
          break;
        }
      }
    }

    if (!foundOrder || !foundUser) {
      window.notifications.error("Order not found.");
      return;
    }

    // Format order date
    const date = new Date(foundOrder.orderDate);
    const dateStr = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    // Create order items HTML
    let itemsHtml = "";

    foundOrder.items.forEach((item) => {
      itemsHtml += `
        <tr>
          <td>
            <div class="order-item">
              <img src="${item.image}" alt="${item.name}">
              <div>
                <h4>${item.name}</h4>
                <p>${item.color ? `Color: ${item.color}` : ""} ${
        item.size ? `Size: ${item.size}` : ""
      }</p>
              </div>
            </div>
          </td>
          <td>${window.util.formatPrice(item.price)}</td>
          <td>${item.quantity}</td>
          <td>${window.util.formatPrice(item.price * item.quantity)}</td>
        </tr>
      `;
    });

    // Get shipping address
    const address =
      foundOrder.shippingAddress || foundUser.addresses?.shipping || {};

    // Create order details HTML
    const html = `
      <div class="order-details">
        <div class="order-info">
          <div class="order-info-section">
            <h3>Order Information</h3>
            <p><strong>Order ID:</strong> ${foundOrder.orderId}</p>
            <p><strong>Date:</strong> ${dateStr}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${
              foundOrder.status
            }">${
      foundOrder.status.charAt(0).toUpperCase() + foundOrder.status.slice(1)
    }</span></p>
          </div>
          
          <div class="order-info-section">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${foundUser.firstName} ${
      foundUser.lastName
    }</p>
            <p><strong>Email:</strong> ${foundUser.email}</p>
            <p><strong>Phone:</strong> ${address.phone || "N/A"}</p>
          </div>
          
          <div class="order-info-section">
            <h3>Shipping Address</h3>
            <p>${address.firstName || foundUser.firstName} ${
      address.lastName || foundUser.lastName
    }</p>
            <p>${address.street || "N/A"}</p>
            <p>${address.city || "N/A"}, ${address.state || "N/A"} ${
      address.zip || "N/A"
    }</p>
            <p>${address.country || "N/A"}</p>
          </div>
          
          <div class="order-info-section">
            <h3>Payment Information</h3>
            <p><strong>Payment Method:</strong> Credit Card</p>
            <p><strong>Card:</strong> **** **** **** ${Math.floor(
              1000 + Math.random() * 9000
            )}</p>
          </div>
        </div>
        
        <div class="order-items">
          <h3>Order Items</h3>
          <div class="table-responsive">
            <table class="order-items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="text-right"><strong>Subtotal:</strong></td>
                  <td>${window.util.formatPrice(foundOrder.subtotal || 0)}</td>
                </tr>
                <tr>
                  <td colspan="3" class="text-right"><strong>Shipping:</strong></td>
                  <td>${window.util.formatPrice(foundOrder.shipping || 0)}</td>
                </tr>
                ${
                  foundOrder.discount
                    ? `
                <tr>
                  <td colspan="3" class="text-right"><strong>Discount:</strong></td>
                  <td>-${window.util.formatPrice(foundOrder.discount)}</td>
                </tr>
                `
                    : ""
                }
                <tr class="order-total">
                  <td colspan="3" class="text-right"><strong>Total:</strong></td>
                  <td>${window.util.formatPrice(foundOrder.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    `;

    // Populate modal and show it
    const modal = document.getElementById("order-modal");
    const detailsContainer = document.getElementById("order-details-container");

    detailsContainer.innerHTML = html;
    modal.classList.add("show");
  },

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {boolean} Success status
   */
  updateOrderStatus: function (orderId, status) {
    if (!this.isAdmin()) return false;

    // Get all users to find the order
    let users = this.getAllUsers();
    let foundIndex = -1;
    let foundOrderIndex = -1;

    // Find the order
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user.orders) {
        for (let j = 0; j < user.orders.length; j++) {
          if (user.orders[j].orderId === orderId) {
            foundIndex = i;
            foundOrderIndex = j;
            break;
          }
        }
      }
      if (foundIndex !== -1) break;
    }

    if (foundIndex === -1 || foundOrderIndex === -1) return false;

    // Update order status
    users[foundIndex].orders[foundOrderIndex].status = status;

    // Save updated users
    localStorage.setItem("users", JSON.stringify(users));

    // Update current user if this is their order
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.email === users[foundIndex].email) {
      localStorage.setItem("currentUser", JSON.stringify(users[foundIndex]));
    }

    return true;
  },

  /**
   * Load settings view
   */
  loadSettings: function () {
    const contentArea = document.querySelector(".admin-content");
    if (!contentArea) return;

    const html = `
      <div class="admin-header">
        <h1>Settings</h1>
      </div>
      
      <div class="settings-container">
        <div class="settings-section">
          <h2>General Settings</h2>
          <form id="general-settings-form">
            <div class="form-row">
              <div class="form-group">
                <label for="store-name">Store Name</label>
                <input type="text" id="store-name" name="storeName" value="Shoply">
              </div>
              <div class="form-group">
                <label for="store-email">Store Email</label>
                <input type="email" id="store-email" name="storeEmail" value="support@shoply.com">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="currency">Currency</label>
                <select id="currency" name="currency">
                  <option value="USD" selected>USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div class="form-group">
                <label for="tax-rate">Tax Rate (%)</label>
                <input type="number" id="tax-rate" name="taxRate" value="7.5" min="0" step="0.1">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group checkbox-group">
                <label>
                  <input type="checkbox" id="enable-reviews" name="enableReviews" checked>
                  Enable Customer Reviews
                </label>
              </div>
              <div class="form-group checkbox-group">
                <label>
                  <input type="checkbox" id="enable-wishlist" name="enableWishlist" checked>
                  Enable Wishlist Feature
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Save General Settings</button>
            </div>
          </form>
        </div>
        
        <div class="settings-section">
          <h2>Payment Settings</h2>
          <form id="payment-settings-form">
            <div class="form-row">
              <div class="form-group checkbox-group">
                <label>
                  <input type="checkbox" id="enable-paypal" name="enablePaypal" checked>
                  Enable PayPal
                </label>
              </div>
              <div class="form-group checkbox-group">
                <label>
                  <input type="checkbox" id="enable-stripe" name="enableStripe" checked>
                  Enable Stripe
                </label>
              </div>
              <div class="form-group checkbox-group">
                <label>
                  <input type="checkbox" id="enable-cod" name="enableCod" checked>
                  Enable Cash on Delivery
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <label for="paypal-email">PayPal Email</label>
              <input type="email" id="paypal-email" name="paypalEmail" value="payments@shoply.com">
            </div>
            
            <div class="form-group">
              <label for="stripe-key">Stripe Public Key</label>
              <input type="text" id="stripe-key" name="stripeKey" value="pk_test_...">
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Save Payment Settings</button>
            </div>
          </form>
        </div>
        
        <div class="settings-section">
          <h2>Shipping Settings</h2>
          <form id="shipping-settings-form">
            <div class="form-group">
              <label for="free-shipping-threshold">Free Shipping Threshold ($)</label>
              <input type="number" id="free-shipping-threshold" name="freeShippingThreshold" value="50" min="0" step="0.01">
            </div>
            
            <div class="form-group">
              <label for="default-shipping-fee">Default Shipping Fee ($)</label>
              <input type="number" id="default-shipping-fee" name="defaultShippingFee" value="5.99" min="0" step="0.01">
            </div>
            
            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" id="enable-international" name="enableInternational" checked>
                Enable International Shipping
              </label>
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Save Shipping Settings</button>
            </div>
          </form>
        </div>
      </div>
    `;

    contentArea.innerHTML = html;

    // Setup event listeners for settings forms
    const settingsForms = document.querySelectorAll(".settings-container form");
    settingsForms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        // In a real app, this would save settings to the server
        // For demo, just show success message
        window.notifications.success("Settings saved successfully.");
      });
    });
  },
};

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", function () {
  // Initialize admin functionality
  if (document.querySelector(".admin-container")) {
    admin.init();
  }
});

// Expose admin functionality globally
window.admin = admin;
