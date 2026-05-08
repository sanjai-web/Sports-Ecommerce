import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API = "http://localhost:5000/api/auth";

const AuthProvider = ({ children }) => {
  // ================= CURRENT USER =================

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("fitgear-user")) || null
  );

  // ================= ALL USERS =================

  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("fitgear-users")) || []
  );

  // ================= SAVE USERS =================

  useEffect(() => {
    localStorage.setItem(
      "fitgear-users",
      JSON.stringify(users)
    );
  }, [users]);

  // ================= SIGNUP =================

  const signup = async (userData) => {
    try {
      const response = await axios.post(
        `${API}/signup`,
        userData
      );

      if (response.data.success) {
        const newUser = {
          id: Date.now().toString(),
          ...userData,
          role: users.length === 0 ? "admin" : "user",
        };

        setUsers((prev) => [...prev, newUser]);
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Signup failed",
      };
    }
  };

  // ================= LOGIN =================

  const login = async (identifier, password) => {
    try {
      const response = await axios.post(`${API}/login`, {
        identifier,
        password,
      });

      if (response.data.success) {
        setUser(response.data.user);

        localStorage.setItem(
          "fitgear-user",
          JSON.stringify(response.data.user)
        );
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed",
      };
    }
  };

  // ================= LOGOUT =================

  const logout = () => {
    setUser(null);

    localStorage.removeItem("fitgear-user");
  };


  
  // ================= UPDATE PROFILE =================

  const updateProfile = async (updatedData) => {
    try {
      const response = await axios.put(
        `${API}/update-profile/${user.id}`,
        updatedData
      );

      if (response.data.success) {
        setUser(response.data.user);

        localStorage.setItem(
          "fitgear-user",
          JSON.stringify(response.data.user)
        );
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Profile update failed",
      };
    }
  };

  

  // ================= UPDATE USER ROLE =================

  const updateUserRole = (userId, role) => {
    const updatedUsers = users.map((u) =>
      u.id === userId
        ? {
            ...u,
            role,
          }
        : u
    );

    setUsers(updatedUsers);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        signup,
        login,
        logout,
        updateProfile,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;  




