"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

const API = "http://localhost:8080/api/employee/tables";

// ✅ FIXED ENDPOINT
const ORDER_API = "http://localhost:8080/api/customer/orders/table";

export const TablesView = () => {
  const [tables, setTables] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedTable, setSelectedTable] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState(null);

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
          // ✅ Clean number (T01 → 1)
          number: parseInt(t.tableCode?.replace("T", "")) || "",
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
      console.error("❌ Table fetch error:", err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // ================= FETCH ORDERS =================
  const fetchOrders = async (tableCode) => {
    try {
      setLoadingOrders(true);
      setError(null);

      // 🔥 FIX: Convert T1 → T01
      let number = tableCode.replace("T", "");
      number = number.padStart(2, "0");
      const normalized = `T${number}`;

      setSelectedTable(normalized);

      const res = await fetch(`${ORDER_API}/${normalized}`);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch orders");
      }

      const data = await res.json();

      console.log("📦 Orders:", data);

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ FETCH ERROR:", err.message);
      setError(err.message); // ✅ show real error
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const closeModal = () => {
    setSelectedTable(null);
    setOrders([]);
    setError(null);
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

      {/* FILTER + ADD */}
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

        <Button
          variant="outline"
          className="bg-white text-black border flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Table
        </Button>
      </div>

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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-lg">
            <h2 className="text-xl font-bold mb-4">Orders - {selectedTable}</h2>

            {loadingOrders ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border p-3 rounded">
                    <p className="font-semibold">Order #{order.id}</p>
                    <p>Items: {order.items?.length || 0}</p>
                    <p>Status: {order.status}</p>
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
