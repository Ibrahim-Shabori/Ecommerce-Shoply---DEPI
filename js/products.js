/**
 * Shoply - Products JavaScript
 * This file contains functionality for product listing, filtering, and product details.
 */

// Product data
// In a real application, this would be fetched from a server
const PRODUCTS = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    description:
      "Premium noise-cancelling wireless headphones with extended battery life and superior sound quality.",
    price: 179.99,
    originalPrice: 229.99,
    discount: 22,
    rating: 4.7,
    reviewCount: 253,
    category: "electronics",
    images: [
      "assets/chair.jpg",
      "https://via.placeholder.com/500x500?text=Wireless+Headphones+2",
      "https://via.placeholder.com/500x500?text=Wireless+Headphones+3",
      "https://via.placeholder.com/500x500?text=Wireless+Headphones+4",
    ],
    isNew: false,
    isFeatured: true,
    colors: ["Black", "White", "Blue"],
    sizes: [],
    stock: 45,
    sku: "EL-WH-001",
    details:
      "Experience premium sound quality with these wireless Bluetooth headphones. Featuring active noise cancellation, 40-hour battery life, and comfortable ear cups for extended listening sessions. Compatible with all Bluetooth-enabled devices.",
    specs: [
      { name: "Battery Life", value: "Up to 40 hours" },
      { name: "Bluetooth Version", value: "5.0" },
      { name: "Noise Cancellation", value: "Active" },
      { name: "Driver Size", value: "40mm" },
      { name: "Weight", value: "250g" },
      { name: "Charging", value: "USB-C, Fast charging" },
      { name: "Frequency Response", value: "20Hz - 20kHz" },
    ],
  },
  {
    id: 2,
    name: "Smart Fitness Tracker Watch",
    description:
      "Track your fitness goals with heart rate monitoring, sleep tracking, and GPS. Water-resistant and long battery life.",
    price: 99.99,
    originalPrice: 129.99,
    discount: 23,
    rating: 4.5,
    reviewCount: 187,
    category: "electronics",
    images: [
      "assets/hard.jpg",
      "../assets/mouse.jpg",
      "https://via.placeholder.com/500x500?text=Fitness+Watch+3",
    ],
    isNew: true,
    isFeatured: true,
    colors: ["Black", "Silver", "Rose Gold"],
    sizes: [],
    stock: 78,
    sku: "EL-FW-002",
    details:
      "Keep track of your fitness goals with this advanced smart watch. Features include heart rate monitoring, sleep tracking, GPS, step counter, and multiple workout modes. Water-resistant up to 50 meters and with a battery life of up to 7 days.",
    specs: [
      { name: "Battery Life", value: "Up to 7 days" },
      { name: "Water Resistance", value: "50m (5 ATM)" },
      { name: "Display", value: '1.3" AMOLED' },
      { name: "Connectivity", value: "Bluetooth 5.0, GPS" },
      { name: "Sensors", value: "Heart rate, Accelerometer, Gyroscope" },
      { name: "Compatibility", value: "iOS 10.0+, Android 5.0+" },
      { name: "Charging", value: "Magnetic charging cable" },
    ],
  },
  {
    id: 3,
    name: "Men's Casual Denim Jacket",
    description:
      "Classic denim jacket with a modern fit. Versatile styling options for any casual outfit.",
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    rating: 4.3,
    reviewCount: 142,
    category: "clothing",
    images: [
      "assets/chair.jpg",
      "https://via.placeholder.com/500x500?text=Denim+Jacket+2",
      "https://via.placeholder.com/500x500?text=Denim+Jacket+3",
      "https://via.placeholder.com/500x500?text=Denim+Jacket+4",
    ],
    isNew: false,
    isFeatured: true,
    colors: ["Blue", "Light Blue", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 120,
    sku: "CL-MJ-003",
    details:
      "This classic denim jacket features a modern fit with a slightly tailored silhouette. Made from 100% premium cotton denim that's been washed for a soft, broken-in feel. Features button-flap chest pockets, side welt pockets, and adjustable button cuffs.",
    specs: [
      { name: "Material", value: "100% Cotton Denim" },
      { name: "Fit", value: "Regular fit" },
      { name: "Closure", value: "Button front" },
      { name: "Pockets", value: "4 pockets (2 chest, 2 side)" },
      { name: "Care", value: "Machine wash cold, tumble dry low" },
      { name: "Origin", value: "Imported" },
    ],
  },
  {
    id: 4,
    name: "Women's Running Shoes",
    description:
      "Lightweight running shoes with responsive cushioning and breathable mesh upper. Perfect for daily runs.",
    price: 89.99,
    originalPrice: 109.99,
    discount: 18,
    rating: 4.6,
    reviewCount: 208,
    category: "clothing",
    images: [
      "assets/mouse.jpg",
      "https://via.placeholder.com/500x500?text=Running+Shoes+2",
      "https://via.placeholder.com/500x500?text=Running+Shoes+3",
    ],
    isNew: true,
    isFeatured: true,
    colors: ["Pink/White", "Blue/Gray", "Black/Red"],
    sizes: ["5", "6", "7", "8", "9", "10"],
    stock: 95,
    sku: "CL-WS-004",
    details:
      "Engineered for performance and comfort, these running shoes feature a breathable mesh upper, responsive cushioning, and durable rubber outsole. The lightweight design reduces fatigue during long runs, while the padded collar and tongue provide additional comfort.",
    specs: [
      { name: "Upper", value: "Engineered mesh" },
      { name: "Midsole", value: "Responsive foam cushioning" },
      { name: "Outsole", value: "Durable rubber" },
      { name: "Weight", value: "8.5 oz (size 7)" },
      { name: "Drop", value: "10mm" },
      { name: "Arch Support", value: "Neutral" },
      { name: "Best For", value: "Road running, daily training" },
    ],
  },
  {
    id: 5,
    name: "Stainless Steel Kitchen Knife Set",
    description:
      "Professional 15-piece kitchen knife set with high-carbon stainless steel blades and ergonomic handles.",
    price: 69.99,
    originalPrice: 99.99,
    discount: 30,
    rating: 4.8,
    reviewCount: 176,
    category: "home",
    images: [
      "assets/hard.jpg",
      "https://via.placeholder.com/500x500?text=Knife+Set+2",
      "https://via.placeholder.com/500x500?text=Knife+Set+3",
    ],
    isNew: false,
    isFeatured: true,
    colors: [],
    sizes: [],
    stock: 62,
    sku: "HK-KS-005",
    details:
      "This comprehensive 15-piece knife set includes everything you need for professional cooking at home. The high-carbon stainless steel blades ensure precision cutting and long-lasting sharpness. Ergonomic handles provide comfortable grip for safe and efficient food preparation.",
    specs: [
      {
        name: "Set Includes",
        value:
          '8" Chef, 8" Bread, 7" Santoku, 5.5" Serrated, 3.5" Paring, 6 Steak Knives, Kitchen Scissors, Sharpener, Block',
      },
      { name: "Blade Material", value: "High-carbon stainless steel" },
      { name: "Handle Material", value: "Ergonomic polymer" },
      { name: "Block Material", value: "Premium hardwood" },
      { name: "Dishwasher Safe", value: "No, hand wash recommended" },
      { name: "Warranty", value: "Limited lifetime warranty" },
    ],
  },
  {
    id: 6,
    name: "Ceramic Non-Stick Cookware Set",
    description:
      "10-piece ceramic-coated cookware set that's non-stick, scratch-resistant, and free of PFOA and PTFE.",
    price: 129.99,
    originalPrice: 179.99,
    discount: 28,
    rating: 4.4,
    reviewCount: 153,
    category: "home",
    images: [
      "assets/mouse.jpg",
      "https://via.placeholder.com/500x500?text=Cookware+Set+2",
      "https://via.placeholder.com/500x500?text=Cookware+Set+3",
    ],
    isNew: true,
    isFeatured: false,
    colors: ["Black", "Cream", "Red"],
    sizes: [],
    stock: 38,
    sku: "HK-CS-006",
    details:
      "This 10-piece ceramic-coated cookware set provides exceptional non-stick performance without harmful chemicals. The set includes essential pots and pans for everyday cooking. Heat-resistant handles stay cool on the stovetop, and the heavy-gauge aluminum core ensures even heat distribution.",
    specs: [
      {
        name: "Set Includes",
        value:
          '8" Fry Pan, 10" Fry Pan with Lid, 1.5qt Saucepan with Lid, 2.5qt Saucepan with Lid, 3qt Saute Pan with Lid, 6qt Stock Pot with Lid',
      },
      {
        name: "Construction",
        value: "Heavy-gauge aluminum with ceramic non-stick coating",
      },
      { name: "Coating", value: "PFOA and PTFE free ceramic" },
      { name: "Handle", value: "Silicone-wrapped stainless steel" },
      { name: "Compatibility", value: "Gas, electric, ceramic, halogen" },
      { name: "Oven Safe", value: "Up to 350°F" },
      { name: "Dishwasher Safe", value: "Yes, but hand wash recommended" },
    ],
  },
  {
    id: 7,
    name: "Vitamin C Facial Serum",
    description:
      "Brightening vitamin C serum with hyaluronic acid and vitamin E for radiant, hydrated skin.",
    price: 24.99,
    originalPrice: 34.99,
    discount: 29,
    rating: 4.7,
    reviewCount: 221,
    category: "beauty",
    images: [
      "assets/chair.jpg",
      "https://via.placeholder.com/500x500?text=Vitamin+C+Serum+2",
    ],
    isNew: false,
    isFeatured: true,
    colors: [],
    sizes: ["1 oz", "2 oz"],
    stock: 87,
    sku: "BE-VC-007",
    details:
      "This powerful vitamin C serum helps brighten skin tone, reduce fine lines, and boost collagen production. Formulated with stabilized vitamin C, hyaluronic acid for deep hydration, and vitamin E for antioxidant protection. Suitable for all skin types and free from parabens, sulfates, and artificial fragrances.",
    specs: [
      {
        name: "Key Ingredients",
        value:
          "20% Vitamin C (L-Ascorbic Acid), Hyaluronic Acid, Vitamin E, Ferulic Acid",
      },
      { name: "Skin Type", value: "All skin types" },
      {
        name: "Benefits",
        value: "Brightening, Anti-aging, Hydrating, Antioxidant protection",
      },
      {
        name: "Free From",
        value: "Parabens, Sulfates, Phthalates, Artificial fragrances",
      },
      {
        name: "Application",
        value: "Apply to clean skin morning and evening before moisturizer",
      },
      { name: "Made In", value: "USA" },
      { name: "Cruelty-Free", value: "Yes" },
    ],
  },
  {
    id: 8,
    name: "Organic Coffee Beans",
    description:
      "Fair Trade certified organic coffee beans with rich, smooth flavor and notes of chocolate and caramel.",
    price: 14.99,
    originalPrice: 18.99,
    discount: 21,
    rating: 4.9,
    reviewCount: 312,
    category: "home",
    images: [
      "assets/hard.jpg",
      "https://via.placeholder.com/500x500?text=Coffee+Beans+2",
    ],
    isNew: false,
    isFeatured: false,
    colors: [],
    sizes: ["12 oz", "2 lb"],
    stock: 143,
    sku: "GR-CB-008",
    details:
      "These premium organic coffee beans are sourced from high-altitude farms and roasted to perfection to bring out complex flavors. The medium-dark roast offers notes of chocolate, caramel, and a hint of cherry, with a smooth finish. Fair Trade certified, ensuring farmers receive fair compensation.",
    specs: [
      { name: "Origin", value: "Ethiopia, Colombia, Guatemala blend" },
      { name: "Roast Level", value: "Medium-dark" },
      { name: "Flavor Notes", value: "Chocolate, caramel, cherry" },
      { name: "Certifications", value: "USDA Organic, Fair Trade" },
      { name: "Grind", value: "Whole bean" },
      { name: "Roast Date", value: "Ships within 24 hours of roasting" },
      {
        name: "Best Brewing Methods",
        value: "Drip, French press, pour-over, espresso",
      },
    ],
  },
];

