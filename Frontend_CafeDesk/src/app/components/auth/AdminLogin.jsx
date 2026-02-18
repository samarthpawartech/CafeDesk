// src/app/components/auth/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Shield, User, Lock } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";

export const AdminLogin = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === "admin") navigate("/dashboard/admin");
  }, [user, navigate]);

  if (user && user?.role !== "admin") return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password.trim(), "admin");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6F4E37] via-[#4B2E21] to-[#2E1A12] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#8B5A2B]/80 rounded-2xl mb-4 shadow-xl">
            <Shield className="w-12 h-12 text-[#FFF4E6]" />
          </div>
          <h1 className="text-3xl font-bold text-[#FFF4E6] mb-1">CafeDesk</h1>
          <p className="text-[#EAD7C3]">Admin Portal</p>
        </div>

        <div className="bg-[#3A2418]/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#EAD7C3]/30">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Admin Username"
                className="w-full h-12 bg-[#2E1A12]/40 border border-[#EAD7C3]/40 rounded-xl px-4"
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#EAD7C3]" />
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full h-12 bg-[#2E1A12]/40 border border-[#EAD7C3]/40 rounded-xl px-4"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#EAD7C3]" />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#D4A373] to-[#B08968] text-[#2E1A12] font-semibold"
            >
              {loading ? "Signing In..." : "Access Dashboard"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
