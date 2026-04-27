"use client";

import { useState } from "react";
import { Users, CheckCircle, Clock, Plus } from "lucide-react";
import { tables as initialTables } from "@/app/utils/mockData";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

export const TablesView = () => {
  const [tables, setTables] = useState(initialTables);
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

  const updateTableStatus = (tableNumber, newStatus) => {
    setTables(
      tables.map((table) =>
        table.number === tableNumber ? { ...table, status: newStatus } : table,
      ),
    );
  };

  const getTableCount = (status) => {
    return tables.filter((t) => t.status === status).length;
  };

  const filteredTables =
    filter === "all" ? tables : tables.filter((t) => t.status === filter);

  const handleAddTable = () => {
    if (!newTable.number || !newTable.capacity) return;

    const newEntry = {
      number: Number(newTable.number),
      capacity: Number(newTable.capacity),
      status: "available",
    };

    setTables([...tables, newEntry]);
    setNewTable({ number: "", capacity: "" });
    setShowForm(false);
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

      {/* ✅ FILTER + ADD (CENTERED & SAME SIZE) */}
      <div className="flex justify-center">
        <div className="flex flex-wrap items-center gap-3 bg-[#F5E6D3] p-3 rounded-xl border border-[#E8D5BF]">
          {["all", "available", "occupied", "reserved"].map((f) => (
            <Button
              key={f}
              size="default"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className="capitalize min-w-[110px] h-10"
            >
              {f}
            </Button>
          ))}

          <Button
            onClick={() => setShowForm(true)}
            size="default"
            className="min-w-[130px] h-10 bg-[#2C1810] text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Table
          </Button>
        </div>
      </div>

      {/* ADD TABLE MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 space-y-4">
            <h2 className="text-lg font-semibold">Add Table</h2>

            <input
              type="number"
              placeholder="Table Number"
              value={newTable.number}
              onChange={(e) =>
                setNewTable({ ...newTable, number: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Capacity"
              value={newTable.capacity}
              onChange={(e) =>
                setNewTable({ ...newTable, capacity: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTable}>Add</Button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTables.map((table) => {
          const config = statusConfig[table.status];

          return (
            <Card
              key={table.number}
              className={`p-6 border-2 ${
                table.status === "available"
                  ? "border-green-200"
                  : table.status === "occupied"
                    ? "border-red-200"
                    : "border-yellow-200"
              }`}
            >
              <div className="text-center space-y-4">
                <div
                  className={`w-16 h-16 mx-auto ${config.color} rounded-full flex items-center justify-center text-white text-xl font-bold`}
                >
                  {table.number}
                </div>

                <div>
                  <h3 className="font-semibold">Table {table.number}</h3>
                  <p className="text-sm text-[#8B6F47] flex justify-center items-center gap-1">
                    <Users className="w-3 h-3" />
                    {table.capacity} seats
                  </p>
                </div>

                <Badge
                  className={`${config.color} text-white w-full justify-center`}
                >
                  {config.label}
                </Badge>

                <div className="space-y-2">
                  {table.status === "available" && (
                    <>
                      <Button
                        onClick={() =>
                          updateTableStatus(table.number, "occupied")
                        }
                        className="w-full bg-red-500 text-white"
                      >
                        Occupy
                      </Button>
                      <Button
                        onClick={() =>
                          updateTableStatus(table.number, "reserved")
                        }
                        variant="outline"
                        className="w-full"
                      >
                        Reserve
                      </Button>
                    </>
                  )}

                  {table.status === "occupied" && (
                    <Button
                      onClick={() =>
                        updateTableStatus(table.number, "available")
                      }
                      className="w-full bg-green-500 text-white"
                    >
                      Clear Table
                    </Button>
                  )}

                  {table.status === "reserved" && (
                    <>
                      <Button
                        onClick={() =>
                          updateTableStatus(table.number, "occupied")
                        }
                        className="w-full bg-red-500 text-white"
                      >
                        Check In
                      </Button>
                      <Button
                        onClick={() =>
                          updateTableStatus(table.number, "available")
                        }
                        variant="outline"
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
