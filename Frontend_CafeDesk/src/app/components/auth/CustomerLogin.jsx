// src/app/components/auth/CustomerLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Coffee, Eye, EyeOff } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";

export const CustomerLogin = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === "customer") navigate("/dashboard/customer");
  }, [user, navigate]);

  if (user && user?.role !== "customer") return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password.trim(), "customer");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#FFF8F0] rounded-3xl shadow-2xl p-8 border border-[#EAD7C3]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-[#C8A97E] rounded-2xl flex items-center justify-center mb-4">
              <Coffee className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#6F4E37]">
              Customer Login
            </h1>
          </div>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
              className="w-full h-12 bg-[#FDF6EC] border border-[#EAD7C3] rounded-xl px-4 focus:ring-2 focus:ring-[#C8A97E]"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full h-12 bg-[#FDF6EC] border border-[#EAD7C3] rounded-xl px-4 pr-12 focus:ring-2 focus:ring-[#C8A97E]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B08968]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#C8A97E] hover:bg-[#B08968] text-white font-semibold"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* 🔹 Register Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#6F4E37]">
              New here?{" "}
              <Link
                to="/register/customer"
                className="font-semibold text-[#C8A97E] hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
