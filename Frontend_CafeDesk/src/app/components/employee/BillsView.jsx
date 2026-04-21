"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  Printer,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

const API_BASE = "http://localhost:8080/api/bills";
const INVOICE_API = "http://localhost:8080/api/customer/invoice";

// ✅ AUTH HEADERS
const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ GET USERNAME
const getUsername = () => {
  if (typeof window === "undefined") return null;
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.username || null;
};

export const BillsView = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBills();
  }, []);

  // ================= FETCH =================
  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);

      const username = getUsername();

      if (!username) {
        throw new Error("User not found ❌");
      }

      console.log("📡 Fetching bills for:", username);

      // ✅ FIXED API
      const res = await fetch(`${API_BASE}/user/${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });

      console.log("📊 STATUS:", res.status);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }

      const data = await res.json();

      console.log("✅ DATA:", data);

      setBills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= HELPERS =================
  const getStatus = (status) => status?.toUpperCase();

  const isPaidOrApproved = (status) =>
    ["PAID", "APPROVED"].includes(getStatus(status));

  const getStatusLabel = (status) =>
    getStatus(status) === "APPROVED" ? "Paid" : getStatus(status) || "Pending";

  // ================= APPROVE =================
  const approveBill = async (bill) => {
    try {
      const res = await fetch(`${API_BASE}/approve/${bill.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Approve failed");

      await fetchBills();
      downloadInvoice(bill.id);
    } catch (err) {
      alert(err.message);
    }
  };

  // ================= PAY =================
  const payBill = async (bill) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/payment/create-order/${bill.id}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        },
      );

      if (!res.ok) throw new Error("Payment API failed");

      const data = await res.json();

      if (!window.Cashfree) {
        alert("Cashfree SDK not loaded ❌");
        return;
      }

      const cashfree = new window.Cashfree({ mode: "sandbox" });

      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_modal",
      });

      setTimeout(fetchBills, 4000);
    } catch (err) {
      alert("Payment Error ❌ " + err.message);
    }
  };

  // ================= DOWNLOAD =================
  const downloadInvoice = async (billId) => {
    try {
      const res = await fetch(`${INVOICE_API}/${billId}`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${billId}.pdf`;
      a.click();
    } catch {
      alert("Download error ❌");
    }
  };

  // ================= CALCULATIONS =================
  const totalAmount = bills.reduce((sum, b) => sum + (b.totalAmount ?? 0), 0);

  const pendingAmount = bills
    .filter((b) => getStatus(b.status) === "PENDING")
    .reduce((sum, b) => sum + (b.totalAmount ?? 0), 0);

  const paidAmount = bills
    .filter((b) => isPaidOrApproved(b.status))
    .reduce((sum, b) => sum + (b.totalAmount ?? 0), 0);

  // ================= UI =================
  if (loading) {
    return <div className="flex justify-center h-40">Loading bills…</div>;
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchBills}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6">
          <DollarSign />
          <p>Total ₹{totalAmount.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <Clock />
          <p>Pending ₹{pendingAmount.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <CheckCircle />
          <p>Paid ₹{paidAmount.toFixed(2)}</p>
        </Card>
      </div>

      {/* TABLE */}
      <Card>
        <div className="p-6 border-b flex gap-2 items-center">
          <FileText /> Customer Bills
        </div>

        {bills.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No bills found 🚫</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {bills.map((bill) => {
                const status = getStatus(bill.status);

                return (
                  <TableRow key={bill.id}>
                    <TableCell>{bill.id}</TableCell>
                    <TableCell>{bill.invoiceNumber}</TableCell>
                    <TableCell>{bill.customerName}</TableCell>
                    <TableCell>{bill.tableNumber}</TableCell>
                    <TableCell>₹{bill.totalAmount?.toFixed(2)}</TableCell>

                    <TableCell>
                      <Badge
                        className={
                          isPaidOrApproved(status)
                            ? "bg-green-600 text-white"
                            : "bg-yellow-500 text-white"
                        }
                      >
                        {getStatusLabel(status)}
                      </Badge>
                    </TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadInvoice(bill.id)}
                      >
                        <Printer className="w-4 h-4" />
                      </Button>

                      {status === "PENDING" && (
                        <Button
                          size="sm"
                          className="bg-green-500 text-white"
                          onClick={() => approveBill(bill)}
                        >
                          Approve
                        </Button>
                      )}

                      {status === "APPROVED" && (
                        <Button
                          size="sm"
                          className="bg-blue-500 text-white"
                          onClick={() => payBill(bill)}
                        >
                          Pay
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};