// Reviews data
// In a real application, this would be fetched from a server
const REVIEWS = [
  {
    id: 101,
    productId: 1,
    author: "Michael S.",
    date: "2023-05-15",
    rating: 5,
    text: "These headphones are incredible! The noise cancellation blocks out everything, and the sound quality is crystal clear. Battery life is as advertised - I've gone almost two weeks with moderate use before needing to recharge.",
  },
  {
    id: 102,
    productId: 1,
    author: "Samantha T.",
    date: "2023-05-02",
    rating: 4,
    text: "Great sound quality and comfortable to wear for long periods. The noise cancellation is very good, though not perfect. Battery life is excellent. My only complaint is that the ear cups get a bit warm after a few hours.",
  },
  {
    id: 103,
    productId: 1,
    author: "David L.",
    date: "2023-04-18",
    rating: 5,
    text: "Best headphones I've owned. The sound is balanced with great bass response, and they're lightweight enough to wear all day. The app gives you great control over the sound profile. Highly recommended!",
  },
  {
    id: 104,
    productId: 2,
    author: "Jennifer W.",
    date: "2023-05-14",
    rating: 5,
    text: "This fitness tracker has been a game changer for my workouts! The heart rate monitor is accurate, and I love being able to see my stats in real time. The sleep tracking feature has helped me improve my sleep habits too.",
  },
  {
    id: 105,
    productId: 2,
    author: "Robert K.",
    date: "2023-04-30",
    rating: 4,
    text: "Great fitness tracker with lots of features. The battery lasts about 5 days for me with regular use. The interface is intuitive and the app has a clean design. The only downside is that the screen can be hard to read in bright sunlight.",
  },
];

