import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Load orders from localStorage (in a real app, fetch from API)
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: Date.now().toString(),
      ...orderDetails,
      items: cart,
      date: new Date().toISOString(),
      status: "Pending",
      totalAmount: cart.reduce(
        (sum, item) =>
          sum +
          (item.product.price -
            (item.product.price * (item.product.discount || 0)) / 100) *
            item.quantity,
        0,
      ),
    };

    setOrders((prev) => [newOrder, ...prev]);
    localStorage.setItem("orders", JSON.stringify([newOrder, ...orders]));
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );
    localStorage.setItem(
      "orders",
      JSON.stringify(
        orders.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      ),
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
