import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Components
import { RoleSelector } from "./components/RoleSelector";
import { CustomerLogin } from "./components/auth/CustomerLogin";
import { EmployeeLogin } from "./components/auth/EmployeeLogin";
import { AdminLogin } from "./components/auth/AdminLogin";
import { CustomerDashboard } from "./components/dashboard/CustomerDashboard";
import { EmployeeDashboard } from "./components/dashboard/EmployeeDashboard";
import { AdminDashboard } from "./components/dashboard/AdminDashboard";
import { CustomerRegistrationForm } from "./components/auth/CustomerRegistrationForm";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Home / Role Selection */}
      <Route path="/" element={<RoleSelector />} />

      {/* Login Routes */}
      <Route path="/login/customer" element={<CustomerLogin />} />
      <Route path="/login/employee" element={<EmployeeLogin />} />
      <Route path="/login/admin" element={<AdminLogin />} />

      {/* Registration */}
      <Route path="/register" element={<CustomerRegistrationForm />} />

      {/* Dashboards */}
      <Route
        path="/dashboard/customer"
        element={
          user?.role === "customer" ? (
            <CustomerDashboard />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/dashboard/employee"
        element={
          user?.role === "employee" ? (
            <EmployeeDashboard />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}
