// src/app/components/auth/CustomerLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Coffee, User, Lock } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";

export const CustomerLogin = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
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
      console.log("Login successfully"); // ✅ Console log
      // Redirect handled by useEffect
    } catch (err) {
      setError("Invalid username or password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "peer w-full bg-white/80 border border-[#DCC7AA]/60 rounded-xl px-4 pt-5 pb-2 text-[#3A2418] placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#C8A97E] transition-all duration-300";

  const labelClasses =
    "absolute left-4 top-2 text-[#8B6F47] text-sm transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#A99F87] peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#C8A97E]";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFFDF9] via-[#F7EFE5] to-[#EADFCC] animate-fade-in">
      <div className="w-full max-w-md sm:max-w-lg mx-auto">
        {/* Card */}
        <div className="bg-gradient-to-br from-[#FFFDF9]/90 to-[#F7EFE5]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#EADFCC]/60 p-8 sm:p-10 animate-slide-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 bg-[#C8A97E]/90 rounded-3xl mb-5 shadow-xl animate-bounce-slow">
              <Coffee className="w-14 h-14 sm:w-16 sm:h-16 text-[#FFFDF9]" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#3A2418] mb-1">
              CafeDesk
            </h1>
            <p className="text-[#8B6F47] text-base sm:text-lg">
              Customer Portal
            </p>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="relative group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
                className={inputClasses}
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47] group-focus-within:text-[#C8A97E] transition-colors duration-300" />
              <label className={labelClasses}>Username</label>
            </div>

            {/* Password */}
            <div className="relative group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className={inputClasses}
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47] group-focus-within:text-[#C8A97E] transition-colors duration-300" />
              <label className={labelClasses}>Password</label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 sm:h-16 rounded-xl bg-gradient-to-r from-[#C8A97E] to-[#B08968] text-[#3A2418] font-semibold tracking-wide transition-all duration-300 transform hover:scale-105"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm sm:text-base text-[#6B4423]">
              New to CafeDesk?{" "}
              <button
                onClick={() => navigate("/register")}
                className="underline font-medium hover:text-[#3A2418] transition-colors duration-300"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
