import { useState } from "react";
import { Sidebar } from "@/app/components/layout/Sidebar";
import { Navbar } from "@/app/components/layout/Navbar";
import { AdminOverview } from "@/app/components/admin/AdminOverview";
import { MenuManagement } from "@/app/components/admin/MenuManagement";
import { InventoryManagement } from "@/app/components/admin/InventoryManagement";
import { BillsView } from "@/app/components/employee/BillsView";
import { TablesView } from "@/app/components/employee/TablesView";
import EmployeeManagement from "@/app/components/admin/EmployeeManagement";

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <AdminOverview />;
      case "menu":
        return <MenuManagement />;
      case "inventory":
        return <InventoryManagement />;
      case "employees":
        return <EmployeeManagement />;
      case "bills":
        return <BillsView />;
      case "tables":
        return <TablesView />;
      default:
        return <AdminOverview />;
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
          {/* Sidebar Panel */}
          <div className="w-64 bg-white shadow-lg">
            <Sidebar
              currentView={currentView}
              setCurrentView={setCurrentView}
              onClose={() => setIsSidebarOpen(false)} // ✅ FIXED
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
        {/* ✅ Navbar FIXED */}
        <Navbar
          currentView={currentView} // ✅ IMPORTANT FIX
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* ✅ Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
