"use client";

import { useState, useEffect } from "react";
import { Users, CheckCircle, Clock, Plus } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

const API = "http://localhost:8080/api/employee/tables";

export const TablesView = () => {
  const [tables, setTables] = useState([]);
  const [filter, setFilter] = useState("all");
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

  // ✅ FETCH + PROPER SORT
  const fetchTables = async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) return;

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
        ); // 🔥 FIXED SORT

      setTables(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // ✅ UPDATE WITHOUT REORDER
  const updateTableStatus = async (tableCode, newStatus) => {
    try {
      const res = await fetch(
        `${API}/${tableCode}/status?status=${newStatus.toUpperCase()}`,
        { method: "PUT" },
      );

      if (!res.ok) return;

      setTables((prev) =>
        prev.map((t) =>
          t.tableCode === tableCode ? { ...t, status: newStatus } : t,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getTableCount = (status) =>
    tables.filter((t) => t.status === status).length;

  const filteredTables =
    filter === "all" ? tables : tables.filter((t) => t.status === filter);

  const handleAddTable = async () => {
    if (!newTable.number || !newTable.capacity) return;

    const tableCode = `T${String(newTable.number).padStart(2, "0")}`;

    try {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableCode,
          capacity: Number(newTable.capacity),
          status: "AVAILABLE",
        }),
      });

      setNewTable({ number: "", capacity: "" });
      setShowForm(false);
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-[#E8D5BF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-white" />
            </div>
            <div>
              <p className="text-sm text-[#8B6F47]">Available</p>
              <p className="text-2xl font-bold">{getTableCount("available")}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#E8D5BF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <Users className="text-white" />
            </div>
            <div>
              <p className="text-sm text-[#8B6F47]">Occupied</p>
              <p className="text-2xl font-bold">{getTableCount("occupied")}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#E8D5BF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="text-white" />
            </div>
            <div>
              <p className="text-sm text-[#8B6F47]">Reserved</p>
              <p className="text-2xl font-bold">{getTableCount("reserved")}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* FILTER */}
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-3 bg-[#F5E6D3] p-3 rounded-xl border border-[#E8D5BF]">
          {["all", "available", "occupied", "reserved"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className="capitalize min-w-[110px]"
            >
              {f}
            </Button>
          ))}

          <Button
            onClick={() => setShowForm(true)}
            className="min-w-[130px] bg-[#2C1810] text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Table
          </Button>
        </div>
      </div>

      {/* TABLE GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTables.map((table) => {
          const config = statusConfig[table.status];
          if (!config) return null;

          return (
            <Card key={table.tableCode} className="p-6 border-2">
              <div className="text-center space-y-4">
                <div
                  className={`w-16 h-16 mx-auto ${config.color} rounded-full flex items-center justify-center text-white text-xl font-bold`}
                >
                  {table.number}
                </div>

                <h3 className="font-semibold">{table.tableCode}</h3>

                <p className="text-sm text-[#8B6F47] flex justify-center gap-1">
                  <Users className="w-3 h-3" />
                  {table.capacity} seats
                </p>

                <Badge className={`${config.color} text-white w-full`}>
                  {config.label}
                </Badge>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  <Button
                    size="sm"
                    className="w-full bg-white text-black border"
                    onClick={() =>
                      updateTableStatus(table.tableCode, "available")
                    }
                  >
                    Free
                  </Button>

                  <Button
                    size="sm"
                    className="w-full bg-white text-black border"
                    onClick={() =>
                      updateTableStatus(table.tableCode, "occupied")
                    }
                  >
                    Occupy
                  </Button>

                  <Button
                    size="sm"
                    className="w-full bg-white text-black border"
                    onClick={() =>
                      updateTableStatus(table.tableCode, "reserved")
                    }
                  >
                    Reserve
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