/**
 * Get all products
 * @returns {Array} Array of products
 */
function getAllProducts() {
  return PRODUCTS;
}

/**
 * Get products by category
 * @param {string} category - Category name
 * @returns {Array} Filtered products
 */
function getProductsByCategory(category) {
  return PRODUCTS.filter((product) => product.category === category);
}

/**
 * Get featured products
 * @returns {Array} Featured products
 */
function getFeaturedProducts() {
  return PRODUCTS.filter((product) => product.isFeatured);
}

/**
 * Get new products
 * @returns {Array} New products
 */
function getNewProducts() {
  return PRODUCTS.filter((product) => product.isNew);
}

/**
 * Get product by ID
 * @param {number} id - Product ID
 * @returns {Object|null} Product object or null
 */
function getProductById(id) {
  return PRODUCTS.find((product) => product.id === parseInt(id)) || null;
}

/**
 * Get related products based on category (excluding the current product)
 * @param {number} productId - Current product ID
 * @param {number} limit - Maximum number of products to return
 * @returns {Array} Related products
 */
function getRelatedProducts(productId, limit = 4) {
  const product = getProductById(productId);
  if (!product) return [];

  return PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== productId
  )
    .sort(() => 0.5 - Math.random())
    .slice(0, limit);
}

/**
 * Search products by name or description
 * @param {string} query - Search query
 * @returns {Array} Matching products
 */
