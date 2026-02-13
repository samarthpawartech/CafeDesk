import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // for Vite + React Router

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (username, password, role) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/login",
        {
          username: username,
          password: password,
        },
      );

      const token = response.data.token; // ✅ IMPORTANT

      // Save JWT
      localStorage.setItem("token", token);

      setUser({
        username,
        role,
      });

      alert("Login Successful ✅");

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid Username or Password ❌");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
