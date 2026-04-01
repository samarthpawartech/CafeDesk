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

export const Sidebar = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();

  // Normalize helper (IMPORTANT FIX)
  const normalize = (str) =>
    String(str).toLowerCase().replace(/\s+/g, "").trim();

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
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="w-64 bg-[#f8f7f5] text-[#2C1810] h-screen flex flex-col shadow-lg select-none"
    >
      {/* LOGO */}
      <div className="p-6 border-b border-[#E8D5BF] flex justify-center">
        <img
          src="/assets/CafeDesklogo.png"
          alt="CafeDesk Logo"
          className="w-[200px] h-auto object-contain"
        />
      </div>

      {/* USER INFO */}
      <div className="px-6 py-4 border-b border-[#E8D5BF] flex items-center gap-3">
        <Fingerprint className="w-5 h-5 text-[#8B6F47]" />
        <div>
          <p className="text-sm text-[#8B6F47]">Authenticated User</p>
          <p className="font-bold text-xl uppercase tracking-wide">
            {user?.name}
          </p>
          <p className="text-sm text-[#0c0a06] uppercase tracking-wide">
            {user?.role}
          </p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;

          // FIX: Normalize both sides
          const isActive = normalize(currentView) === normalize(item.id);

          return (
            <motion.button
              key={item.id}
              onClick={() => {
                // FIX: force new value (prevents stale state issue)
                setCurrentView(item.id);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all rounded-r-md
                ${
                  isActive
                    ? "bg-[#E8D5BF] text-[#2C1810] border-l-4 border-[#6B4423] font-semibold shadow-inner"
                    : "text-[#2C1810] hover:bg-[#F5E6D3]"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-[#E8D5BF]">
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.02, backgroundColor: "#F5E6D3" }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 text-[#2C1810] rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-lg">Logout</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