function searchProducts(query) {
  if (!query) return [];

  const searchTerm = query.toLowerCase();
  return PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
  );
}

/**
 * Sort products by different criteria
 * @param {Array} products - Products to sort
 * @param {string} sortBy - Sort criteria ('price-low', 'price-high', 'newest', 'featured')
 * @returns {Array} Sorted products
 */
function sortProducts(products, sortBy) {
  const sorted = [...products];

  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
    case "newest":
      return sorted.sort((a, b) => b.isNew - a.isNew);
    case "featured":
    default:
      return sorted.sort((a, b) => b.isFeatured - a.isFeatured);
  }
}

/**
 * Get reviews for a product
 * @param {number} productId - Product ID
 * @returns {Array} Product reviews
 */
function getProductReviews(productId) {
  return REVIEWS.filter((review) => review.productId === parseInt(productId));
}

/**
 * Create a product card element
 * @param {Object} product - Product data
 * @returns {HTMLElement} Product card element
 */
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  // Format price and discount
  const formattedPrice = util.formatPrice(product.price);
  const formattedOriginalPrice = product.originalPrice
    ? util.formatPrice(product.originalPrice)
    : "";

  // Generate HTML for card
  card.innerHTML = `
    <div class="product-image">
      <img src="${product.images[0]}" alt="${product.name}">
      <div class="product-badges">
        ${product.isNew ? '<span class="badge badge-new">New</span>' : ""}
        ${
          product.discount > 0
            ? `<span class="badge badge-sale">-${product.discount}%</span>`
            : ""
        }
      </div>
      <div class="product-actions">
        <button class="action-btn add-to-wishlist" aria-label="Add to wishlist" data-product-id="${
          product.id
        }">
          <i class="far fa-heart"></i>
        </button>
        <button class="action-btn quick-view" aria-label="Quick view" data-product-id="${
          product.id
        }">
          <i class="far fa-eye"></i>
        </button>
      </div>
    </div>
    <div class="product-info">
      <div class="product-category">${product.category}</div>
      <h3 class="product-title"><a href="pages/product.html?id=${product.id}">${
    product.name
  }</a></h3>
      <div class="product-rating">
        <div class="stars">
          ${getStarRating(product.rating)}
        </div>
        <span>${product.rating} (${product.reviewCount})</span>
      </div>
      <div class="product-price">
        ${formattedPrice}
        ${
          formattedOriginalPrice
            ? `<span class="product-original-price">${formattedOriginalPrice}</span>`
            : ""
        }
      </div>
    </div>
    <div class="product-bottom">
      <button class="btn btn-primary add-to-cart-btn" data-product-id="${
        product.id
      }">Add to Cart</button>
    </div>
  `;

  // Add event listeners
  const addToCartBtn = card.querySelector(".add-to-cart-btn");
  addToCartBtn.addEventListener("click", function () {
    addToCart(product.id, 1);
  });

  const wishlistBtn = card.querySelector(".add-to-wishlist");
  wishlistBtn.addEventListener("click", function () {
    addToWishlist(product.id);
  });

  const quickViewBtn = card.querySelector(".quick-view");
  quickViewBtn.addEventListener("click", function () {
    showQuickView(product.id);
  });

  return card;
}

