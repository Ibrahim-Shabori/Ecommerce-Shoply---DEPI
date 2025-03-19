/**
 * Shoply - Main Application JavaScript
 * This file contains common functionality used across the entire site.
 */

// Utility functions
const util = {
  /**
   * Format price with currency symbol
   * @param {number} price - The price to format
   * @param {string} currency - The currency code (default: USD)
   * @returns {string} Formatted price string
   */
  formatPrice: function(price, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  },

  /**
   * Create a throttled function that only invokes the provided function at most once per specified interval
   * @param {Function} func - The function to throttle
   * @param {number} limit - The time limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle: function(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Create a debounced function that delays invoking the provided function until after the specified wait time
   * @param {Function} func - The function to debounce
   * @param {number} wait - The wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce: function(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  },

  /**
   * Sanitize HTML string to prevent XSS attacks
   * @param {string} html - The HTML string to sanitize
   * @returns {string} Sanitized HTML string
   */
  sanitizeHTML: function(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
  },

  /**
   * Get URL parameters as an object
   * @returns {Object} URL parameters
   */
  getUrlParams: function() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    for (let i = 0; i < pairs.length; i++) {
      if(!pairs[i]) continue;
      const pair = pairs[i].split('=');
      params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    
    return params;
  },

  /**
   * Check if device is mobile
   * @returns {boolean} True if mobile device
   */
  isMobile: function() {
    return window.innerWidth < 768;
  },

  /**
   * Validate email address format
   * @param {string} email - The email to validate
   * @returns {boolean} True if valid email
   */
  isValidEmail: function(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },

  /**
   * Generate a random ID
   * @returns {string} Random ID
   */
  generateRandomId: function() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
};

// DOM manipulation helpers
const dom = {
  /**
   * Get element by ID
   * @param {string} id - Element ID
   * @returns {HTMLElement|null} The element or null
   */
  byId: function(id) {
    return document.getElementById(id);
  },

  /**
   * Get elements by selector
   * @param {string} selector - CSS selector
   * @param {HTMLElement} [parent=document] - Parent element
   * @returns {NodeList} List of elements
   */
  find: function(selector, parent = document) {
    return parent.querySelectorAll(selector);
  },

  /**
   * Get first element by selector
   * @param {string} selector - CSS selector
   * @param {HTMLElement} [parent=document] - Parent element
   * @returns {HTMLElement|null} The element or null
   */
  findOne: function(selector, parent = document) {
    return parent.querySelector(selector);
  },

  /**
   * Create an element with optional attributes and children
   * @param {string} tag - Element tag name
   * @param {Object} [attrs={}] - Element attributes
   * @param {Array|HTMLElement|string} [children] - Child elements or text
   * @returns {HTMLElement} The created element
   */
  create: function(tag, attrs = {}, children) {
    const element = document.createElement(tag);
    
    for (const key in attrs) {
      if (key === 'className') {
        element.className = attrs[key];
      } else if (key === 'dataset') {
        for (const dataKey in attrs[key]) {
          element.dataset[dataKey] = attrs[key][dataKey];
        }
      } else if (key === 'style') {
        for (const styleKey in attrs[key]) {
          element.style[styleKey] = attrs[key][styleKey];
        }
      } else if (key.startsWith('on') && typeof attrs[key] === 'function') {
        element.addEventListener(key.substring(2).toLowerCase(), attrs[key]);
      } else {
        element.setAttribute(key, attrs[key]);
      }
    }
    
    if (children) {
      if (Array.isArray(children)) {
        children.forEach(child => {
          if (child instanceof HTMLElement) {
            element.appendChild(child);
          } else {
            element.appendChild(document.createTextNode(child));
          }
        });
      } else if (children instanceof HTMLElement) {
        element.appendChild(children);
      } else {
        element.textContent = children;
      }
    }
    
    return element;
  },

  /**
   * Remove all children from an element
   * @param {HTMLElement} element - The element to clear
   */
  empty: function(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },

  /**
   * Add event listener to elements
   * @param {string|HTMLElement|NodeList} selector - CSS selector, element, or element list
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   * @param {boolean} [useCapture=false] - Use capture phase
   */
  on: function(selector, event, callback, useCapture = false) {
    if (typeof selector === 'string') {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.addEventListener(event, callback, useCapture);
      });
    } else if (selector instanceof NodeList) {
      selector.forEach(element => {
        element.addEventListener(event, callback, useCapture);
      });
    } else if (selector instanceof HTMLElement) {
      selector.addEventListener(event, callback, useCapture);
    }
  }
};

// Notification system
const notifications = {
  /**
   * Show a notification message
   * @param {string} message - The message to display
   * @param {string} [type='success'] - The notification type ('success', 'error', 'info')
   * @param {number} [duration=3000] - Duration in milliseconds
   */
  show: function(message, type = 'success', duration = 3000) {
    const notificationElement = dom.byId('notification');
    if (!notificationElement) return;
    
    // Clear any existing notification
    clearTimeout(notificationElement.timeout);
    
    // Set content and type
    notificationElement.textContent = message;
    notificationElement.className = `notification ${type}`;
    
    // Show notification
    notificationElement.classList.add('show');
    
    // Hide after duration
    notificationElement.timeout = setTimeout(() => {
      notificationElement.classList.remove('show');
    }, duration);
  },

  /**
   * Show a success notification
   * @param {string} message - The message to display
   * @param {number} [duration=3000] - Duration in milliseconds
   */
  success: function(message, duration = 3000) {
    this.show(message, 'success', duration);
  },

  /**
   * Show an error notification
   * @param {string} message - The message to display
   * @param {number} [duration=3000] - Duration in milliseconds
   */
  error: function(message, duration = 3000) {
    this.show(message, 'error', duration);
  },

  /**
   * Show an info notification
   * @param {string} message - The message to display
   * @param {number} [duration=3000] - Duration in milliseconds
   */
  info: function(message, duration = 3000) {
    this.show(message, 'info', duration);
  }
};

