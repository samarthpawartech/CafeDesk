"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  Printer,
} from "lucide-react";
import { jsPDF } from "jspdf";
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

export const BillsView = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- FETCH ALL BILLS ON MOUNT ---------------- */
  useEffect(() => {
    fetchAllBills();
  }, []);

  const fetchAllBills = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/all`);
      if (!res.ok) throw new Error(`Failed to fetch bills: ${res.status}`);
      const data = await res.json();
      setBills(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- APPROVE BILL (EMPLOYEE) ---------------- */
  const approveBill = async (bill) => {
    try {
      const res = await fetch(`${API_BASE}/approve/${bill.id}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error(`Approve failed: ${res.status}`);
      const updatedBill = await res.json();

      setBills((prev) =>
        prev.map((b) => (b.id === updatedBill.id ? updatedBill : b)),
      );

      generateInvoice(updatedBill);
    } catch (err) {
      alert(`Error approving bill: ${err.message}`);
    }
  };

  /* ---------------- PAY BILL ---------------- */
  const payBill = async (bill) => {
    try {
      const res = await fetch(`${API_BASE}/pay/${bill.id}`, {
        method: "PUT",
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

  /* ---------------- AUTO INVOICE ---------------- */
  const generateInvoice = (bill) => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("CafeDesk Invoice", 20, 20);
    pdf.setFontSize(12);
    pdf.text(`Invoice ID: ${bill.id}`, 20, 40);
    pdf.text(`Customer: ${bill.customerName}`, 20, 50);
    pdf.text(`Table: ${bill.tableNumber}`, 20, 60);
    pdf.text(`Amount Paid: ₹${bill.amount}`, 20, 70);
    pdf.text(
      `Approved At: ${bill.approvedAt ?? new Date().toLocaleString()}`,
      20,
      80,
    );
    pdf.save(`${bill.id}.pdf`);
  };

  /* ---------------- SUMMARY CALCULATIONS ---------------- */
  const totalAmount = bills.reduce((sum, bill) => sum + (bill.amount ?? 0), 0);
  const pendingAmount = bills
    .filter((b) => b.status === "PENDING")
    .reduce((sum, bill) => sum + (bill.amount ?? 0), 0);
  const paidAmount = bills
    .filter((b) => b.status === "PAID" || b.status === "APPROVED")
    .reduce((sum, bill) => sum + (bill.amount ?? 0), 0);

  /* ---------------- RENDER ---------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-[#8B6F47]">
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
        <Card className="p-6 border-[#E8D5BF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#6B4423] rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#8B6F47]">Total Bills</p>
              <p className="text-2xl font-bold text-[#2C1810]">
                ₹{totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#E8D5BF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#8B6F47]">Pending</p>
              <p className="text-2xl font-bold text-[#2C1810]">
                ₹{pendingAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#E8D5BF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#8B6F47]">Approved</p>
              <p className="text-2xl font-bold text-[#2C1810]">
                ₹{paidAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* BILLS TABLE */}
      <Card className="border-[#E8D5BF]">
        <div className="p-6 border-b border-[#E8D5BF]">
          <h3 className="font-semibold text-[#2C1810] flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Employee Bill Approval
          </h3>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5E6D3]">
                <TableHead>Bill ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {bills.map((bill) => {
                const isPaid =
                  bill.status === "PAID" || bill.status === "APPROVED";
                const isPending = bill.status === "PENDING";

                return (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.id}</TableCell>
                    <TableCell>{bill.orderId}</TableCell>
                    <TableCell>{bill.customerName}</TableCell>
                    <TableCell>Table {bill.tableNumber}</TableCell>
                    <TableCell className="font-semibold text-[#6B4423]">
                      ₹{(bill.amount ?? 0).toFixed(2)}
                    </TableCell>

                    <TableCell>
                      {isPaid ? (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approved
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500 text-white">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        {/* Print Invoice — only once approved */}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!isPaid}
                          onClick={() => generateInvoice(bill)}
                        >
                          <Printer className="w-4 h-4" />
                        </Button>

                        {/* Approve button */}
                        {isPending && (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => approveBill(bill)}
                          >
                            Approve
                          </Button>
                        )}

                        {/* Pay button — shown after approval but before payment */}
                        {bill.status === "APPROVED" && (
                          <Button
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => payBill(bill)}
                          >
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {bills.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-[#8B6F47] py-8"
                  >
                    No bills found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