/**
 * Generate HTML for star rating
 * @param {number} rating - Product rating (0-5)
 * @returns {string} HTML for stars
 */
function getStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  let starsHTML = "";

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }

  // Add half star if needed
  if (halfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }

  return starsHTML;
}

/**
 * Add a product to the cart
 * @param {number} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @param {Object} [options] - Additional options (color, size)
 */
function addToCart(productId, quantity, options = {}) {
  console.log(quantity);
  const product = getProductById(productId);
  if (!product) return;

  // Get current cart from local storage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if product is already in cart
  const existingItemIndex = cart.findIndex(
    (item) =>
      item.id === productId &&
      item.color === (options.color || "") &&
      item.size === (options.size || "")
  );

  if (existingItemIndex !== -1) {
    // Update quantity if already in cart
    console.log({ existingItemIndex, value: cart[existingItemIndex].quantity });
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      color: options.color || "",
      size: options.size || "",
    });
  }

  // Save updated cart to local storage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update cart count in header
  updateCartCount();

  // Show notification
  notifications.success(`${product.name} added to cart!`);
}

/**
 * Add a product to the wishlist
 * @param {number} productId - Product ID
 */
function addToWishlist(productId) {
  const product = getProductById(productId);
  if (!product) return;

  // Get current wishlist from local storage
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Check if product is already in wishlist
  const isInWishlist = wishlist.some((item) => item.id === productId);

  if (!isInWishlist) {
    // Add to wishlist
    wishlist.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category,
    });

    // Save updated wishlist to local storage
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    notifications.success(`${product.name} added to wishlist!`);
  } else {
    notifications.info(`${product.name} is already in your wishlist!`);
  }
}

