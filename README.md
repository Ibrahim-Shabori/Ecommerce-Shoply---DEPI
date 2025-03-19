# Shoply - Modern eCommerce Frontend

Shoply is a responsive, modern eCommerce frontend built with pure HTML, CSS, and vanilla JavaScript. It features a clean design, comprehensive functionality, and is ready for future backend integration.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add, remove, and manage cart items
- **User Authentication**: Register, login, and account management
- **Admin Dashboard**: Manage products, users, and orders (for admin users)
- **Wishlist**: Save products for later
- **Order Management**: Track and manage orders

## Project Structure

```
shoply/
├── assets/            # Images and SVG files
│   └── logo.svg
├── css/               # CSS stylesheets
│   ├── admin.css      # Admin dashboard styles
│   ├── responsive.css # Responsive design styles
│   └── style.css      # Main stylesheet
├── js/                # JavaScript files
│   ├── admin.js       # Admin dashboard functionality
│   ├── app.js         # Core application utilities
│   ├── auth.js        # Authentication handling
│   ├── cart.js        # Shopping cart functionality
│   └── products.js    # Product management
├── pages/             # HTML pages
│   ├── admin/
│   │   └── index.html # Admin dashboard
│   ├── account.html   # User account page
│   ├── cart.html      # Shopping cart page
│   ├── login.html     # Login page
│   ├── product.html   # Product detail page
│   └── register.html  # Registration page
└── index.html         # Homepage
```

## Getting Started

1. Clone the repository or download the zip file
2. Start a local server:
   ```
   python -m http.server 5000
   ```
   or use any HTTP server of your choice
3. Open your browser and navigate to `http://localhost:5000`

## Browser Compatibility

Shoply is compatible with all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Integration

This frontend is designed to be easily integrated with any backend technology. The JavaScript code is structured to make API integration straightforward. The recommended backend technologies are:

- .NET Core Web API
- Node.js with Express
- Any RESTful API service

## Authentication System

The first registered user automatically becomes an admin. Admin privileges include:

- User management
- Product management
- Order management
- Site settings

## Local Storage

The current version uses localStorage for data persistence:

- User accounts
- Product catalog
- Shopping cart
- Order history

This will be replaced with API calls when integrating with a backend.

## Performance Optimization

- Minified CSS and JS files for production use
- Optimized images and SVG graphics
- Efficient DOM manipulation
- Throttled and debounced event handlers

## Responsive Design Breakpoints

- Mobile: up to 767px
- Tablet: 768px to 991px
- Desktop: 992px and above

## Development Notes

- Pure vanilla JavaScript without frameworks
- CSS custom properties for theming
- Modular JavaScript with clear separation of concerns
- Semantic HTML structure

## License

MIT License