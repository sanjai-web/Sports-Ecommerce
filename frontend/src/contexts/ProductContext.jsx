import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Use import.meta.env for Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/products`);
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const addProduct = async (product) => {
    try {
      const response = await axios.post(`${API_URL}/api/products`, product);
      if (response.data.success) {
        setProducts(prev => [response.data.product, ...prev]);
        return response.data.product;
      }
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  };

  // Edit product
  const editProduct = async (updatedProduct) => {
    try {
      const response = await axios.put(`${API_URL}/api/products/${updatedProduct._id}`, updatedProduct);
      if (response.data.success) {
        setProducts(prev => prev.map(p => 
          p._id === updatedProduct._id ? response.data.product : p
        ));
        return response.data.product;
      }
    } catch (err) {
      console.error('Error editing product:', err);
      throw err;
    }
  };

  // Toggle hide product
  const toggleHideProduct = async (productId) => {
    try {
      const product = products.find(p => p._id === productId);
      const response = await axios.put(`${API_URL}/api/products/${productId}`, {
        ...product,
        hidden: !product.hidden
      });
      if (response.data.success) {
        setProducts(prev => prev.map(p => 
          p._id === productId ? { ...p, hidden: !p.hidden } : p
        ));
        return response.data.product;
      }
    } catch (err) {
      console.error('Error toggling product visibility:', err);
      throw err;
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/products/${productId}`);
      if (response.data.success) {
        setProducts(prev => prev.filter(p => p._id !== productId));
        return true;
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  const visibleProducts = products.filter(p => !p.hidden);

  return (
    <ProductContext.Provider value={{
      products,
      visibleProducts,
      loading,
      error,
      addProduct,
      editProduct,
      toggleHideProduct,
      deleteProduct,
      refreshProducts: fetchProducts,
    }}>
      {children}
    </ProductContext.Provider>
  );
};