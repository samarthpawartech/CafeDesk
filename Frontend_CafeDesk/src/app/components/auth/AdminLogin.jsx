import { useState } from "react";
import { User, Lock, Shield } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/app/components/ui/button";

export const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password, "admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6F4E37] via-[#4B2E21] to-[#2E1A12] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#8B5A2B]/80 backdrop-blur-md rounded-2xl mb-4 shadow-xl">
            <Shield className="w-12 h-12 text-[#FFF4E6]" />
          </div>
          <h1 className="text-3xl font-bold text-[#FFF4E6] mb-1">CafeDesk</h1>
          <p className="text-[#EAD7C3]">Admin Portal</p>
          <p className="text-xs text-[#EAD7C3]/70 mt-1">by Samarth Pawar</p>
        </div>

        {/* Glass Card with Pulsing Glow */}
        <div
          className="relative bg-[#3A2418]/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#EAD7C3]/30 animate-slide-up
                        before:absolute before:-inset-1 before:rounded-2xl before:bg-gradient-to-r before:from-[#FFD7A8]/70 before:via-[#D4A373]/50 before:to-[#B08968]/70 before:blur-2xl before:opacity-60 before:animate-pulse-glow before:z-0"
        >
          <div className="relative z-10 flex items-center justify-center gap-2 mb-8 text-[#FFF4E6]">
            <Shield className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Administrator Access</h2>
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
                placeholder="Admin Username"
                className="peer w-full h-12 bg-[#2E1A12]/40 border border-[#EAD7C3]/40 rounded-xl px-4 pt-4 text-[#FFF4E6] placeholder-transparent focus:outline-none focus:border-[#D4A373]"
              />

              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#EAD7C3]" />

              <label
                htmlFor="username"
                className="absolute left-4 top-3 text-[#EAD7C3] text-sm transition-all
                peer-placeholder-shown:top-3.5
                peer-placeholder-shown:text-base
                peer-placeholder-shown:text-[#EAD7C3]/70
                peer-focus:top-1
                peer-focus:text-xs
                peer-focus:text-[#FFD7A8]"
              >
                Admin Username
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
                placeholder="Admin Password"
                className="peer w-full h-12 bg-[#2E1A12]/40 border border-[#EAD7C3]/40 rounded-xl px-4 pt-4 text-[#FFF4E6] placeholder-transparent focus:outline-none focus:border-[#D4A373]"
              />

              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#EAD7C3]" />

              <label
                htmlFor="password"
                className="absolute left-4 top-3 text-[#EAD7C3] text-sm transition-all
                peer-placeholder-shown:top-3.5
                peer-placeholder-shown:text-base
                peer-placeholder-shown:text-[#EAD7C3]/70
                peer-focus:top-1
                peer-focus:text-xs
                peer-focus:text-[#FFD7A8]"
              >
                Admin Password
              </label>
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#D4A373] to-[#B08968] hover:from-[#B08968] hover:to-[#8B5A2B] text-[#2E1A12] font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02]"
            >
              Access Dashboard
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#EAD7C3]/80 relative z-10">
            Demo: Use any username/password
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-[#4B2E21]/50 backdrop-blur-md rounded-lg p-4 border border-[#EAD7C3]/30 animate-fade-in">
          <p className="text-xs text-[#FFF4E6] text-center">
            <Shield className="w-3 h-3 inline mr-1" />
            Secure Admin Access – All actions are logged
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
