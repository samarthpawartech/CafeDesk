"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

const API = "http://localhost:8080/api/employee/tables";
const ORDER_API = "http://localhost:8080/api/employee/orders";

export const TablesView = () => {
  const [tables, setTables] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedTable, setSelectedTable] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // ✅ ADD TABLE STATE (RESTORED)
  const [showForm, setShowForm] = useState(false);
  const [newTable, setNewTable] = useState({
    number: "",
    capacity: "",
  });

  const statusConfig = {
    available: { label: "Available", color: "bg-green-500" },
    occupied: { label: "Occupied", color: "bg-red-500" },
    reserved: { label: "Reserved", color: "bg-yellow-500" },
  };

  // ================= FETCH TABLES =================
  const fetchTables = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      const formatted = data
        .map((t) => ({
          number: t.tableCode?.replace("T", "") || "",
          tableCode: t.tableCode,
          capacity: t.capacity,
          status: t.status ? t.status.toLowerCase() : "available",
        }))
        .sort((a, b) =>
          a.tableCode.localeCompare(b.tableCode, undefined, {
            numeric: true,
          }),
        );

      setTables(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // ================= ADD TABLE =================
  const addTable = async () => {
    try {
      const tableCode = `T${newTable.number}`;

      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableCode,
          capacity: newTable.capacity,
        }),
      });

      setShowForm(false);
      setNewTable({ number: "", capacity: "" });
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UPDATE STATUS =================
  const updateTableStatus = async (tableCode, newStatus) => {
    try {
      await fetch(
        `${API}/${tableCode}/status?status=${newStatus.toUpperCase()}`,
        { method: "PUT" },
      );

      setTables((prev) =>
        prev.map((t) =>
          t.tableCode === tableCode ? { ...t, status: newStatus } : t,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH ORDERS =================
  const fetchOrders = async (tableCode) => {
    try {
      setLoadingOrders(true);
      setSelectedTable(tableCode);

      const res = await fetch(`${ORDER_API}/${tableCode}`);
      const data = await res.json();

      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const closeModal = () => {
    setSelectedTable(null);
    setOrders([]);
  };

  const getTableCount = (status) =>
    tables.filter((t) => t.status === status).length;

  const filteredTables =
    filter === "all" ? tables : tables.filter((t) => t.status === filter);

  return (
    <div className="space-y-6">
      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p>Available: {getTableCount("available")}</p>
        </Card>
        <Card className="p-6">
          <p>Occupied: {getTableCount("occupied")}</p>
        </Card>
        <Card className="p-6">
          <p>Reserved: {getTableCount("reserved")}</p>
        </Card>
      </div>

      {/* FILTER + ADD BUTTON */}
      <div className="flex justify-center gap-3 items-center flex-wrap">
        {["all", "available", "occupied", "reserved"].map((f) => (
          <Button
            key={f}
            onClick={() => setFilter(f)}
            variant={filter === f ? "default" : "outline"}
          >
            {f}
          </Button>
        ))}

        {/* ✅ ADD TABLE BUTTON (RESTORED) */}
        <Button
          variant="outline"
          className="bg-white text-black border flex items-center gap-2"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4" />
          Add Table
        </Button>
      </div>

      {/* ADD FORM */}
      {showForm && (
        <Card className="p-4 space-y-3 max-w-md mx-auto">
          <input
            type="number"
            placeholder="Table Number (e.g. 5)"
            value={newTable.number}
            onChange={(e) =>
              setNewTable({ ...newTable, number: e.target.value })
            }
            className="border p-2 w-full rounded"
          />
          <input
            type="number"
            placeholder="Capacity"
            value={newTable.capacity}
            onChange={(e) =>
              setNewTable({ ...newTable, capacity: e.target.value })
            }
            className="border p-2 w-full rounded"
          />

          <div className="flex gap-2">
            <Button onClick={addTable} className="flex-1">
              Save
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* TABLE GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTables.map((table) => {
          const config = statusConfig[table.status];

          return (
            <Card key={table.tableCode} className="p-4 space-y-3">
              <div className="text-center">
                <div
                  className={`w-14 h-14 mx-auto ${config.color} rounded-full flex items-center justify-center text-white`}
                >
                  {table.number}
                </div>
                <h3 className="font-semibold mt-2">{table.tableCode}</h3>
                <p className="text-sm">{table.capacity} seats</p>

                <Badge className={`${config.color} text-white w-full mt-2`}>
                  {config.label}
                </Badge>
              </div>

              {/* ACTION BUTTONS (WHITE) */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  className="bg-white border"
                  onClick={() =>
                    updateTableStatus(table.tableCode, "available")
                  }
                >
                  Free
                </Button>
                <Button
                  variant="outline"
                  className="bg-white border"
                  onClick={() => updateTableStatus(table.tableCode, "occupied")}
                >
                  Occupy
                </Button>
                <Button
                  variant="outline"
                  className="bg-white border"
                  onClick={() => updateTableStatus(table.tableCode, "reserved")}
                >
                  Reserve
                </Button>
              </div>

              {/* VIEW ORDERS */}
              <Button
                variant="outline"
                className="w-full bg-white border flex items-center justify-center gap-2"
                onClick={() => fetchOrders(table.tableCode)}
              >
                <ClipboardList className="w-4 h-4" />
                View Orders
              </Button>
            </Card>
          );
        })}
      </div>

      {/* MODAL */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-lg p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Orders - {selectedTable}</h2>

            {loadingOrders ? (
              <p>Loading...</p>
            ) : orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {orders.map((order) => (
                  <div key={order.id} className="border p-3 rounded">
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-sm">
                      Items: {order.items ? order.items.length : 0}
                    </p>
                    <p className="text-sm">Status: {order.status}</p>
                  </div>
                ))}
              </div>
            )}

            <Button className="mt-4 w-full" onClick={closeModal}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
