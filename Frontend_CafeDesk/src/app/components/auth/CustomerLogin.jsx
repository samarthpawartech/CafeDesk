import { useState } from "react";
import { Coffee, User, Lock } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/app/components/ui/button";

export const CustomerLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password, "customer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#F7EFE5] to-[#EADFCC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#C8A97E]/90 backdrop-blur-md rounded-2xl mb-4 shadow-xl">
            <Coffee className="w-12 h-12 text-[#FFFDF9]" />
          </div>
          <h1 className="text-3xl font-bold text-[#3A2418] mb-1">CafeDesk</h1>
          <p className="text-[#8B6F47]">Customer Portal</p>
          <p className="text-xs text-[#8B6F47]/70 mt-1">by Samarth Pawar</p>
        </div>

        {/* Glass Card with Pulsing Glow */}
        <div
          className="relative bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#EADFCC]/70 animate-slide-up
                        before:absolute before:-inset-1 before:rounded-2xl before:bg-gradient-to-r before:from-[#C8A97E]/50 before:via-[#DCC7AA]/40 before:to-[#B08968]/50 before:blur-2xl before:opacity-60 before:animate-pulse-glow before:z-0"
        >
          <div className="relative z-10 flex items-center justify-center gap-2 mb-8 text-[#3A2418]">
            <Coffee className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Welcome Back</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Username */}
            <div className="relative">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
                className="peer w-full h-12 bg-[#FFFDF9]/80 border border-[#DCC7AA]/60 rounded-xl px-4 pt-4 text-[#3A2418] placeholder-transparent focus:outline-none focus:border-[#C8A97E]"
              />

              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]" />

              <label
                htmlFor="username"
                className="absolute left-4 top-3 text-[#8B6F47] text-sm transition-all
                peer-placeholder-shown:top-3.5
                peer-placeholder-shown:text-base
                peer-placeholder-shown:text-[#8B6F47]/70
                peer-focus:top-1
                peer-focus:text-xs
                peer-focus:text-[#6B4423]"
              >
                Username
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="peer w-full h-12 bg-[#FFFDF9]/80 border border-[#DCC7AA]/60 rounded-xl px-4 pt-4 text-[#3A2418] placeholder-transparent focus:outline-none focus:border-[#C8A97E]"
              />

              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]" />

              <label
                htmlFor="password"
                className="absolute left-4 top-3 text-[#8B6F47] text-sm transition-all
                peer-placeholder-shown:top-3.5
                peer-placeholder-shown:text-base
                peer-placeholder-shown:text-[#8B6F47]/70
                peer-focus:top-1
                peer-focus:text-xs
                peer-focus:text-[#6B4423]"
              >
                Password
              </label>
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#C8A97E] to-[#B08968] hover:from-[#B08968] hover:to-[#8B6F47] text-[#3A2418] font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02]"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8B6F47]/80 relative z-10">
            Demo: Use any username/password
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 bg-white/50 backdrop-blur-md rounded-lg p-4 border border-[#EADFCC]/60 animate-fade-in">
          <p className="text-xs text-[#6B4423] text-center">
            New here?{" "}
            <a href="#" className="underline font-medium hover:text-[#3A2418]">
              Register as Customer
            </a>
          </p>
        </div>
      </div>

      {/* Tailwind Custom Animation */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
