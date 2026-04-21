"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle, ChefHat } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

export const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // ✅ BACKEND → FRONTEND STATUS MAP (FIXED)
  const statusMap = {
    PENDING: "pending",
    PREPARING: "preparing",
    READY: "ready",
    COMPLETED: "completed",
  };

  const reverseStatusMap = {
    pending: "PENDING",
    preparing: "PREPARING",
    ready: "READY",
    completed: "COMPLETED",
  };

  const statusConfig = {
    pending: { label: "Pending", color: "bg-yellow-500", icon: Clock },
    preparing: { label: "Preparing", color: "bg-blue-500", icon: ChefHat },
    ready: { label: "Ready", color: "bg-green-500", icon: CheckCircle },
    completed: { label: "Completed", color: "bg-gray-500", icon: CheckCircle },
  };

  // ✅ FETCH
  useEffect(() => {
    fetch("http://localhost:8080/api/customer/orders/all")
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data) => {
        console.log("🔥 API RESPONSE:", data);

        const formatted = data.map((order) => ({
          id: order.id,
          tableNumber: order.tableNumber || "-",
          customerName: order.customerName || "Guest",
          timestamp: order.createdAt || new Date(),

          // ✅ FIXED STATUS
          status: statusMap[order.status] || "pending",

          items:
            order.items?.map((item) => ({
              itemName: item.name,
              quantity: item.quantity,
              price: item.price,
            })) || [],

          total: order.amount || 0,
        }));

        setOrders(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  // ✅ UPDATE STATUS (FIXED)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const backendStatus = reverseStatusMap[newStatus];

      await fetch(
        `http://localhost:8080/api/customer/orders/${orderId}/status?status=${backendStatus}`,
        { method: "PUT" },
      );

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500">Loading orders...</p>
      )}

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          const count = orders.filter((o) => o.status === status).length;

          return (
            <Card
              key={status}
              className="p-6 cursor-pointer hover:shadow-lg border-[#E8D5BF]"
              onClick={() => setFilter(status)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 ${config.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[#8B6F47]">{config.label}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ================= FILTER ================= */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => setFilter("all")}>All Orders</Button>

        {Object.entries(statusConfig).map(([status, config]) => (
          <Button key={status} onClick={() => setFilter(status)}>
            {config.label}
          </Button>
        ))}
      </div>

      {/* ================= ORDERS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredOrders.map((order) => {
          const StatusIcon = statusConfig[order.status]?.icon;

          return (
            <Card key={order.id} className="p-6 border-[#E8D5BF]">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-bold">#{order.id}</h3>
                  <p>
                    Table {order.tableNumber} • {order.customerName}
                  </p>
                  <p className="text-xs">
                    {new Date(order.timestamp).toLocaleTimeString()}
                  </p>
                </div>

                <Badge
                  className={`${statusConfig[order.status]?.color} text-white`}
                >
                  {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                  {statusConfig[order.status]?.label}
                </Badge>
              </div>

              {/* ITEMS */}
              <div>
                {order.items.length === 0 ? (
                  <p className="text-gray-400">No items</p>
                ) : (
                  order.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.itemName}
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>

              {/* TOTAL */}
              <div className="mt-4 flex justify-between">
                <b>Total: ₹{order.total.toFixed(2)}</b>

                <div>
                  {order.status === "pending" && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                    >
                      Start
                    </Button>
                  )}
                  {order.status === "preparing" && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, "ready")}
                    >
                      Ready
                    </Button>
                  )}
                  {order.status === "ready" && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, "completed")}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* EMPTY */}
      {!loading && filteredOrders.length === 0 && (
        <Card className="p-10 text-center">
          <AlertCircle className="mx-auto mb-2" />
          <p>No orders found</p>
        </Card>
      )}
    </div>
  );
};
