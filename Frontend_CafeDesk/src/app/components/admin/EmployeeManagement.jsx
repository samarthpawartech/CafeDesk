"use client";

import { useState, useMemo } from "react";
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

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    role: "WAITER",
    shift: "Morning",
    available: true,
  });

  const cafeInput =
    "h-12 w-full rounded-2xl bg-[#fdf6e3]/20 backdrop-blur-md border border-[#fdf6e3]/30 px-5 text-[#333] placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#fdf6e3]/40 transition-all";
  const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-[#c7a17a]";

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      role: "WAITER",
      shift: "Morning",
      available: true,
    });
    setEditingEmployee(null);
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployee.id ? { ...formData } : emp,
        ),
      );
    } else {
      const newEmp = { ...formData, id: Date.now() };
      setEmployees((prev) => [...prev, newEmp]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setFormData(emp);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [employees, searchTerm]);

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-[#fdf6e3]/10 via-[#fdf6e3]/20 to-[#fdf6e3]/10 backdrop-blur-md">
      {/* Search + Add */}
      <div className="mb-12 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6">
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
          className="h-12 px-8 rounded-2xl bg-[#fdf6e3]/20 backdrop-blur-md border border-[#fdf6e3]/30 text-[#c7a17a] font-semibold hover:bg-[#fdf6e3]/30 transition"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Employee
        </Button>
      </div>

      {/* Employee Cards */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="rounded-3xl bg-[#fdf6e3]/20 backdrop-blur-md shadow-lg p-6 transition-all hover:shadow-xl"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-[#c7a17a]">{emp.name}</h3>
                <Badge
                  className={
                    emp.available
                      ? "bg-green-100/50 text-green-700"
                      : "bg-red-100/50 text-red-600"
                  }
                >
                  {emp.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <p className="text-[#333]/80 text-sm mb-2">Role: {emp.role}</p>
              <p className="text-[#333]/80 text-sm mb-2">Shift: {emp.shift}</p>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(emp)}
                  className="text-[#333]/80 hover:text-[#c7a17a]"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(emp.id)}
                  className="text-[#333]/80 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="flex items-start md:items-start justify-center min-h-screen pt-10 md:pt-20">
          <DialogContent className="rounded-3xl bg-[#fdf6e3]/20 backdrop-blur-md shadow-xl border border-[#fdf6e3]/30 mx-auto max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#c7a17a]">
                {editingEmployee ? "Edit Employee" : "Add Employee"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {editingEmployee && (
                <Input value={formData.id} disabled className={cafeInput} />
              )}

              <Input
                className={cafeInput}
                placeholder="Employee Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <Input
                className={cafeInput}
                placeholder="Role (e.g. WAITER)"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              />

              <Input
                className={cafeInput}
                placeholder="Shift (e.g. Morning)"
                value={formData.shift}
                onChange={(e) =>
                  setFormData({ ...formData, shift: e.target.value })
                }
              />
            </div>

            <DialogFooter>
              <Button
                onClick={handleSave}
                className="rounded-2xl px-8 h-12 bg-[#fdf6e3]/20 backdrop-blur-md border border-[#fdf6e3]/30 text-[#c7a17a] font-semibold hover:bg-[#fdf6e3]/30 transition"
              >
                Save Employee
              </Button>
            </DialogFooter>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;
