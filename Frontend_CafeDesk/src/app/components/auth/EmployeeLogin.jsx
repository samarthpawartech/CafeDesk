// src/app/components/auth/EmployeeLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { User, Lock, Briefcase } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";

export const EmployeeLogin = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === "employee") navigate("/dashboard/employee");
  }, [user, navigate]);

  if (user && user?.role !== "employee") return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password.trim(), "employee");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F6F52] via-[#3B5D42] to-[#243D2B] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#A7C4A0]/80 rounded-2xl mb-4 shadow-xl">
            <Briefcase className="w-12 h-12 text-[#243D2B]" />
          </div>
          <h1 className="text-3xl font-bold text-[#F4F8F3] mb-1">CafeDesk</h1>
          <p className="text-[#DDE7D9]">Employee Portal</p>
        </div>

        <div className="bg-[#2E4A36]/45 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#DDE7D9]/30">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Employee ID"
                className="w-full h-12 bg-[#243D2B]/50 border border-[#DDE7D9]/40 rounded-xl px-4"
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#DDE7D9]" />
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full h-12 bg-[#243D2B]/50 border border-[#DDE7D9]/40 rounded-xl px-4"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#DDE7D9]" />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#A7C4A0] to-[#8FB996] text-[#243D2B] font-semibold"
            >
              {loading ? "Signing In..." : "Clock In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
