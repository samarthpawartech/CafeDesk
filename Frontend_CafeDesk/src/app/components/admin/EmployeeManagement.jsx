"use client";

import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";

const API_URL = "http://localhost:8080/api/employees";

// Mapping user-friendly labels to backend enums
const ROLE_OPTIONS = [
  { label: "General Manager", value: "GENERAL_MANAGER" },
  { label: "Store Manager", value: "STORE_MANAGER" },
  { label: "Chef", value: "CHEF" },
  { label: "Barista", value: "BARISTA" },
  { label: "Waiter", value: "WAITER" },
];

const SHIFT_OPTIONS = [
  { label: "Full Day", value: "FULL_DAY_SHIFT" },
  { label: "Morning", value: "MORNING_SHIFT" },
  { label: "Evening", value: "EVENING_SHIFT" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "On Leave", value: "ON_LEAVE" },
  { label: "Ex Employee", value: "EX_EMPLOYEE" },
];

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    role: "WAITER",
    salary: "",
    shift: "FULL_DAY_SHIFT",
    status: "ACTIVE",
  });

  const cafeInput =
    "h-12 w-full rounded-2xl bg-[#fdf6e3]/20 backdrop-blur-md border border-[#fdf6e3]/30 px-5 text-[#333] focus:outline-none focus:ring-2 focus:ring-[#fdf6e3]/40 transition-all";

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    if (!token) return;
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error.response || error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      email: "",
      phone: "",
      role: "WAITER",
      salary: "",
      shift: "FULL_DAY_SHIFT",
      status: "ACTIVE",
    });
    setEditingEmployee(null);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      alert("Name and Email are required!");
      return;
    }

    if (!token) {
      alert("Authorization token missing. Please login again.");
      return;
    }

    try {
      const payload = {
        ...formData,
        salary: formData.salary ? Number(formData.salary) : 0,
      };

      if (editingEmployee) {
        await axios.put(`${API_URL}/${editingEmployee.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchEmployees();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving employee:", error.response || error);
      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Error saving employee",
      );
    }
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      role: emp.role,
      salary: emp.salary,
      shift: emp.shift,
      status: emp.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    if (!token) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error.response || error);
      alert("Failed to delete employee");
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees
      .filter(
        (emp) =>
          emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.role?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .filter((emp) =>
        statusFilter === "ALL" ? true : emp.status === statusFilter,
      );
  }, [employees, searchTerm, statusFilter]);

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-[#fdf6e3]/10 via-[#fdf6e3]/20 to-[#fdf6e3]/10 backdrop-blur-md">
      {/* Search + Add */}
      <div className="mb-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c7a17a]" />
          <Input
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${cafeInput} pl-12`}
          />
        </div>

        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="h-12 px-8 rounded-2xl bg-[#fdf6e3]/20 border border-[#fdf6e3]/30 text-[#c7a17a] font-semibold hover:bg-[#fdf6e3]/30 transition"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Employee
        </Button>
      </div>

      {/* Status Filter Buttons */}
      <div className="mb-8 max-w-6xl mx-auto flex flex-wrap gap-3">
        {["ALL", "ACTIVE", "INACTIVE", "ON_LEAVE", "EX_EMPLOYEE"].map(
          (status) => (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status.replace("_", " ")}
            </Button>
          ),
        )}
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="rounded-3xl bg-white shadow-lg p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-[#c7a17a]">{emp.name}</h3>
              <Badge
                className={
                  emp.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : emp.status === "INACTIVE"
                      ? "bg-red-100 text-red-600"
                      : emp.status === "ON_LEAVE"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                }
              >
                {emp.status.replace("_", " ")}
              </Badge>
            </div>

            <p className="text-sm">Email: {emp.email}</p>
            <p className="text-sm">Phone: {emp.phone}</p>
            <p className="text-sm">
              Role:{" "}
              {ROLE_OPTIONS.find((r) => r.value === emp.role)?.label ||
                emp.role}
            </p>
            <p className="text-sm">Salary: ₹{emp.salary}</p>
            <p className="text-sm">
              Shift:{" "}
              {SHIFT_OPTIONS.find((s) => s.value === emp.shift)?.label ||
                emp.shift}
            </p>

            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="ghost" onClick={() => handleEdit(emp)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(emp.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-3xl bg-white shadow-xl max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "Edit Employee" : "Add Employee"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              className={cafeInput}
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Input
              className={cafeInput}
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              className={cafeInput}
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <Input
              className={cafeInput}
              type="number"
              placeholder="Salary"
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
            />

            {/* Role Select */}
            <select
              className={cafeInput}
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Shift Select */}
            <select
              className={cafeInput}
              value={formData.shift}
              onChange={(e) =>
                setFormData({ ...formData, shift: e.target.value })
              }
            >
              {SHIFT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Status Select */}
            <select
              className={cafeInput}
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter>
            <Button onClick={handleSave}>Save Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;
