// src/app/components/auth/CustomerLogin.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // ✅ fixed relative path
import { Coffee, User, Lock } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { CustomerRegistrationForm } from "./Customerregistationform";

export const CustomerLogin = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showRegistrationLanding, setShowRegistrationLanding] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username.trim(), password.trim(), "customer");
    } catch (err) {
      setError("Invalid username or password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (showRegistrationLanding) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FFFDF9] via-[#F7EFE5] to-[#EADFCC] p-4">
        <div className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#EADFCC]/70">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#C8A97E]/90 rounded-2xl mb-4 shadow-xl">
              <Coffee className="w-12 h-12 text-[#FFFDF9]" />
            </div>
            <h1 className="text-3xl font-bold text-[#3A2418] mb-1">CafeDesk</h1>
            <p className="text-[#8B6F47] text-sm">Customer Registration</p>
          </div>
          <CustomerRegistrationForm />
          <div className="text-center mt-4">
            <button
              onClick={() => setShowRegistrationLanding(false)}
              className="text-xs underline text-[#6B4423]/70 hover:text-[#3A2418]"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#F7EFE5] to-[#EADFCC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#C8A97E]/90 rounded-2xl mb-4 shadow-xl">
            <Coffee className="w-12 h-12 text-[#FFFDF9]" />
          </div>
          <h1 className="text-3xl font-bold text-[#3A2418] mb-1">CafeDesk</h1>
          <p className="text-[#8B6F47]">Customer Portal</p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#EADFCC]/70">
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
                className="w-full h-12 bg-[#FFFDF9]/80 border border-[#DCC7AA]/60 rounded-xl px-4"
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]" />
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full h-12 bg-[#FFFDF9]/80 border border-[#DCC7AA]/60 rounded-xl px-4"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]" />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#C8A97E] to-[#B08968] text-[#3A2418] font-semibold"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>

        <div className="mt-6 bg-white/50 backdrop-blur-md rounded-lg p-4 border border-[#EADFCC]/60">
          <p className="text-xs text-[#6B4423] text-center">
            New here?{" "}
            <button
              onClick={() => setShowRegistrationLanding(true)}
              className="underline font-medium hover:text-[#3A2418]"
            >
              Register as Customer
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
