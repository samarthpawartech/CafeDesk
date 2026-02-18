// src/app/components/auth/CustomerRegistrationForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Mail, Phone } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import axios from "axios";

export const CustomerRegistrationForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:8080/api/customer/register", {
        username,
        password,
        fullName,
        email,
        phone,
      });

      setSuccess("Registration successful! Redirecting to login...");
      console.log("Registration successfully");

      setTimeout(() => {
        navigate("/login/customer"); // ✅ Redirect to login page
      }, 1500);

      // Clear form fields
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Username may already exist.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "peer w-full bg-[#FFFDF9]/90 border border-[#DCC7AA]/60 rounded-xl px-4 pt-5 pb-2 text-[#3A2418] placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#C8A97E] transition-all duration-300";

  const labelClasses =
    "absolute left-4 top-2 text-[#8B6F47] text-sm transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#A99F87] peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#C8A97E]";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFFDF9] via-[#F7EFE5] to-[#EADFCC] animate-fade-in">
      <div className="w-full max-w-md sm:max-w-lg">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#EADFCC]/60 p-6 sm:p-10 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#3A2418] mb-6">
            Customer Registration
          </h2>

          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
          {success && (
            <p className="text-green-600 mb-4 text-center">{success}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username */}
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClasses}
                required
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47] peer-focus:text-[#C8A97E] transition-colors duration-300" />
              <label className={labelClasses}>Username *</label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                required
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47] peer-focus:text-[#C8A97E] transition-colors duration-300" />
              <label className={labelClasses}>Password *</label>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClasses}
                required
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47] peer-focus:text-[#C8A97E] transition-colors duration-300" />
              <label className={labelClasses}>Confirm Password *</label>
            </div>

            {/* Full Name */}
            <div className="relative">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClasses}
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]" />
              <label className={labelClasses}>Full Name</label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]" />
              <label className={labelClasses}>Email</label>
            </div>

            {/* Phone */}
            <div className="relative">
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClasses}
              />
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]" />
              <label className={labelClasses}>Phone</label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 sm:h-16 rounded-xl bg-gradient-to-r from-[#C8A97E] to-[#B08968] text-[#3A2418] font-semibold tracking-wide transition-all duration-300 transform hover:scale-105"
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm sm:text-base text-[#6B4423]">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login/customer")}
                className="underline font-medium hover:text-[#3A2418] transition-colors duration-300"
              >
                Login here
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
      `}</style>
    </div>
  );
};
