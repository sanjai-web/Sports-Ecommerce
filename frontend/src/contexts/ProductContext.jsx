import React, { createContext, useState, useEffect } from 'react';
import { initialProducts } from '../utils/mockData';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  const _save = (updated) => {
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
  };

  const addProduct = (product) => {
    _save([...products, { ...product, hidden: false }]);
  };

  const editProduct = (updatedProduct) => {
    _save(products.map(p => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p));
  };

  const toggleHideProduct = (id) => {
    _save(products.map(p => p.id === id ? { ...p, hidden: !p.hidden } : p));
  };

  // Visible products for the storefront
  const visibleProducts = products.filter(p => !p.hidden);

  return (
    <ProductContext.Provider value={{ products, visibleProducts, addProduct, editProduct, toggleHideProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
