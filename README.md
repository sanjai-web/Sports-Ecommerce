# Sports Ecommerce Platform

A modern, responsive e-commerce web application dedicated to sports and fitness gear. The project features a comprehensive frontend built with React, Vite, and custom CSS, designed with a cohesive, energetic "light blue" theme.

## Features

- **User Authentication:** Login and Signup pages with simulated authentication context.
- **Product Catalog:** Browse a wide range of sports products, view details, and filter/sort.
- **Shopping Cart:** Add products to cart, manage quantities, and review the total.
- **Checkout Process:** A seamless checkout flow for finalizing purchases.
- **Dashboards:**
  - **User Dashboard:** View order history, manage profile, and track current shipments.
  - **Admin Dashboard:** Manage products, view platform statistics, and handle orders.
- **Modern UI:** Clean, polished, and responsive design with an energetic aesthetic.

## Tech Stack

- **Frontend Framework:** React (with Vite for fast development and building)
- **State Management:** React Context API (`AuthContext`, `CartContext`, `ProductContext`)
- **Routing:** React Router (assumed via `App.jsx`)
- **Styling:** Custom CSS (`index.css`) emphasizing a modern, "light blue" theme.

## Project Structure

```text
Sports Ecommerse/
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images, icons, etc.
│   │   ├── components/     # Reusable UI components (Navbar, Footer, ProductCard, etc.)
│   │   ├── contexts/       # React Context providers for global state
│   │   ├── pages/          # Application pages (Landing, Products, Dashboards, Cart, etc.)
│   │   ├── utils/          # Utility functions and mock data
│   │   ├── App.jsx         # Main application component and routing
│   │   ├── index.css       # Global styles and theme definitions
│   │   └── main.jsx        # Application entry point
│   ├── package.json        # Project dependencies and scripts
│   └── vite.config.js      # Vite configuration
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sanjai-web/Sports-Ecommerce.git
   ```
2. Navigate to the frontend directory:
   ```bash
   cd "Sports Ecommerse/frontend"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will typically be available at `http://localhost:5173`.

### Building for Production

To create a production build:

```bash
npm run build
```

## Current Status

The current phase focuses on the frontend implementation, UI/UX overhaul, and establishing the core layout, routing, and context management using mock data.
