"use client";

import { Bell, LogOut, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

export const Navbar = ({ currentView, onMenuClick }) => {
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const normalize = (str) =>
    String(str || "dashboard")
      .toLowerCase()
      .replace(/\s+/g, "")
      .trim();

  const titles = {
    dashboard: "Dashboard",
    menu: "Menu Management",
    inventory: "Inventory",
    employees: "Employees",
    bills: "Bills & Payments",
    tables: "Table Management",
    orders: "Orders",
  };

  const pageTitle = titles[normalize(currentView)] || "Dashboard";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-[#E8D5BF] px-4 md:px-6 py-3 md:py-4 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* ✅ Left: Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-[#FBF8F3] rounded-lg transition"
        >
          <Menu className="w-6 h-6 text-[#6B4423]" />
        </button>

        {/* ✅ Title (Responsive, no absolute) */}
        <h1
          className="text-lg sm:text-xl md:text-3xl lg:text-4xl text-[#2C1810] tracking-wide truncate text-center flex-1"
          style={{ fontFamily: "'Lacheyard Script', cursive" }}
        >
          {pageTitle}
        </h1>

        {/* ✅ Right Section */}
        <div className="flex items-center gap-2 sm:gap-4 relative">
          {/* Notification */}
          <button className="relative p-2 hover:bg-[#FBF8F3] rounded-lg transition">
            <Bell className="w-5 h-5 md:w-6 md:h-6 text-[#6B4423]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#C44536] rounded-full animate-pulse"></span>
          </button>

          {/* Avatar + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 hover:bg-[#FBF8F3] p-1 md:p-2 rounded-lg transition"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden shadow-md">
                <img
                  src="/assets/login.gif"
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </button>

            {/* Dropdown */}
            <div
              className={`absolute right-0 mt-2 w-36 bg-white border border-[#E8D5BF] rounded-lg shadow-lg origin-top-right transform transition-all duration-200 ${
                dropdownOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
            >
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#FBF8F3] text-red-600 transition"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
