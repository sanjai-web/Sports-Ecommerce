import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const login = (identifier, password) => {
    // identifier can be email or mobile
    const foundUser = users.find(u => 
      (u.email === identifier || u.mobile === identifier) && u.password === password
    );
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const signup = (userData) => {
    const emailExists = users.some(u => u.email === userData.email);
    const mobileExists = users.some(u => u.mobile === userData.mobile);
    
    if (emailExists || mobileExists) {
      return { success: false, message: 'User with this email or mobile already exists' };
    }

    // Add role, default to 'user', let's make first user admin for demo purposes
    const newUser = { 
      ...userData, 
      id: Date.now().toString(),
      role: users.length === 0 ? 'admin' : 'user'
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const updateUserRole = (userId, newRole) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // If the currently logged in user's role is updated, update currentUser too
    if (user && user.id === userId) {
      const updatedCurrentUser = { ...user, role: newRole };
      setUser(updatedCurrentUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, users, login, signup, logout, updateProfile, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};
