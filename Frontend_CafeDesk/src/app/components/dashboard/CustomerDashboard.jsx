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
  // ✅ default export
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
  /* ================= TABLE NUMBER ================= */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    setTableNumber(table || "T01");
  }, []);

  /* ================= FETCH MENU ================= */
  useEffect(() => {
    fetch(`${API_BASE}/customer/menu`)
      .then((res) => res.json())
      .then(setMenuItems)
      .catch(console.error);
  }, []);

  /* ================= FETCH BILLS ================= */
  const fetchBills = () => {
    if (!user || !token) return;

    fetch(`${API_BASE}/bills/customer/${user.username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setBills)
      .catch(console.error);
  };

  useEffect(() => {
    fetchBills();
  }, [user, token]);

  const userBills = bills;
  const pendingBills = userBills.filter((b) => b.status === "PENDING");
  const orderHistory = userBills.filter((b) => b.status === "APPROVED");

  /* ================= FETCH FEEDBACK ================= */
  const fetchFeedback = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/customer/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 403) {
        alert("Forbidden ❌ You are not authorized.");
        return;
      }

      if (!res.ok) return;

      const data = await res.json();
      setFeedbackList(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "feedback") {
      fetchFeedback();
    }
  }, [activeTab, token]);

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = async () => {
    if (currentOrder.length === 0) {
      alert("Add items before placing order.");
      return;
    }

    try {
      const orderItems = currentOrder.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      }));

      const finalTableNumber = tableNumber || "T01";

      const orderPayload = {
        customerName: user.username,
        tableNumber: finalTableNumber,
        amount: getTotalAmount(),
        items: orderItems,
      };

      console.log("Sending Order:", orderPayload);

      const response = await fetch(`${API_BASE}/customer/orders/place-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        alert("Failed to place order ❌");
        return;
      }

      const bill = await response.json();

      setBills((prev) => [...prev, bill]);

      clearOrder();

      alert("✅ Order placed successfully! Your order is being prepared ☕");

      setActiveTab("bills");
    } catch (error) {
      console.error("Order failed:", error);
      alert("Something went wrong while placing order ❌");
    }
  };
  /* ================= DOWNLOAD INVOICE ================= */
  const downloadInvoice = async (bill) => {
    try {
      const response = await fetch(`${API_BASE}/customer/invoice/${bill.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return alert("Failed to download invoice");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${bill.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Error downloading invoice");
    }
  };
  3;
  /* ================= FETCH CURRENT ORDERS FROM DB ================= */
  const fetchCurrentOrders = async () => {
    if (!user || !token) return;

    try {
      const res = await fetch(`${API_BASE}/customer/orders/${user.username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();
      setMyOrders(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "order") {
      fetchCurrentOrders();
    }
  }, [activeTab, token]);

  /* ================= SUBMIT FEEDBACK ================= */
  const submitFeedback = async () => {
    if (rating === 0) return alert("Please give rating ⭐");

    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/customer/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: user?.username,
          rating: Number(rating),
          remark: remark || "No comment",
        }),
      });

      if (res.status === 403) {
        alert("Forbidden ❌ You are not authorized.");
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.log(errorText);
        return alert("Failed to submit feedback");
      }

      const savedFeedback = await res.json();
      setFeedbackList((prev) => [savedFeedback, ...prev]);

      setRating(0);
      setRemark("");

      alert("✅ Thank you for your feedback ❤️");
    } catch (error) {
      console.error(error);
      alert("Server not reachable ❌");
    }
  };

  const orderCount = currentOrder.reduce((sum, item) => sum + item.quantity, 0);
  //Filter Logic Added Here
  const filteredMenu =
    categoryFilter === "ALL"
      ? menuItems
      : menuItems.filter(
          (item) =>
            item.category &&
            item.category.toLowerCase() === categoryFilter.toLowerCase(),
        );

  return (
    <div className="min-h-screen bg-[#FBF8F3]">
      {/* NAVBAR */}
      <div className="bg-[#6B4423] text-white px-6 py-4 flex justify-between items-center">
        <div className="flex gap-2 font-bold text-lg">
          <Coffee /> CafeDesk
        </div>

        {/* Center Quote */}
        <div className="text-center font-bold text-xl italic text-orange-200">
          “A café is where stories begin.”
        </div>

        <Button onClick={logout} variant="ghost" className="text-white">
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </Button>
      </div>

      {/* TABS */}
      <div className="flex justify-center gap-2 mt-6 flex-wrap">
        {[
          ["brew", "Brew & Bites", Coffee],
          ["order", "Current Order", ShoppingCart],
          ["bills", "Pending Bills", FileText],
          ["history", "Order History", History],
          ["feedback", "Feedback", MessageSquare],
        ].map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-md border flex items-center gap-2 ${
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

      <div className="max-w-7xl mx-auto px-6 py-6">
        <Card className="p-6">
          {/* BREW */}
          {activeTab === "brew" && (
            <>
              {/* FILTER BUTTONS */}
              <div className="flex gap-2 mb-6 flex-wrap justify-center">
                {[
                  { value: "ALL", label: "All" },
                  { value: "Beverages", label: "Beverages" },
                  {
                    value: "Breakfast and Brunch",
                    label: "Breakfast & Brunch",
                  },
                  { value: "Snacks", label: "Snacks" },
                  { value: "Desserts", label: "Desserts" },
                ].map((cat) => (
                  <Button
                    key={cat.value}
                    size="sm"
                    variant={
                      categoryFilter === cat.value ? "default" : "outline"
                    }
                    onClick={() => setCategoryFilter(cat.value)}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>

              {/* MENU GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredMenu.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md">
                    <img
                      src={`${IMAGE_BASE}${item.imagePath}`}
                      className="w-full h-40 object-cover"
                      alt={item.name}
                    />

                    <div className="p-4">
                      <h3 className="font-semibold text-[#6B4423]">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>

                      <div className="flex justify-between items-center mt-3">
                        {/* Price */}
                        <span className="font-bold text-orange-600">
                          ₹{item.price}
                        </span>

                        {/* Availability Status */}
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            item.availability
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.availability ? "Available" : "Out of Stock"}
                        </span>

                        {/* Add Button */}
                        <Button
                          size="sm"
                          disabled={!item.availability}
                          onClick={() => addToOrder(item)}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {activeTab === "order" && (
            <>
              {/* CURRENT CART */}
              {currentOrder.length === 0 ? (
                <p className="text-center text-gray-500">No items added yet.</p>
              ) : (
                <>
                  {currentOrder.map((item, i) => (
                    <div key={i} className="flex justify-between py-2 border-b">
                      <span>{item.name}</span>
                      <div className="flex items-center gap-2">
                        <Minus onClick={() => removeFromOrder(item)} />
                        {item.quantity}
                        <Plus onClick={() => addToOrder(item)} />
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between font-bold mt-4">
                    <span>Total</span>
                    <span>₹{getTotalAmount()}</span>
                  </div>

                  <Button className="w-full mt-4" onClick={handlePlaceOrder}>
                    Place Order
                  </Button>
                </>
              )}

              {/* CURRENT ORDERS FROM DATABASE */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-[#6B4423] mb-3">
                  Your Current Orders
                </h3>

                {myOrders.length === 0 ? (
                  <p className="text-gray-500 text-sm">No orders found.</p>
                ) : (
                  myOrders.map((order) => (
                    <Card key={order.id} className="p-4 mb-3 border">
                      <div className="flex justify-between">
                        <span className="font-medium">Order #{order.id}</span>
                        <span className="text-orange-600 font-semibold">
                          ₹{order.amount}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500 mt-1">
                        Table: {order.tableNumber}
                      </div>

                      <div className="mt-2">
                        {order.items?.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.name} x{item.quantity}
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </>
          )}

          {/* BILLS */}
          {activeTab === "bills" &&
            (pendingBills.length === 0 ? (
              <p className="text-center text-gray-500">No pending bills 🎉</p>
            ) : (
              pendingBills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex justify-between py-2 border-b"
                >
                  <span>INV-{bill.id}</span>
                  <Button size="sm" onClick={() => downloadInvoice(bill)}>
                    <Download className="w-4 h-4 mr-1" /> Invoice
                  </Button>
                </div>
              ))
            ))}

          {/* HISTORY */}
          {activeTab === "history" &&
            (orderHistory.length === 0 ? (
              <p className="text-center text-gray-500">
                No previous orders yet ☕
              </p>
            ) : (
              orderHistory.map((bill) => (
                <div
                  key={bill.id}
                  className="flex justify-between py-2 border-b"
                >
                  <span>INV-{bill.id}</span>
                  <Button size="sm" onClick={() => downloadInvoice(bill)}>
                    <Download className="w-4 h-4 mr-1" /> Invoice
                  </Button>
                </div>
              ))
            ))}

          {/* FEEDBACK */}
          {activeTab === "feedback" && (
            <div className="max-w-md mx-auto space-y-4">
              {/* ⭐ Rating */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    onClick={() => setRating(n)}
                    className={`cursor-pointer ${
                      rating >= n
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* 📝 Remark */}
              <Textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Write feedback..."
              />

              {/* 🚀 Submit */}
              <Button onClick={submitFeedback} className="w-full">
                Submit Feedback
              </Button>

              {/* 📋 Display Submitted Feedback */}
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-[#6B4423]">
                  Customer Feedback
                </h3>

                {feedbackList.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No feedback submitted yet.
                  </p>
                ) : (
                  feedbackList.map((fb) => (
                    <div
                      key={fb.id}
                      className="bg-white p-3 rounded-md shadow border"
                    >
                      <div className="flex gap-1">
                        {[...Array(fb.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-sm mt-1">{fb.remark}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(fb.date).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
