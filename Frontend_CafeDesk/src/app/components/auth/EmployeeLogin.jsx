import { useState } from "react";
import { User, Lock, Briefcase } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/app/components/ui/button";

export const EmployeeLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password, "employee");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F6F52] via-[#3B5D42] to-[#243D2B] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#A7C4A0]/80 backdrop-blur-md rounded-2xl mb-4 shadow-xl">
            <Briefcase className="w-12 h-12 text-[#243D2B]" />
          </div>
          <h1 className="text-3xl font-bold text-[#F4F8F3] mb-1">CafeDesk</h1>
          <p className="text-[#DDE7D9]">Employee Portal</p>
          <p className="text-xs text-[#DDE7D9]/70 mt-1">by Samarth Pawar</p>
        </div>

        {/* Glass Card with Pulsing Glow */}
        <div
          className="relative bg-[#2E4A36]/45 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#DDE7D9]/30 animate-slide-up
                        before:absolute before:-inset-1 before:rounded-2xl before:bg-gradient-to-r before:from-[#A7C4A0]/50 before:via-[#8FB996]/40 before:to-[#6E9C7D]/50 before:blur-2xl before:opacity-60 before:animate-pulse-glow before:z-0"
        >
          <div className="relative z-10 flex items-center justify-center gap-2 mb-8 text-[#F4F8F3]">
            <Briefcase className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Staff Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Employee ID */}
            <div className="relative">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Employee ID"
                className="peer w-full h-12 bg-[#243D2B]/50 border border-[#DDE7D9]/40 rounded-xl px-4 pt-4 text-[#F4F8F3] placeholder-transparent focus:outline-none focus:border-[#A7C4A0]"
              />

              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#DDE7D9]" />

              <label
                htmlFor="username"
                className="absolute left-4 top-3 text-[#DDE7D9] text-sm transition-all
                peer-placeholder-shown:top-3.5
                peer-placeholder-shown:text-base
                peer-placeholder-shown:text-[#DDE7D9]/70
                peer-focus:top-1
                peer-focus:text-xs
                peer-focus:text-[#CFE3C9]"
              >
                Employee ID
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
                className="peer w-full h-12 bg-[#243D2B]/50 border border-[#DDE7D9]/40 rounded-xl px-4 pt-4 text-[#F4F8F3] placeholder-transparent focus:outline-none focus:border-[#A7C4A0]"
              />

              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#DDE7D9]" />

              <label
                htmlFor="password"
                className="absolute left-4 top-3 text-[#DDE7D9] text-sm transition-all
                peer-placeholder-shown:top-3.5
                peer-placeholder-shown:text-base
                peer-placeholder-shown:text-[#DDE7D9]/70
                peer-focus:top-1
                peer-focus:text-xs
                peer-focus:text-[#CFE3C9]"
              >
                Password
              </label>
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#A7C4A0] to-[#8FB996] hover:from-[#8FB996] hover:to-[#6E9C7D] text-[#243D2B] font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02]"
            >
              Clock In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#DDE7D9]/80 relative z-10">
            Demo: Use any employee ID/password
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 bg-[#3B5D42]/50 backdrop-blur-md rounded-lg p-4 border border-[#DDE7D9]/30 animate-fade-in">
          <p className="text-xs text-[#F4F8F3] text-center">
            Need help?{" "}
            <a href="#" className="underline font-medium hover:text-white">
              Contact Admin
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
