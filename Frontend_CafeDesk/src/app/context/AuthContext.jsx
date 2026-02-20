import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);

  // Restore only cart
  useEffect(() => {
    const storedOrder = localStorage.getItem("currentOrder");
    if (storedOrder) {
      setCurrentOrder(JSON.parse(storedOrder));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentOrder", JSON.stringify(currentOrder));
  }, [currentOrder]);

  const login = async (username, password, role) => {
    let url = "";

    if (role === "admin") {
      url = "http://localhost:8080/api/admin/login";
    } else if (role === "employee") {
      url = "http://localhost:8080/api/employee/login";
    } else if (role === "customer") {
      url = "http://localhost:8080/api/customer/login";
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(), // ✅ MUST match backend
          password: password.trim(), // ✅ MUST match backend
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.message || "Login failed");
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      const userData = {
        username: username,
        role: role,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCurrentOrder([]);
  };

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

export const useAuth = () => useContext(AuthContext);
