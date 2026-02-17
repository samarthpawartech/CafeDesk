import { Bell, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

export const Navbar = ({ title }) => {
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
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
    <nav className="bg-white border-b border-[#E8D5BF] px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810]">{title}</h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-[#FBF8F3] rounded-lg transition-colors duration-200">
            <Bell className="w-6 h-6 text-[#6B4423]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#C44536] rounded-full animate-pulse"></span>
          </button>

          {/* User Avatar & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 hover:bg-[#FBF8F3] p-2 rounded-lg transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-md">
                <img
                  src="/assets/login.gif"
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </button>

            {/* Dropdown Menu with Smooth Transition */}
            <div
              className={`absolute right-0 mt-2 w-36 bg-white border border-[#E8D5BF] rounded-lg shadow-lg overflow-hidden transform transition-all duration-200 origin-top-right ${
                dropdownOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
            >
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#FBF8F3] transition-colors text-red-600"
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
