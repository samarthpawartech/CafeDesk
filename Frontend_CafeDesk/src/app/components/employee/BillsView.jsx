"use client";

import { useState } from "react";
import {
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  Printer,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { bills as initialBills } from "@/app/utils/mockData";
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

export const BillsView = () => {
  const [bills, setBills] = useState(initialBills);

  /* ---------------- APPROVE BILL (EMPLOYEE) ---------------- */
  const approveBill = (bill) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === bill.id
          ? {
              ...b,
              status: "paid",
              approvedAt: new Date().toLocaleString(),
            }
          : b,
      ),
    );

    generateInvoice(bill);
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
    pdf.text(`Approved At: ${new Date().toLocaleString()}`, 20, 80);
    pdf.save(`${bill.id}.pdf`);
  };

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = bills
    .filter((b) => b.status === "pending")
    .reduce((sum, bill) => sum + bill.amount, 0);
  const paidAmount = bills
    .filter((b) => b.status === "paid")
    .reduce((sum, bill) => sum + bill.amount, 0);

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
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.orderId}</TableCell>
                  <TableCell>{bill.customerName}</TableCell>
                  <TableCell>Table {bill.tableNumber}</TableCell>
                  <TableCell className="font-semibold text-[#6B4423]">
                    ₹{bill.amount.toFixed(2)}
                  </TableCell>

                  <TableCell>
                    {bill.status === "paid" ? (
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
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={bill.status !== "paid"}
                        onClick={() => generateInvoice(bill)}
                      >
                        <Printer className="w-4 h-4" />
                      </Button>

                      {bill.status === "pending" && (
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => approveBill(bill)}
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
