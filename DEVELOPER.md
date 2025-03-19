# Shoply Developer Documentation

This document provides technical details for developers working on the Shoply eCommerce frontend.

## Core Architecture

Shoply uses a modular JavaScript architecture with distinct responsibilities:

- **app.js**: Core utilities and helper functions
- **products.js**: Product catalog management
- **cart.js**: Shopping cart functionality
- **auth.js**: Authentication and user management
- **admin.js**: Admin dashboard features

## Local Storage Schema

The application uses the following localStorage keys:

- `shoply_users`: Array of user objects
- `shoply_products`: Array of product objects
- `shoply_cart`: Array of cart items
- `shoply_orders`: Array of order objects
- `shoply_current_user`: Current logged-in user
- `shoply_settings`: Application settings

## User Object Structure

```javascript
{
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "hashedPassword", // In a real app, this would be properly hashed
  isAdmin: false,
  addresses: {
    billing: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
      country: "USA"
    },
    shipping: {
      // Same structure as billing
    }
  },
  wishlist: [1, 2, 3], // Product IDs
  orders: ["order1", "order2"], // Order IDs
  createdAt: "2023-01-01T12:00:00Z"
}
```

## Product Object Structure

```javascript
{
  id: 1,
  name: "Product Name",
  description: "Product description...",
  price: 99.99,
  salePrice: 79.99, // Optional
  images: ["image1.jpg", "image2.jpg"],
  category: "Category Name",
  tags: ["tag1", "tag2"],
  stock: 10,
  featured: true,
  rating: 4.5,
  reviewCount: 25,
  options: {
    colors: ["Red", "Blue", "Green"],
    sizes: ["S", "M", "L"]
  },
  createdAt: "2023-01-01T12:00:00Z"
}
```

## Order Object Structure

```javascript
{
  id: "order123",
  userId: "user@example.com",
  items: [
    {
      productId: 1,
      quantity: 2,
      price: 99.99,
      options: {
        color: "Red",
        size: "M"
      }
    }
  ],
  total: 199.98,
  shipping: 9.99,
  tax: 19.99,
  grandTotal: 229.96,
  status: "processing", // "pending", "processing", "shipped", "delivered", "cancelled"
  shippingAddress: {
    // Address object
  },
  billingAddress: {
    // Address object
  },
  paymentMethod: "credit_card",
  createdAt: "2023-01-01T12:00:00Z"
}
```

## API Integration Guidelines

When integrating with a backend API, replace the localStorage operations with API calls in the following functions:

### Authentication

- `User.login()`: Replace with API login endpoint
- `User.register()`: Replace with API registration endpoint
- `User.logout()`: Replace with API logout endpoint
- `User.updateProfile()`: Replace with API profile update endpoint

### Products

- `getAllProducts()`: Replace with API GET products endpoint
- `getProductById()`: Replace with API GET product/:id endpoint
- `getProductsByCategory()`: Replace with API GET products?category=X endpoint

### Cart and Orders

- `addToCart()`: Replace with API POST cart endpoint
- `removeFromCart()`: Replace with API DELETE cart/:id endpoint
- `createOrder()`: Replace with API POST orders endpoint
- `getOrders()`: Replace with API GET orders endpoint

## CSS Structure

The CSS follows a modular approach:

- **style.css**: Base styles, typography, colors, grid system
- **responsive.css**: Media queries and responsive adjustments
- **admin.css**: Admin dashboard specific styles

### CSS Variables

The theme uses CSS variables for consistent styling:

```css
:root {
  /* Colors */
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --accent-color: #e74c3c;
  /* Typography */
  --font-family: 'Open Sans', sans-serif;
  --font-size-base: 16px;
  /* Spacing */
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  /* Borders */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
}
```

## Performance Considerations

- All event listeners use delegation where possible
- Image lazy loading is implemented for product grids
- Throttling is applied to scroll and resize events
- Debouncing is used for search input

## Security Considerations

For production deployment:

- Use proper password hashing (bcrypt/Argon2)
- Implement CSRF protection
- Set appropriate HTTP security headers
- Enable HTTPS
- Sanitize all user inputs
- Validate data on both client and server

## Testing Guidelines

For testing and quality assurance:

1. Test all responsive breakpoints
2. Verify all forms validation
3. Check error handling for all operations
4. Test cart calculations
5. Verify checkout flow
6. Test user registration and login
7. Verify admin permissions and functionality

## Build Process (Future Implementation)

For production builds:

1. Minify CSS and JavaScript
2. Optimize images
3. Generate sourcemaps
4. Bundle assets
5. Set up content delivery network (CDN)

## Extending the Project

Guidelines for adding new features:

1. Follow the existing module pattern
2. Maintain separation of concerns
3. Comment all public functions with JSDoc
4. Update documentation for significant changes
5. Test across all supported browsers and devices