/**
 * Show quick view modal for a product
 * @param {number} productId - Product ID
 */
function showQuickView(productId) {
  const product = getProductById(productId);
  if (!product) return;

  // In a real application, this would open a modal with product details
  window.location.href = `pages/product.html?id=${productId}`;
}

/**
 * Update cart count in header
 */
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Update cart count elements
  const cartCountElements = document.querySelectorAll(".cart-count");
  cartCountElements.forEach((el) => {
    el.textContent = totalItems;
  });

  const mobileCartElements = document.querySelectorAll(".mobile-cart-count");
  mobileCartElements.forEach((el) => {
    el.textContent = totalItems;
  });
}

/**
 * Initialize product grid on homepage
 */
function initProductGrid() {
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) return;

  // Get featured products by default
  let products = getFeaturedProducts();

  // Check if there's a category parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  const search = urlParams.get("search");

  // If category parameter exists, filter by category
  if (category) {
    products = getProductsByCategory(category);
  } else if (search) {
    products = searchProducts(search);
  }

  // Get sort option if exists
  const sortSelect = document.getElementById("sort-options");
  let sortOption = "featured";

  if (sortSelect) {
    sortOption = sortSelect.value;

    // Sort products when sort option changes
    sortSelect.addEventListener("change", function () {
      const option = this.value;
      const sorted = sortProducts(products, option);
      renderProductGrid(sorted);
    });
  }

  // Sort and render products
  const sortedProducts = sortProducts(products, sortOption);
  renderProductGrid(sortedProducts);

  // Add event listeners for category links
  const categoryLinks = document.querySelectorAll("[data-category]");
  categoryLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const category = this.dataset.category;
      const categoryProducts = getProductsByCategory(category);
      renderProductGrid(categoryProducts);
    });
  });
}

/**
 * Render products in the product grid
 * @param {Array} products - Products to render
 */
function renderProductGrid(products) {
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) return;

  // Clear existing products
  productGrid.innerHTML = "";

  if (products.length === 0) {
    productGrid.innerHTML = '<div class="no-products">No products found</div>';
    return;
  }

  // Add each product to the grid
  products.forEach((product) => {
    const card = createProductCard(product);
    productGrid.appendChild(card);
  });
}

/**
 * Initialize product details page
 */
