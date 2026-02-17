"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Edit, Trash2, Plus, User } from "lucide-react";

const BASE_URL = "http://localhost:8080/api/employee";

const roles = ["Chef", "Waiter", "Barista", "Store Manager", "General Manager"];
const shifts = ["Morning Shift", "Evening Shift", "Full-Day Shift"];
const statuses = ["Active", "Unactive", "On-Leave", "Ex Employee"];

const roleMap = {
  Chef: "CHEF",
  Waiter: "WAITER",
  Barista: "BARISTA",
  "Store Manager": "STORE_MANAGER",
  "General Manager": "GENERAL_MANAGER",
};

const shiftMap = {
  "Morning Shift": "MORNING_SHIFT",
  "Evening Shift": "EVENING_SHIFT",
  "Full-Day Shift": "FULL_DAY_SHIFT",
};

const statusMap = {
  Active: "ACTIVE",
  Unactive: "UNACTIVE",
  "On-Leave": "ON_LEAVE",
  "Ex Employee": "EX_EMPLOYEE",
};

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openDetails, setOpenDetails] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Failed to fetch employees!" });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || emp.status === statusMap[statusFilter];
    return matchesSearch && matchesStatus;
  });

  const activeEmployees = filteredEmployees.filter(
    (emp) => emp.status === "ACTIVE",
  );

  const deleteEmployee = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete employee");
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      setNotification({
        type: "success",
        message: "Employee deleted successfully!",
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Failed to delete employee!" });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const saveEmployee = async (data) => {
    try {
      const payload = {
        ...data,
        role: roleMap[data.role] || data.role,
        shift: shiftMap[data.shift] || data.shift,
        status: statusMap[data.status] || data.status,
        salary: Number(data.salary || 0),
      };

      let res, savedEmployee;
      if (data.id) {
        res = await fetch(`${BASE_URL}/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update employee");
        savedEmployee = await res.json();
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === savedEmployee.id ? savedEmployee : emp,
          ),
        );
        setNotification({
          type: "success",
          message: "Employee updated successfully!",
        });
      } else {
        const { id, ...dataToSend } = payload;
        res = await fetch(BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });
        if (!res.ok) throw new Error("Failed to create employee");
        savedEmployee = await res.json();
        setEmployees((prev) => [...prev, savedEmployee]);
        setNotification({
          type: "success",
          message: "Employee added successfully!",
        });
      }

      setSelectedEmployee(null);
      setShowAddModal(false);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Failed to save employee!" });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-600";
      case "ON_LEAVE":
        return "bg-yellow-100 text-yellow-600";
      case "EX_EMPLOYEE":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] via-[#f8f5f2] to-[#f3efe9] p-10 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-700">
        Employee Management
      </h1>

      {/* Search + Add */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-6 items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search employee..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/60 backdrop-blur border border-white/40 focus:ring-2 focus:ring-amber-300 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-xl shadow"
        >
          <Plus size={18} /> Add Employee
        </motion.button>
      </div>

      {/* Active Employees */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Active Employees
      </h2>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {activeEmployees.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No active employees found.
          </p>
        )}
        {activeEmployees.map((emp) => (
          <EmployeeCard
            key={emp.id}
            emp={emp}
            openDetails={openDetails}
            setOpenDetails={setOpenDetails}
            setSelectedEmployee={setSelectedEmployee}
            deleteEmployee={deleteEmployee}
            statusColor={statusColor}
          />
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex gap-3 mb-6 items-center">
        <span className="font-semibold text-gray-700">Filter by Status:</span>
        <select
          className="px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-700"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          {statuses.map((st) => (
            <option key={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* All Employees (Card Grid) */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        All Employees
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredEmployees.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No employees found.
          </p>
        )}
        {filteredEmployees.map((emp) => (
          <EmployeeCard
            key={emp.id}
            emp={emp}
            openDetails={openDetails}
            setOpenDetails={setOpenDetails}
            setSelectedEmployee={setSelectedEmployee}
            deleteEmployee={deleteEmployee}
            statusColor={statusColor}
          />
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {(showAddModal || selectedEmployee) && (
          <EmployeeModal
            data={
              selectedEmployee || {
                name: "",
                email: "",
                phone: "",
                role: roles[0],
                shift: shifts[0],
                status: statuses[0],
                salary: 0,
              }
            }
            onClose={() => {
              setShowAddModal(false);
              setSelectedEmployee(null);
            }}
            onSave={saveEmployee}
          />
        )}
      </AnimatePresence>

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow text-white ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </motion.div>
      )}
    </div>
  );
}

// -------------------- Employee Card --------------------
function EmployeeCard({
  emp,
  openDetails,
  setOpenDetails,
  setSelectedEmployee,
  deleteEmployee,
  statusColor,
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-lg relative"
    >
      <div className="flex items-center gap-3 mb-3">
        <User className="text-gray-600" />
        <div>
          <h3 className="text-lg font-semibold">{emp.name}</h3>
          <p className="text-sm text-gray-500">{emp.email}</p>
          <p className="text-sm text-gray-500">{emp.phone}</p>
          <p className="text-sm text-gray-500">
            <strong>Salary:</strong> ₹{emp.salary || 0}
          </p>
        </div>
      </div>

      <button
        onClick={() => setOpenDetails(openDetails === emp.id ? null : emp.id)}
        className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
      >
        View Details
        <motion.div animate={{ rotate: openDetails === emp.id ? 180 : 0 }}>
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence>
        {openDetails === emp.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-4 bg-white/70 backdrop-blur border border-white/40 rounded-xl p-4 text-sm space-y-2"
          >
            <p>
              <strong>Role:</strong> {emp.role}
            </p>
            <p>
              <strong>Shift:</strong> {emp.shift}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs ${statusColor(emp.status)}`}
              >
                {emp.status}
              </span>
            </p>
            <p>
              <strong>Salary:</strong> ₹{emp.salary || 0}
            </p>
            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setSelectedEmployee(emp)}
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <Edit size={14} /> Edit
              </button>
              <button
                onClick={() => deleteEmployee(emp.id)}
                className="flex items-center gap-1 text-red-500 hover:underline"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// -------------------- Modal --------------------
function EmployeeModal({ data, onClose, onSave }) {
  const [form, setForm] = useState(data);

  return (
    <motion.div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 w-[420px] shadow-xl"
      >
        <h2 className="text-2xl mb-6 text-gray-700">
          {data.id ? "Edit Employee" : "Add Employee"}
        </h2>

        <div className="space-y-3">
          <input
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded-xl bg-white/70 border border-white/40"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Email"
            className="w-full px-4 py-2 rounded-xl bg-white/70 border border-white/40"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Phone"
            className="w-full px-4 py-2 rounded-xl bg-white/70 border border-white/40"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            type="number"
            placeholder="Salary"
            className="w-full px-4 py-2 rounded-xl bg-white/70 border border-white/40"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />
          <select
            className="w-full px-4 py-2 rounded-xl bg-white/70 border border-white/40"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <select
            className="w-full px-4 py-2 rounded-xl bg-white/70 border border-white/40"
            value={form.shift}
            onChange={(e) => setForm({ ...form, shift: e.target.value })}
          >
            {shifts.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            className="w-full px-4 py-2 rounded-xl bg-white/70 border border-white/40"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {statuses.map((st) => (
              <option key={st}>{st}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-white"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
