"use client";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Table,
  LogOut,
  Fingerprint,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { motion } from "framer-motion";

export const Sidebar = ({ currentView, setCurrentView, onClose }) => {
  const { user, logout } = useAuth();

  const normalize = (str) =>
    String(str || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .trim();

  const adminMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "menu", label: "Menu Management", icon: ShoppingCart },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "employees", label: "Employees", icon: Users },
    { id: "bills", label: "Bills & Payments", icon: FileText },
    { id: "tables", label: "Table Management", icon: Table },
  ];

  const employeeMenuItems = [
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "tables", label: "Tables", icon: Table },
    { id: "bills", label: "Bills", icon: FileText },
  ];

  const menuItems = user?.role === "admin" ? adminMenuItems : employeeMenuItems;

  return (
    <motion.div
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      exit={{ x: -260 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="w-64 bg-[#f8f7f5] text-[#2C1810] h-full md:h-screen flex flex-col shadow-lg"
    >
      {/* LOGO */}
      <div className="p-4 md:p-6 border-b border-[#E8D5BF] flex justify-center">
        <img
          src="/assets/CafeDesklogo.png"
          alt="CafeDesk Logo"
          className="w-[140px] md:w-[180px] h-auto object-contain"
        />
      </div>

      {/* USER INFO */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-[#E8D5BF] flex items-center gap-3">
        <Fingerprint className="w-4 h-4 md:w-5 md:h-5 text-[#8B6F47]" />
        <div className="truncate">
          <p className="text-xs md:text-sm text-[#8B6F47]">
            Authenticated User
          </p>
          <p className="font-bold text-sm md:text-lg uppercase truncate">
            {user?.name}
          </p>
          <p className="text-xs md:text-sm uppercase">{user?.role}</p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 py-2 md:py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = normalize(currentView) === normalize(item.id);

          return (
            <motion.button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                onClose && onClose(); // ✅ close on mobile
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 text-left transition-all rounded-r-md
                ${
                  isActive
                    ? "bg-[#E8D5BF] border-l-4 border-[#6B4423] font-semibold shadow-inner"
                    : "hover:bg-[#F5E6D3]"
                }`}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-3 md:p-4 border-t border-[#E8D5BF]">
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-2.5 md:py-3 rounded-lg hover:bg-[#F5E6D3] transition"
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Logout</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
