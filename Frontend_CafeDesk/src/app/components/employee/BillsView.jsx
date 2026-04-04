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

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const BillsView = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllBills();
  }, []);

  const fetchAllBills = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/all`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error(`Failed to fetch bills: ${res.status}`);

      const data = await res.json();
      setBills(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveBill = async (bill) => {
    try {
      const res = await fetch(`${API_BASE}/approve/${bill.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error(`Approve failed: ${res.status}`);

      const updatedBill = await res.json();

      setBills((prev) =>
        prev.map((b) => (b.id === updatedBill.id ? updatedBill : b)),
      );

      // ✅ Auto download invoice after approval
      downloadInvoice(updatedBill.id);
    } catch (err) {
      alert(`Error approving bill: ${err.message}`);
    }
  };

  const payBill = async (bill) => {
    try {
      const res = await fetch(`${API_BASE}/pay/${bill.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error(`Pay failed: ${res.status}`);

      const updatedBill = await res.json();

      setBills((prev) =>
        prev.map((b) => (b.id === updatedBill.id ? updatedBill : b)),
      );
    } catch (err) {
      alert(`Error paying bill: ${err.message}`);
    }
  };

  // ✅ BACKEND PDF DOWNLOAD
  const downloadInvoice = async (billId) => {
    try {
      const res = await fetch(`${INVOICE_API}/${billId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Failed to download invoice");

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${billId}.pdf`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error downloading invoice: " + err.message);
    }
  };

  // ✅ FIXED TOTALS
  const totalAmount = bills.reduce(
    (sum, bill) => sum + (bill.totalAmount ?? 0),
    0,
  );

  const pendingAmount = bills
    .filter((b) => b.status === "PENDING")
    .reduce((sum, bill) => sum + (bill.totalAmount ?? 0), 0);

  const paidAmount = bills
    .filter((b) => b.status === "PAID")
    .reduce((sum, bill) => sum + (bill.totalAmount ?? 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        Loading bills…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" onClick={fetchAllBills}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <DollarSign />
            <div>
              <p>Total</p>
              <p>₹{totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Clock />
            <div>
              <p>Pending</p>
              <p>₹{pendingAmount.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <CheckCircle />
            <div>
              <p>Paid</p>
              <p>₹{paidAmount.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* TABLE */}
      <Card>
        <div className="p-6 border-b">
          <h3 className="flex items-center gap-2">
            <FileText /> Employee Bill Approval
          </h3>
        </div>

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
              const isApproved = bill.status === "APPROVED";
              const isPaid = bill.status === "PAID";

              return (
                <TableRow key={bill.id}>
                  <TableCell>{bill.id}</TableCell>
                  <TableCell>{bill.invoiceNumber}</TableCell>
                  <TableCell>{bill.customerName}</TableCell>
                  <TableCell>{bill.tableNumber}</TableCell>
                  <TableCell>₹{bill.totalAmount?.toFixed(2)}</TableCell>

                  <TableCell>
                    {isPaid ? (
                      <Badge className="bg-green-600 text-white">Paid</Badge>
                    ) : isApproved ? (
                      <Badge className="bg-blue-500 text-white">Approved</Badge>
                    ) : (
                      <Badge className="bg-yellow-500 text-white">
                        Pending
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadInvoice(bill.id)}
                    >
                      <Printer className="w-4 h-4" />
                    </Button>

                    {bill.status === "PENDING" && (
                      <Button
                        size="sm"
                        className="bg-green-500 text-white"
                        onClick={() => approveBill(bill)}
                      >
                        Approve
                      </Button>
                    )}

                    {isApproved && (
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
      </Card>
    </div>
  );
};