// Mobile menu functionality
const mobileMenu = {
  init: function() {
    const toggleButton = dom.byId('mobile-menu-toggle');
    const closeButton = dom.byId('mobile-menu-close');
    const mobileMenu = dom.byId('mobile-menu');
    const dropdownToggles = dom.find('.mobile-dropdown-toggle');
    
    if (toggleButton && mobileMenu) {
      toggleButton.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }
    
    if (closeButton && mobileMenu) {
      closeButton.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    
    // Handle mobile dropdown toggles
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = toggle.parentElement;
        parent.classList.toggle('active');
      });
    });
  }
};

// Header functionality
const header = {
  init: function() {
    const dropdownToggles = dom.find('.dropdown-toggle');
    
    // Handle desktop dropdown toggles
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
      });
    });
    
    // Handle search functionality
    const searchForm = dom.findOne('.search-container');
    const searchInput = dom.byId('search-input');
    const searchButton = dom.byId('search-btn');
    
    if (searchForm && searchInput && searchButton) {
      searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
          window.location.href = `../index.html?search=${encodeURIComponent(searchTerm)}`;
        }
      });
      
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          searchButton.click();
        }
      });
    }
  }
};

// Tab functionality
const tabs = {
  init: function() {
    const tabButtons = dom.find('.tab-btn');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.dataset.tab;
        const tabContainer = button.closest('.product-tabs');
        const activeButtons = dom.find('.tab-btn.active', tabContainer);
        const activePanes = dom.find('.tab-pane.active', tabContainer);
        
        // Remove active class from all tabs and panes
        activeButtons.forEach(btn => btn.classList.remove('active'));
        activePanes.forEach(pane => pane.classList.remove('active'));
        
        // Set active tab
        button.classList.add('active');
        const tabPane = dom.byId(tabId);
        if (tabPane) {
          tabPane.classList.add('active');
        }
      });
    });
  }
};

// Account page functionality
const account = {
  init: function() {
    const accountTabs = dom.find('.account-nav a[data-tab]');
    
    accountTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = tab.dataset.tab;
        
        // Remove active class from all tabs
        accountTabs.forEach(t => t.classList.remove('active'));
        
        // Set active tab
        tab.classList.add('active');
        
        // Hide all tab contents
        const tabContents = dom.find('.account-tab');
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Show selected tab content
        const selectedContent = dom.byId(tabId);
        if (selectedContent) {
          selectedContent.classList.add('active');
        }
      });
    });
    
    // Handle address editing
    const editAddressButtons = dom.find('.edit-address');
    const cancelAddressButton = dom.byId('cancel-address');
    const addressFormContainer = dom.byId('address-form-container');
    
    editAddressButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const addressType = button.dataset.type;
        
        // Set form title and address type
        dom.byId('address-form-title').textContent = `Edit ${addressType.charAt(0).toUpperCase() + addressType.slice(1)} Address`;
        dom.byId('address-type').value = addressType;
        
        // Show form
        addressFormContainer.classList.remove('hidden');
      });
    });
    
    if (cancelAddressButton) {
      cancelAddressButton.addEventListener('click', () => {
        addressFormContainer.classList.add('hidden');
      });
    }
  }
};

// Helper function to setup quantity selectors
function setupQuantitySelectors() {
  const decreaseButtons = dom.find('.quantity-btn:first-child');
  const increaseButtons = dom.find('.quantity-btn:last-child');
  
  decreaseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const input = button.nextElementSibling;
      const value = parseInt(input.value, 10);
      if (value > parseInt(input.min, 10)) {
        input.value = value - 1;
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    });
  });
  
  increaseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const input = button.previousElementSibling;
      const value = parseInt(input.value, 10);
      if (value < parseInt(input.max, 10)) {
        input.value = value + 1;
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    });
  });
}

// Newsletter subscription
function setupNewsletter() {
  const newsletterForms = dom.find('.newsletter-form');
  
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (util.isValidEmail(email)) {
        // In a real implementation, this would call an API to subscribe
        notifications.success('Thank you for subscribing to our newsletter!');
        emailInput.value = '';
      } else {
        notifications.error('Please enter a valid email address.');
      }
    });
  });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize components
  mobileMenu.init();
  header.init();
  tabs.init();
  
  // Setup quantity selectors
  setupQuantitySelectors();
  
  // Setup newsletter subscription
  setupNewsletter();
  
  // Initialize account page functionality if on account page
  if (document.querySelector('.account-section')) {
    account.init();
  }
  
  // Set current year in footer
  const yearElements = dom.find('.current-year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });
  
  // Initialize header cart count
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCountElements = dom.find('.cart-count');
  const mobileCartCount = dom.find('.mobile-cart-count');
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  cartCountElements.forEach(el => {
    el.textContent = totalItems;
  });
  
  mobileCartCount.forEach(el => {
    el.textContent = totalItems;
  });
});

// Make utility functions available globally
window.util = util;
window.dom = dom;
window.notifications = notifications;