function initProductDetails() {
  // Check if we're on the product details page
  const productTitle = document.getElementById("product-title");
  if (!productTitle) return;

  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    window.location.href = "../index.html";
    return;
  }

  // Get product details
  const product = getProductById(parseInt(productId));
  if (!product) {
    window.location.href = "../index.html";
    return;
  }

  // Fill in product details
  document.title = `${product.name} - Shoply`;

  // Breadcrumb navigation
  document.getElementById("product-category").textContent =
    product.category.charAt(0).toUpperCase() + product.category.slice(1);
  document.getElementById("product-name").textContent = product.name;

  // Main product info
  productTitle.textContent = product.name;
  document.getElementById("product-rating").textContent = product.rating;
  document.getElementById(
    "review-count"
  ).textContent = `(${product.reviewCount} reviews)`;
  document.getElementById("product-sku").textContent = product.sku;
  document.getElementById("product-price").textContent = util.formatPrice(
    product.price
  );

  // If there's a discount, show original price
  if (product.originalPrice) {
    document.getElementById("product-original-price").textContent =
      util.formatPrice(product.originalPrice);
    document.getElementById(
      "discount-badge"
    ).textContent = `-${product.discount}%`;
  } else {
    document.getElementById("product-original-price").style.display = "none";
    document.getElementById("discount-badge").style.display = "none";
  }

  // Description
  document.getElementById("product-description").textContent =
    product.description;
  document.getElementById("full-description").textContent = product.details;

  // Main image
  document.getElementById("main-product-image").src = product.images[0];
  document.getElementById("main-product-image").alt = product.name;

  // Thumbnails
  const thumbnailsContainer = document.getElementById("product-thumbnails");
  thumbnailsContainer.innerHTML = "";

  product.images.forEach((image, index) => {
    const thumbnail = document.createElement("div");
    thumbnail.className = `thumbnail ${index === 0 ? "active" : ""}`;
    thumbnail.innerHTML = `<img src="${image}" alt="${product.name} ${
      index + 1
    }">`;

    thumbnail.addEventListener("click", function () {
      // Update main image
      document.getElementById("main-product-image").src = image;

      // Update active thumbnail
      document
        .querySelectorAll(".thumbnail")
        .forEach((thumb) => thumb.classList.remove("active"));
      thumbnail.classList.add("active");
    });

    thumbnailsContainer.appendChild(thumbnail);
  });

  // Color options
  const colorOptions = document.getElementById("color-options");
  if (product.colors && product.colors.length > 0) {
    const optionsContainer = colorOptions.querySelector(".option-buttons");
    optionsContainer.innerHTML = "";

    product.colors.forEach((color) => {
      const colorBtn = document.createElement("div");
      colorBtn.className = "color-option";
      colorBtn.dataset.color = color;
      colorBtn.style.backgroundColor = color.toLowerCase();
      colorBtn.title = color;

      colorBtn.addEventListener("click", function () {
        // Toggle active class
        document
          .querySelectorAll(".color-option")
          .forEach((opt) => opt.classList.remove("active"));
        this.classList.add("active");
      });

      optionsContainer.appendChild(colorBtn);
    });
  } else {
    colorOptions.style.display = "none";
  }

  // Size options
  const sizeOptions = document.getElementById("size-options");
  if (product.sizes && product.sizes.length > 0) {
    const optionsContainer = sizeOptions.querySelector(".option-buttons");
    optionsContainer.innerHTML = "";

    product.sizes.forEach((size) => {
      const sizeBtn = document.createElement("div");
      sizeBtn.className = "size-option";
      sizeBtn.dataset.size = size;
      sizeBtn.textContent = size;

      sizeBtn.addEventListener("click", function () {
        // Toggle active class
        document
          .querySelectorAll(".size-option")
          .forEach((opt) => opt.classList.remove("active"));
        this.classList.add("active");
      });

      optionsContainer.appendChild(sizeBtn);
    });
  } else {
    sizeOptions.style.display = "none";
  }

  // Specifications
  const specsBody = document.getElementById("specs-body");
  specsBody.innerHTML = "";

  product.specs.forEach((spec) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${spec.name}</td>
      <td>${spec.value}</td>
    `;
    specsBody.appendChild(row);
  });

  // Reviews
  const reviews = getProductReviews(parseInt(productId));
  const reviewsList = document.getElementById("reviews-list");

  if (reviews.length > 0) {
    reviewsList.innerHTML = "";

    reviews.forEach((review) => {
      const reviewElement = document.createElement("div");
      reviewElement.className = "review";
      reviewElement.innerHTML = `
        <div class="review-header">
          <span class="reviewer">${review.author}</span>
          <span class="review-date">${review.date}</span>
        </div>
        <div class="review-rating">
          <div class="stars">
            ${getStarRating(review.rating)}
          </div>
        </div>
        <p class="review-text">${review.text}</p>
      `;

      reviewsList.appendChild(reviewElement);
    });
  } else {
    reviewsList.innerHTML =
      "<p>No reviews yet. Be the first to leave a review!</p>";
  }

  // Update rating summary
  document.getElementById("average-rating").textContent = product.rating;
  document.querySelector(".overall-rating .stars").innerHTML = getStarRating(
    product.rating
  );
  document.getElementById("review-total").textContent = product.reviewCount;

  // Related products
  const relatedProducts = getRelatedProducts(parseInt(productId));
  const relatedContainer = document.getElementById("related-products");

  if (relatedProducts.length > 0) {
    relatedContainer.innerHTML = "";

    relatedProducts.forEach((relatedProduct) => {
      const card = createProductCard(relatedProduct);
      relatedContainer.appendChild(card);
    });
  } else {
    relatedContainer.innerHTML = "<p>No related products found.</p>";
  }

  // Add to cart functionality
  const addToCartBtn = document.getElementById("add-to-cart");
  const quantityInput = document.getElementById("quantity");

  addToCartBtn.addEventListener("click", function () {
    const quantity = parseInt(quantityInput.value);
    console.log({ quantityInput, quantity });
    console.log("hi");
    // Get selected options
    const selectedColor = document.querySelector(".color-option.active");
    const selectedSize = document.querySelector(".size-option.active");

    const options = {
      color: selectedColor ? selectedColor.dataset.color : "",
      size: selectedSize ? selectedSize.dataset.size : "",
    };

    addToCart(parseInt(productId), quantity, options);
  });

  // Add to wishlist functionality
  const wishlistBtn = document.getElementById("add-to-wishlist");

  wishlistBtn.addEventListener("click", function () {
    addToWishlist(parseInt(productId));
  });

  // Quantity selector
  setupQuantitySelectors();
}

/**
 * Setup quantity selectors
 */
function setupQuantitySelectors() {
  const decreaseBtn = document.getElementById("decrease-quantity");
  const increaseBtn = document.getElementById("increase-quantity");
  const quantityInput = document.getElementById("quantity");

  if (!decreaseBtn || !increaseBtn || !quantityInput) return;

  decreaseBtn.addEventListener("click", function () {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  increaseBtn.addEventListener("click", function () {
    const currentValue = parseInt(quantityInput.value);
    const max = parseInt(quantityInput.getAttribute("max") || 10);
    if (currentValue < max) {
      quantityInput.value = currentValue + 1;
    }
  });

  quantityInput.addEventListener("change", function () {
    const min = parseInt(this.getAttribute("min") || 1);
    const max = parseInt(this.getAttribute("max") || 10);
    let value = parseInt(this.value);

    if (isNaN(value) || value < min) {
      this.value = min;
    } else if (value > max) {
      this.value = max;
    }
  });
}

/**
 * Initialize recommended products on cart page
 */
function initRecommendedProducts() {
  const recommendedContainer = document.getElementById("recommended-products");
  if (!recommendedContainer) return;

  // Get random 4 products
  const products = getAllProducts()
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  recommendedContainer.innerHTML = "";

  products.forEach((product) => {
    const card = createProductCard(product);
    recommendedContainer.appendChild(card);
  });
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", function () {
  // Update cart count
  updateCartCount();

  // Initialize product grid on homepage
  initProductGrid();

  // Initialize product details if on product page
  initProductDetails();

  // Initialize recommended products on cart page
  initRecommendedProducts();

  // Setup tabs
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.dataset.tab;

      // Remove active class from all tabs
      tabButtons.forEach((btn) => btn.classList.remove("active"));

      // Set active tab
      this.classList.add("active");

      // Hide all tab content
      const tabContents = document.querySelectorAll(".tab-pane");
      tabContents.forEach((content) => content.classList.remove("active"));

      // Show selected tab content
      const selectedContent = document.getElementById(tabId);
      if (selectedContent) {
        selectedContent.classList.add("active");
      }
    });
  });
});

// Export functions for use in other scripts
window.productFunctions = {
  getAllProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getNewProducts,
  getProductById,
  getRelatedProducts,
  searchProducts,
  sortProducts,
  getProductReviews,
  createProductCard,
  addToCart,
  addToWishlist,
  updateCartCount,
};
