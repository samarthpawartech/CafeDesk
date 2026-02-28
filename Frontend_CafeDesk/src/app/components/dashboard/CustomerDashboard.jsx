"use client";

import { useState, useEffect, useRef } from "react";
import {
  Coffee,
  ShoppingCart,
  FileText,
  History,
  MessageSquare,
  LogOut,
  CheckCircle,
  Star,
  Download,
  Plus,
  Minus,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Textarea } from "@/app/components/ui/textarea";
import CafeDeskInvoice from "@/app/components/CafeDeskInvoice";

const API_BASE = "http://localhost:8080/api";
const IMAGE_BASE = "http://localhost:8080";

export const CustomerDashboard = () => {
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
  const [invoiceBill, setInvoiceBill] = useState(null);

  const invoiceRef = useRef(null);

  /* ================= TABLE NUMBER ================= */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    setTableNumber(table || "T01"); // fallback for testing
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

    fetch(`${API_BASE}/customer/bills/${user.username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setBills)
      .catch(console.error);
  };

  useEffect(() => {
    fetchBills();
  }, [user, token]);

  const userBills = bills.filter((b) => b.customerName === user?.username);
  const pendingBills = userBills.filter((b) => b.status === "pending");
  const cashPendingBills = userBills.filter(
    (b) => b.status === "pending" && b.paymentMode === "cash_pending",
  );
  const orderHistory = userBills.filter((b) => b.status === "paid");

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = async () => {
    if (currentOrder.length === 0)
      return alert("Add items before placing order.");
    if (!tableNumber) return alert("Table number missing. Scan QR again.");

    try {
      const orderItems = currentOrder.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      }));

      const res = await fetch(`${API_BASE}/customer/place-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: user.username,
          tableNumber,
          amount: getTotalAmount(),
          items: orderItems,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Backend error:", err);
        return alert(
          `Failed to place order: ${err.message || res.statusText} (status ${res.status})`,
        );
      }

      const bill = await res.json();
      setBills((prev) => [...prev, bill]);
      clearOrder();
      setActiveTab("bills");
    } catch (err) {
      console.error("Network or server error:", err);
      alert("Failed to place order: network or server error");
    }
  };

  /* ================= DOWNLOAD INVOICE ================= */
  const downloadInvoice = async (bill) => {
    setInvoiceBill(bill);

    setTimeout(async () => {
      const pdf = new jsPDF("p", "pt", "a4");
      await pdf.html(invoiceRef.current, { scale: 0.8 });
      pdf.save(`invoice-${bill.id}.pdf`);
    }, 300);
  };

  /* ================= FEEDBACK ================= */
  const submitFeedback = async () => {
    if (rating === 0) return alert("Please give rating ⭐");

    try {
      await fetch(`${API_BASE}/customer/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: user.username,
          rating,
          remark: remark || "No comment",
        }),
      });

      setRating(0);
      setRemark("");
      alert("Thank you for your feedback ❤️");
    } catch (err) {
      console.error("Feedback error:", err);
      alert("Failed to submit feedback");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3]">
      {/* NAVBAR */}
      <div className="bg-[#6B4423] text-white px-6 py-4 flex justify-between">
        <div className="flex gap-2 font-bold text-lg">
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
          ["cash", "Pay by Cash", FileText],
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
          {/* BREW TAB */}
          {activeTab === "brew" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={`${IMAGE_BASE}${item.imagePath}`}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-[#6B4423]">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                    <div className="flex justify-between items-center mt-3">
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
          )}

          {/* CURRENT ORDER */}
          {activeTab === "order" && (
            <div>
              {currentOrder.length === 0 ? (
                <p className="text-center text-gray-500">No items added yet.</p>
              ) : (
                <>
                  {currentOrder.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b py-3"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => removeFromOrder(item)}>
                          <Minus className="w-4 h-4" />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => addToOrder(item)}>
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between mt-4 font-bold">
                    <span>Total</span>
                    <span>₹{getTotalAmount()}</span>
                  </div>

                  <Button className="mt-4 w-full" onClick={handlePlaceOrder}>
                    Place Order
                  </Button>
                </>
              )}
            </div>
          )}

          {/* PENDING BILLS */}
          {activeTab === "bills" &&
            pendingBills.map((bill) => (
              <div key={bill.id} className="flex justify-between border-b py-2">
                <span>INV-{bill.id}</span>
                <div className="flex gap-2 items-center">
                  <CheckCircle className="text-orange-600 w-4 h-4" />₹
                  {bill.amount}
                  <Button size="sm" onClick={() => downloadInvoice(bill)}>
                    <Download className="w-4 h-4 mr-1" /> Invoice
                  </Button>
                </div>
              </div>
            ))}

          {/* ORDER HISTORY */}
          {activeTab === "history" &&
            orderHistory.map((bill) => (
              <div key={bill.id} className="flex justify-between border-b py-2">
                <span>INV-{bill.id}</span>
                <div className="flex gap-2 items-center">
                  <CheckCircle className="text-green-600 w-4 h-4" />₹
                  {bill.amount}
                  <Button size="sm" onClick={() => downloadInvoice(bill)}>
                    <Download className="w-4 h-4 mr-1" /> Invoice
                  </Button>
                </div>
              </div>
            ))}

          {/* FEEDBACK */}
          {activeTab === "feedback" && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="flex justify-center gap-2">
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
                placeholder="Write your experience..."
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />

              <Button onClick={submitFeedback} className="w-full">
                Submit Feedback
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* HIDDEN INVOICE */}
      {invoiceBill && (
        <div style={{ position: "absolute", left: "-9999px" }}>
          <div ref={invoiceRef}>
            <CafeDeskInvoice
              invoiceNumber={`INV-${invoiceBill.id}`}
              createdDate={invoiceBill.date}
              customer={{
                name: invoiceBill.customerName,
                table: invoiceBill.tableNumber,
              }}
              items={invoiceBill.items || currentOrder}
            />
          </div>
        </div>
      )}
    </div>
  );
};
