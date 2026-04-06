"use client";

import { useState } from "react";
import { Sidebar } from "@/app/components/layout/Sidebar";
import { Navbar } from "@/app/components/layout/Navbar";
import { OrdersList } from "@/app/components/employee/OrdersList";
import { TablesView } from "@/app/components/employee/TablesView";
import { BillsView } from "@/app/components/employee/BillsView";

export default function EmployeeDashboard() {
  const [currentView, setCurrentView] = useState("orders");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ✅ NEW

  const renderView = () => {
    switch (currentView) {
      case "orders":
        return <OrdersList />;
      case "tables":
        return <TablesView />;
      case "bills":
        return <BillsView />;
      default:
        return <OrdersList />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case "orders":
        return "Orders Management";
      case "tables":
        return "Table Management";
      case "bills":
        return "Bills & Payments";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="flex h-screen bg-[#FBF8F3] overflow-hidden">
      {/* ✅ Sidebar (Desktop) */}
      <div className="hidden md:block">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      </div>

      {/* ✅ Sidebar (Mobile Drawer) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-lg">
            <Sidebar
              currentView={currentView}
              setCurrentView={(view) => {
                setCurrentView(view);
                setIsSidebarOpen(false); // close after click
              }}
            />
          </div>

          {/* Overlay */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      {/* ✅ Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar
          title={getTitle()}
          onMenuClick={() => setIsSidebarOpen(true)} // ✅ important
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
