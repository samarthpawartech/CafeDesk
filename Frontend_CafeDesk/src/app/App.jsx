// src/app/App.jsx
import { useState } from "react";
import { useAuth } from "./context/AuthContext"; // ✅ fixed relative path
import { RoleSelector } from "./components/RoleSelector";
import { CustomerLogin } from "./components/auth/CustomerLogin";
import { EmployeeLogin } from "./components/auth/EmployeeLogin";
import { AdminLogin } from "./components/auth/AdminLogin";
import { CustomerDashboard } from "./components/dashboard/CustomerDashboard";
import { EmployeeDashboard } from "./components/dashboard/EmployeeDashboard";
import { AdminDashboard } from "./components/dashboard/AdminDashboard";

function AppContent() {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);

  if (user) {
    if (user.role === "customer") return <CustomerDashboard />;
    if (user.role === "employee") return <EmployeeDashboard />;
    if (user.role === "admin") return <AdminDashboard />;
  }

  if (selectedRole === "customer") return <CustomerLogin />;
  if (selectedRole === "employee") return <EmployeeLogin />;
  if (selectedRole === "admin") return <AdminLogin />;

  return <RoleSelector onSelectRole={setSelectedRole} />;
}

export default function App() {
  return <AppContent />;
}
