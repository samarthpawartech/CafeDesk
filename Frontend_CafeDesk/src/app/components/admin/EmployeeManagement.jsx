"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Plus, Search } from "lucide-react";

const BASE_URL = "http://localhost:8080/api/employee";

const roles = ["CHEF", "WAITER", "BARISTA", "STORE_MANAGER", "GENERAL_MANAGER"];
const shifts = ["MORNING_SHIFT", "EVENING_SHIFT", "FULL_DAY_SHIFT"];
const statuses = ["ACTIVE", "INACTIVE", "ON_LEAVE", "EX_EMPLOYEE"];

/* ================= Helpers ================= */

const formatLabel = (value) =>
  value
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const statusColor = (status) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-400/20 text-green-700";
    case "INACTIVE":
      return "bg-red-400/20 text-red-600";
    case "ON_LEAVE":
      return "bg-yellow-400/20 text-yellow-700";
    case "EX_EMPLOYEE":
      return "bg-gray-400/20 text-gray-700";
    default:
      return "";
  }
};

/* ================= Main ================= */

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    setEmployees(data);
  };

  /* ===== Filtering Logic ===== */

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesTab = activeTab === "ALL" ? true : emp.status === activeTab;

      const matchesSearch =
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone?.includes(searchTerm);

      return matchesTab && matchesSearch;
    });
  }, [employees, activeTab, searchTerm]);

  /* ===== CRUD ===== */

  const saveEmployee = async (data) => {
    const isEdit = !!data.id;
    const url = isEdit ? `${BASE_URL}/${data.id}` : BASE_URL;
    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, salary: Number(data.salary || 0) }),
    });

    fetchEmployees();
    setSelectedEmployee(null);
    setShowAddModal(false);
  };

  const deleteEmployee = async (id) => {
    await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    fetchEmployees();
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#f1f3f5] to-[#e9ecef] p-6 md:p-10">
      {/* ===== Search Bar (Centered) ===== */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search employee by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-lg focus:outline-none"
          />
        </div>
      </div>

      {/* ===== Tabs + Add Button (Same Row) ===== */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3">
          {["ALL", "ACTIVE", "INACTIVE", "ON_LEAVE", "EX_EMPLOYEE"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-2xl text-sm font-medium backdrop-blur-md transition border ${
                  activeTab === tab
                    ? "bg-white/80 shadow-md border-white"
                    : "bg-white/40 border-white/40 hover:bg-white/60"
                }`}
              >
                {formatLabel(tab)}
              </button>
            ),
          )}
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/40 shadow-lg px-6 py-2 rounded-2xl hover:scale-105 transition"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* ===== Employee Cards ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEmployees.map((emp) => (
          <motion.div
            key={emp.id}
            whileHover={{ y: -8 }}
            className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {emp.name}
                </h3>
                <p className="text-sm text-gray-600">{emp.email}</p>
                <p className="text-sm text-gray-600">{emp.phone}</p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(
                  emp.status,
                )}`}
              >
                {formatLabel(emp.status)}
              </span>
            </div>

            <div className="mt-5 space-y-2 text-sm text-gray-700">
              <p>
                <strong>Role:</strong> {formatLabel(emp.role)}
              </p>
              <p>
                <strong>Shift:</strong> {formatLabel(emp.shift)}
              </p>
              <p>
                <strong>Salary:</strong> ₹{emp.salary || 0}
              </p>
            </div>

            <div className="flex gap-6 mt-6 text-sm">
              <button
                onClick={() => setSelectedEmployee(emp)}
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <Edit size={14} /> Edit
              </button>

              <button
                onClick={() => deleteEmployee(emp.id)}
                className="text-red-500 hover:underline flex items-center gap-1"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {(showAddModal || selectedEmployee) && (
          <EmployeeModal
            data={
              selectedEmployee || {
                id: null,
                name: "",
                email: "",
                phone: "",
                role: roles[0],
                shift: shifts[0],
                status: statuses[0],
                salary: "",
              }
            }
            onClose={() => {
              setSelectedEmployee(null);
              setShowAddModal(false);
            }}
            onSave={saveEmployee}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= Modal (Same As Yours) ================= */

function EmployeeModal({ data, onClose, onSave }) {
  const [form, setForm] = useState({ ...data });

  useEffect(() => {
    setForm({ ...data });
  }, [data]);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white/60 backdrop-blur-2xl border border-white/40 rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {data.id ? "Edit Employee" : "Add Employee"}
        </h2>

        {["name", "email", "phone", "salary"].map((field) => (
          <input
            key={field}
            type={field === "salary" ? "number" : "text"}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full bg-white/70 border border-white/40 rounded-xl p-2 focus:outline-none"
            value={form[field]}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        ))}

        {[
          { key: "role", list: roles },
          { key: "shift", list: shifts },
          { key: "status", list: statuses },
        ].map(({ key, list }) => (
          <select
            key={key}
            value={form[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full bg-white/70 border border-white/40 rounded-xl p-2"
          >
            {list.map((item) => (
              <option key={item} value={item}>
                {formatLabel(item)}
              </option>
            ))}
          </select>
        ))}

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/60 border border-white/40"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(form)}
            className="px-5 py-2 rounded-xl bg-white/80 shadow-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
