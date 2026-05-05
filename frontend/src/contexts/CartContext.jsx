import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      let newCart;
      if (existingItem) {
        newCart = prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prev => {
      const newCart = prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const placeOrder = (orderDetails, userId) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      userId,
      date: new Date().toISOString(),
      items: [...cart],
      status: 'Pending',
      ...orderDetails
    };
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    clearCart();
    return newOrder;
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = item.price - (item.price * (item.discount || 0) / 100);
    return total + (price * item.quantity);
  }, 0);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => {
      const updatedOrders = prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      cartTotal, 
      placeOrder,
      orders,
      updateOrderStatus
    }}>
      {children}
    </CartContext.Provider>
  );
};
