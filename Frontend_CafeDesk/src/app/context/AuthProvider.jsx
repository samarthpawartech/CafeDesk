"use client";

import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);

  // Load user and token from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // ===== Auth functions =====
  const login = async (username, password, role) => {
    const response = await fetch(`http://localhost:8080/api/${role}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ username, role }));

    setUser({ username, role });
    setToken(data.token);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    setCurrentOrder([]);
  };

  // ===== Order management =====
  const addToOrder = (item) => {
    setCurrentOrder((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromOrder = (item) => {
    setCurrentOrder((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i,
        );
      }
    });
  };

  const getTotalAmount = () =>
    currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const clearOrder = () => setCurrentOrder([]);

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
        getTotalAmount,
        clearOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
