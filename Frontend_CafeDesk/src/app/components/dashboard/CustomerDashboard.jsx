"use client";

import { useState, useEffect } from "react";
import {
  Coffee,
  ShoppingCart,
  FileText,
  History,
  MessageSquare,
  LogOut,
  Star,
  Download,
  Plus,
  Minus,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Textarea } from "@/app/components/ui/textarea";

const API_BASE = "http://localhost:8080/api";
const IMAGE_BASE = "http://localhost:8080";

export default function CustomerDashboard() {
  const {
    user,
    logout,
    token,
    currentOrder,
    addToOrder,
    removeFromOrder,
    getTotalAmount,
    clearOrder,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("brew");
  const [menuItems, setMenuItems] = useState([]);
  const [bills, setBills] = useState([]);
  const [rating, setRating] = useState(0);
  const [remark, setRemark] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [myOrders, setMyOrders] = useState([]);

  /* ================= TABLE ================= */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTableNumber(params.get("table") || "T01");
  }, []);

  /* ================= MENU ================= */
  useEffect(() => {
    fetch(`${API_BASE}/customer/menu`)
      .then((res) => res.json())
      .then(setMenuItems)
      .catch(console.error);
  }, []);

  /* ================= FILTER ================= */
  const filteredMenu =
    categoryFilter === "ALL"
      ? menuItems
      : menuItems.filter((item) =>
          item.category?.toLowerCase().includes(categoryFilter.toLowerCase()),
        );

  /* ================= ORDER ================= */
  const handlePlaceOrder = async () => {
    if (!currentOrder.length) return alert("Add items first");

    try {
      const response = await fetch(`${API_BASE}/bills/place-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: user.username,
          tableNumber,
          amount: getTotalAmount(),
          items: currentOrder,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        return alert(err);
      }

      clearOrder();
      alert("Order placed ✅");
      setActiveTab("order");
    } catch {
      alert("Error placing order ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3]">
      {/* ================= NAVBAR ================= */}
      <div className="bg-[#f4c8a4] px-4 md:px-6 py-3 flex flex-col md:flex-row items-center gap-3 md:gap-0">
        {/* LOGO */}
        <img
          src="/assets/CafeDesklogo.png"
          className="w-[150px] md:w-[220px]"
        />

        {/* QUOTE */}
        <div className="flex-1 text-center font-bold italic text-black text-sm md:text-2xl">
          “A café is where stories begin.”
        </div>

        {/* LOGOUT */}
        <Button onClick={logout} variant="ghost" className="text-black">
          <LogOut className="w-5 h-5 mr-1" />
          Logout
        </Button>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex justify-center">
        <div className="flex gap-2 overflow-x-auto px-4 py-4 scrollbar-hide">
          {[
            ["brew", "Brew", Coffee],
            ["order", "Order", ShoppingCart],
            ["bills", "Bills", FileText],
            ["history", "History", History],
            ["feedback", "Feedback", MessageSquare],
          ].map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md whitespace-nowrap ${
                activeTab === id
                  ? "bg-[#6B4423] text-white"
                  : "bg-white text-[#6B4423]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-10">
        <Card className="p-4 md:p-6">
          {/* ================= BREW ================= */}
          {activeTab === "brew" && (
            <>
              {/* FILTER */}
              <div className="flex flex-wrap justify-center items-center gap-3 mb-4 max-w-xl mx-auto">
                {["ALL", "Beverages", "Snacks", "Desserts"].map((cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={categoryFilter === cat ? "default" : "outline"}
                    onClick={() => setCategoryFilter(cat)}
                    className="px-4"
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMenu.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow">
                    <img
                      src={`${IMAGE_BASE}${item.imagePath}`}
                      className="w-full h-40 object-cover"
                    />

                    <div className="p-3">
                      <h3 className="font-semibold">{item.name}</h3>

                      <p className="text-sm text-gray-500 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-orange-600">
                          ₹{item.price}
                        </span>

                        <Button size="sm" onClick={() => addToOrder(item)}>
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ================= ORDER ================= */}
          {activeTab === "order" && (
            <>
              {currentOrder.length === 0 ? (
                <p className="text-center text-gray-500">No items</p>
              ) : (
                <>
                  {currentOrder.map((item, i) => (
                    <div key={i} className="flex justify-between py-2 border-b">
                      <span>{item.name}</span>

                      <div className="flex gap-2 items-center">
                        <button onClick={() => removeFromOrder(item)}>
                          <Minus />
                        </button>

                        <span>{item.quantity || 1}</span>

                        <button onClick={() => addToOrder(item)}>
                          <Plus />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between mt-4 font-bold">
                    <span>Total</span>
                    <span>₹{getTotalAmount()}</span>
                  </div>

                  <Button className="w-full mt-4" onClick={handlePlaceOrder}>
                    Place Order
                  </Button>
                </>
              )}
            </>
          )}

          {/* ================= FEEDBACK ================= */}
          {activeTab === "feedback" && (
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    onClick={() => setRating(n)}
                    className={
                      rating >= n
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              <Textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Write feedback..."
              />

              <Button className="w-full">Submit</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
