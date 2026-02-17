import { useState } from "react";
import { Sidebar } from "@/app/components/layout/Sidebar";
import { Navbar } from "@/app/components/layout/Navbar";
import { AdminOverview } from "@/app/components/admin/AdminOverview";
import { MenuManagement } from "@/app/components/admin/MenuManagement";
import { InventoryManagement } from "@/app/components/admin/InventoryManagement";
import { BillsView } from "@/app/components/employee/BillsView";
import { TablesView } from "@/app/components/employee/TablesView";
import EmployeeManagement from "@/app/components/admin/EmployeeManagement";

export const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");

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

  const getTitle = () => {
    switch (currentView) {
      case "dashboard":
        return "Dashboard Overview";
      case "menu":
        return "Menu Management";
      case "inventory":
        return "Inventory Management";
      case "employees":
        return "Employee Management";
      case "bills":
        return "Bills & Payments";
      case "tables":
        return "Table Management";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="flex h-screen bg-[#FBF8F3]">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={getTitle()} />

        <main className="flex-1 overflow-y-auto p-6">{renderView()}</main>
      </div>
    </div>
  );
};
