// src/app/components/auth/CustomerRegistrationForm.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Mail, Phone, Eye, EyeOff } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import axios from "@/app/api/axiosConfig";

export const CustomerRegistrationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/customer/register", {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });

      setSuccess("Registration successful! Redirecting...");

      setTimeout(() => {
        navigate("/login/customer");
      }, 1200);

      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        email: "",
        phone: "",
      });
    } catch (err) {
      console.error(err);

      if (err.response?.status === 403) {
        setError("Access denied. Check backend security config.");
      } else if (err.response?.status === 409) {
        setError("Username already exists.");
      } else {
        setError(
          err.response?.data?.message ||
            "Registration failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "peer w-full bg-[#FFFDF9]/90 border border-[#DCC7AA]/60 rounded-xl px-4 pt-5 pb-2 text-[#3A2418] placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#C8A97E] transition-all duration-300";

  const labelClasses =
    "absolute left-4 top-2 text-[#8B6F47] text-sm transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#A99F87] peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#C8A97E]";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFFDF9] via-[#F7EFE5] to-[#EADFCC]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-[#EADFCC]/60">
          <h2 className="text-3xl font-bold text-center text-[#3A2418] mb-6">
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
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className={inputClasses}
                required
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]" />
              <label className={labelClasses}>Username *</label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={inputClasses}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <label className={labelClasses}>Password *</label>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClasses}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <label className={labelClasses}>Confirm Password *</label>
            </div>

            {/* Full Name */}
            <div className="relative">
              <input
                name="fullName"
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className={inputClasses}
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]" />
              <label className={labelClasses}>Full Name</label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={inputClasses}
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]" />
              <label className={labelClasses}>Email</label>
            </div>

            {/* Phone */}
            <div className="relative">
              <input
                name="phone"
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClasses}
              />
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47]" />
              <label className={labelClasses}>Phone</label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-[#C8A97E] to-[#B08968] text-[#3A2418] font-semibold hover:scale-105 transition-all"
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
