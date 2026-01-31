import { useState } from 'react';
import { FileText, CreditCard, DollarSign, Clock, CheckCircle, Printer } from 'lucide-react';
import { bills as initialBills } from '@/app/utils/mockData';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';

export const BillsView = () => {
  const [bills, setBills] = useState(initialBills);

  const markAsPaid = (billId) => {
    setBills(bills.map(bill => 
      bill.id === billId ? { ...bill, status: 'paid' } : bill
    ));
  };

  const printBill = (billId) => {
    alert(`Printing bill ${billId}...`);
  };

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = bills.filter(b => b.status === 'pending').reduce((sum, bill) => sum + bill.amount, 0);
  const paidAmount = bills.filter(b => b.status === 'paid').reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-[#E8D5BF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#6B4423] rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#8B6F47]">Total Bills</p>
              <p className="text-2xl font-bold text-[#2C1810]">${totalAmount.toFixed(2)}</p>
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
              <p className="text-2xl font-bold text-[#2C1810]">${pendingAmount.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#E8D5BF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#8B6F47]">Paid</p>
              <p className="text-2xl font-bold text-[#2C1810]">${paidAmount.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bills Table */}
      <Card className="border-[#E8D5BF]">
        <div className="p-6 border-b border-[#E8D5BF]">
          <h3 className="font-semibold text-[#2C1810] flex items-center gap-2">
            <FileText className="w-5 h-5" />
            All Bills
          </h3>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5E6D3] hover:bg-[#F5E6D3]">
                <TableHead className="text-[#2C1810]">Bill ID</TableHead>
                <TableHead className="text-[#2C1810]">Order ID</TableHead>
                <TableHead className="text-[#2C1810]">Customer</TableHead>
                <TableHead className="text-[#2C1810]">Table</TableHead>
                <TableHead className="text-[#2C1810]">Amount</TableHead>
                <TableHead className="text-[#2C1810]">Payment</TableHead>
                <TableHead className="text-[#2C1810]">Status</TableHead>
                <TableHead className="text-[#2C1810]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map(bill => (
                <TableRow key={bill.id} className="hover:bg-[#FBF8F3]">
                  <TableCell className="font-medium text-[#2C1810]">{bill.id}</TableCell>
                  <TableCell className="text-[#8B6F47]">{bill.orderId}</TableCell>
                  <TableCell className="text-[#2C1810]">{bill.customerName}</TableCell>
                  <TableCell className="text-[#8B6F47]">Table {bill.tableNumber}</TableCell>
                  <TableCell className="font-semibold text-[#6B4423]">${bill.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-[#E8D5BF] text-[#6B4423]">
                      <CreditCard className="w-3 h-3 mr-1" />
                      {bill.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {bill.status === 'paid' ? (
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Paid
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
                        onClick={() => printBill(bill.id)}
                        size="sm"
                        variant="outline"
                        className="border-[#E8D5BF] text-[#6B4423] hover:bg-[#F5E6D3]"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                      {bill.status === 'pending' && (
                        <Button
                          onClick={() => markAsPaid(bill.id)}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          Mark Paid
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
