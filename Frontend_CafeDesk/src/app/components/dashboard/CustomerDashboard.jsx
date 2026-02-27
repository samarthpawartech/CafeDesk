"use client";

import { useState, useEffect } from "react";
import {
  Coffee,
  ShoppingCart,
  FileText,
  History,
  MessageSquare,
  LogOut,
  Plus,
  Trash2,
  CheckCircle,
  Star,
  Download,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { useAuth } from "@/app/context/AuthContext";
import { menuItems, bills as mockBills } from "@/app/utils/mockData";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Textarea } from "@/app/components/ui/textarea";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export const CustomerDashboard = () => {
  const {
    user,
    logout,
    currentOrder,
    addToOrder,
    removeFromOrder,
    getTotalAmount,
    clearOrder,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("brew");
  const [bills, setBills] = useState(mockBills);
  const [rating, setRating] = useState(0);
  const [remark, setRemark] = useState("");
  const [tableNumber, setTableNumber] = useState(""); // ✅ TABLE FROM QR

  /* ✅ AUTO READ TABLE NUMBER FROM QR URL (?table=T01) */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    if (table) setTableNumber(table);
  }, []);

  const cartCount = currentOrder.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const userBills = bills.filter((b) => b.customerName === user?.username);
  const pendingBills = userBills.filter((b) => b.status === "pending");
  const orderHistory = userBills.filter((b) => b.status === "paid");

  /* ---------------- PLACE ORDER ---------------- */
  const handlePlaceOrder = () => {
    if (currentOrder.length === 0) return;
    if (!tableNumber) return alert("Table number missing. Scan QR again.");

    const newBill = {
      id: `INV-${Date.now()}`,
      customerName: user?.username,
      tableNumber, // ✅ AUTO FROM QR
      amount: getTotalAmount(),
      status: "pending",
      date: new Date().toLocaleString(),
    };

    setBills((prev) => [...prev, newBill]);
    clearOrder();
    setActiveTab("bills");
    alert(`Order placed for Table ${tableNumber}`);
  };

  /* ---------------- INVOICE ---------------- */
  const downloadInvoice = (bill) => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("CafeDesk Invoice", 20, 20);
    pdf.setFontSize(12);
    pdf.text(`Invoice ID: ${bill.id}`, 20, 40);
    pdf.text(`Customer: ${bill.customerName}`, 20, 50);
    pdf.text(`Table Number: ${bill.tableNumber}`, 20, 60);
    pdf.text(`Date: ${bill.date}`, 20, 70);
    pdf.text(`Amount Paid: ₹${bill.amount}`, 20, 80);
    pdf.save(`${bill.id}.pdf`);
  };

  /* ---------------- FEEDBACK ---------------- */
  const submitFeedback = () => {
    if (rating === 0) return alert("Please give rating ⭐");
    alert(`Thanks for rating ${rating} ⭐`);
    setRating(0);
    setRemark("");
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3]">
      {/* NAVBAR */}
      <div className="bg-[#6B4423] text-white px-6 py-4 flex justify-between">
        <div className="flex gap-2 font-bold">
          <Coffee /> CafeDesk
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
            className={`relative px-4 py-2 rounded-md border flex items-center gap-2 ${
              activeTab === id
                ? "bg-[#6B4423] text-white"
                : "bg-white text-[#6B4423]"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {id === "order" && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Card className="p-6">
          {/* BREW */}
          {activeTab === "brew" && (
            <div className="grid md:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <Card key={item.id} className="p-4 space-y-2">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="h-40 w-full object-cover rounded"
                  />
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">₹{item.price}</span>
                    <Button size="sm" onClick={() => addToOrder(item)}>
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* CURRENT ORDER */}
          {activeTab === "order" && (
            <div className="space-y-4">
              {currentOrder.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b pb-2"
                >
                  <div>
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => removeFromOrder(item.id)}
                  >
                    <Trash2 className="text-red-500 w-4 h-4" />
                  </Button>
                </div>
              ))}

              {currentOrder.length > 0 && (
                <div className="flex justify-between pt-4">
                  <p className="font-bold">
                    Table: {tableNumber} | Total: ₹{getTotalAmount()}
                  </p>
                  <Button onClick={handlePlaceOrder}>Place Order</Button>
                </div>
              )}
            </div>
          )}

          {/* PENDING BILLS */}
          {activeTab === "bills" &&
            pendingBills.map((bill) => (
              <div key={bill.id} className="flex justify-between border-b py-2">
                <div>
                  <p className="font-semibold">{bill.id}</p>
                  <p className="text-sm text-gray-500">
                    Table {bill.tableNumber} | ₹{bill.amount}
                  </p>
                </div>
                <span className="text-orange-600 font-semibold">
                  ⏳ Pending Approval
                </span>
              </div>
            ))}

          {/* ORDER HISTORY */}
          {activeTab === "history" &&
            orderHistory.map((bill) => (
              <div key={bill.id} className="flex justify-between border-b py-2">
                <span>{bill.id}</span>
                <div className="flex gap-2 items-center">
                  <CheckCircle className="text-green-600 w-4 h-4" />₹
                  {bill.amount}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadInvoice(bill)}
                  >
                    <Download className="w-4 h-4 mr-1" /> Invoice
                  </Button>
                </div>
              </div>
            ))}

          {/* FEEDBACK */}
          {activeTab === "feedback" && (
            <div className="flex flex-col items-center space-y-5 max-w-md mx-auto">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    onClick={() => setRating(n)}
                    className={`w-7 h-7 cursor-pointer ${
                      rating >= n
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <Textarea
                placeholder="Optional remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full"
              />

              <Button className="px-10" onClick={submitFeedback}>
                Submit Feedback
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
