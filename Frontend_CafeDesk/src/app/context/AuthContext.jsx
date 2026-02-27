"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);

  /* ---------------- RESTORE CART ONLY ---------------- */
  useEffect(() => {
    const storedOrder = localStorage.getItem("currentOrder");
    if (storedOrder) {
      try {
        setCurrentOrder(JSON.parse(storedOrder));
      } catch {
        setCurrentOrder([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentOrder", JSON.stringify(currentOrder));
  }, [currentOrder]);

  /* ---------------- LOGIN (FIXED) ---------------- */
  const login = async (username, password, role) => {
    let url = "";

    if (role === "admin") {
      url = "http://localhost:8080/api/admin/login";
    } else if (role === "employee") {
      url = "http://localhost:8080/api/employee/login";
    } else if (role === "customer") {
      url = "http://localhost:8080/api/customer/login";
    } else {
      throw new Error("Invalid role");
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      // ✅ READ RAW RESPONSE FIRST
      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        // Backend returned plain text (500, HTML, etc.)
        throw new Error(text || "Server error");
      }

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.token) {
        throw new Error("Token missing in response");
      }

      // ✅ Save JWT token
      localStorage.setItem("token", data.token);

      const userData = {
        username,
        role,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return true;
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentOrder");
    setUser(null);
    setCurrentOrder([]);
  };

  /* ---------------- ORDER HELPERS ---------------- */
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

  const updateQuantity = (id, quantity) => {
    setCurrentOrder((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromOrder = (id) => {
    setCurrentOrder((prev) => prev.filter((item) => item.id !== id));
  };

  const clearOrder = () => {
    setCurrentOrder([]);
  };

  const getTotalAmount = () =>
    currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        currentOrder,
        addToOrder,
        updateQuantity,
        removeFromOrder,
        clearOrder,
        getTotalAmount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ✅ NAMED EXPORT (IMPORTANT) */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
