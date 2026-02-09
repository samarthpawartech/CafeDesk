import { useState } from "react";
import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import { RoleSelector } from "@/app/components/RoleSelector";
import { CustomerLogin } from "@/app/components/auth/CustomerLogin";
import { EmployeeLogin } from "@/app/components/auth/EmployeeLogin";
import { AdminLogin } from "@/app/components/auth/AdminLogin";
import { CustomerDashboard } from "@/app/components/dashboard/CustomerDashboard";
import { EmployeeDashboard } from "@/app/components/dashboard/EmployeeDashboard";
import { AdminDashboard } from "@/app/components/dashboard/AdminDashboard";

function AppContent() {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);

  // If user is logged in, render their dashboard
  if (user) {
    switch (user.role) {
      case "customer":
        return <CustomerDashboard />;
      case "employee":
        return <EmployeeDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return null; // fallback if role is unknown
    }
  }

  // If a role is selected but user is not logged in, show login page
  switch (selectedRole) {
    case "customer":
      return <CustomerLogin />;
    case "employee":
      return <EmployeeLogin />;
    case "admin":
      return <AdminLogin />;
    default:
      return <RoleSelector onSelectRole={setSelectedRole} />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
