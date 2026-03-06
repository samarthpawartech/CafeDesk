"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= LOAD SESSION =================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser?.username && parsedUser?.role) {
          setUser(parsedUser);
          setToken(storedToken);
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
    } catch (error) {
      console.error("LocalStorage error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= LOGIN =================
  const login = async (username, password, role) => {
    try {
      const response = await fetch(`http://localhost:8080/api/${role}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const userData = {
        username,
        role,
      };

      // Save session
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setToken(data.token);

      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);
    setCurrentOrder([]);

    // Redirect to home page
    navigate("/", { replace: true });
  };

  // ================= ORDER FUNCTIONS =================

  const addToOrder = (item) => {
    setCurrentOrder((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromOrder = (item) => {
    setCurrentOrder((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (!existing) return prev;

      if (existing.quantity === 1) {
        return prev.filter((i) => i.id !== item.id);
      }

      return prev.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  };

  const clearOrder = () => {
    setCurrentOrder([]);
  };

  const getTotalAmount = () => {
    return currentOrder.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  };

  // Prevent UI loading before session check
  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        currentOrder,
        addToOrder,
        removeFromOrder,
        clearOrder,
        getTotalAmount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
