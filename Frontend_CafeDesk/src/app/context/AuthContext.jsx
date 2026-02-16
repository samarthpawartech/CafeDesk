import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);

  // Persist login & cart on page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedOrder = localStorage.getItem("currentOrder");
    if (storedOrder) setCurrentOrder(JSON.parse(storedOrder));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentOrder", JSON.stringify(currentOrder));
  }, [currentOrder]);

  // Login
  const login = async (username, password, role) => {
    try {
      let url = "";
      if (role === "admin") url = "http://localhost:8080/api/admin/login";
      else if (role === "employee")
        url = "http://localhost:8080/api/employee/login";
      else if (role === "customer")
        url = "http://localhost:8080/api/customer/login";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      const token = data.token;

      // Save JWT & user info
      localStorage.setItem("token", token);
      const userData = { username, role };
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);

      alert("Login Successful ✅");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid Username or Password ❌");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentOrder");
    setUser(null);
    setCurrentOrder([]);
  };

  // Cart functions
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

  const clearOrder = () => setCurrentOrder([]);

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
