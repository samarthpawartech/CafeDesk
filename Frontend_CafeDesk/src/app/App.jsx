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

  // If user is logged in, show appropriate dashboard
  if (user) {
    if (user.role === "customer") {
      return <CustomerDashboard />;
    } else if (user.role === "employee") {
      return <EmployeeDashboard />;
    } else if (user.role === "admin") {
      return <AdminDashboard />;
    }
  }

  // If role is selected but not logged in, show login page
  if (selectedRole === "customer") {
    return <CustomerLogin />;
  } else if (selectedRole === "employee") {
    return <EmployeeLogin />;
  } else if (selectedRole === "admin") {
    return <AdminLogin />;
  }

  // Default: Show role selector
  return <RoleSelector onSelectRole={setSelectedRole} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
