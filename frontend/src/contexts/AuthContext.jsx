import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = `${API_URL}/api/auth`;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Current logged in user
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users from backend (for admin)
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/users`);
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("fitgear-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchUsers();
    setLoading(false);
  }, []);

  // Signup
  const signup = async (userData) => {
    try {
      const response = await axios.post(`${API}/signup`, userData);
      if (response.data.success) {
        await fetchUsers(); // Refresh user list
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    }
  };

  // Login
  const login = async (identifier, password) => {
    try {
      const response = await axios.post(`${API}/login`, {
        identifier,
        password,
      });

      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem("fitgear-user", JSON.stringify(response.data.user));
        await fetchUsers(); // Refresh user list after login
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("fitgear-user");
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    if (!user) {
      return {
        success: false,
        message: "No user logged in",
      };
    }

    try {
      const response = await axios.put(`${API}/update-profile/${user.id}`, updatedData);

      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem("fitgear-user", JSON.stringify(response.data.user));
        await fetchUsers(); // Refresh user list
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Profile update failed",
      };
    }
  };

  // Update user role (admin only)
  const updateUserRole = async (userId, role) => {
    try {
      const response = await axios.put(`${API}/update-role/${userId}`, { role });
      if (response.data.success) {
        // Update local users state
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role } : u))
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error updating user role:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update role",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        loading,
        signup,
        login,
        logout,
        updateProfile,
        updateUserRole,
        refreshUsers: fetchUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;