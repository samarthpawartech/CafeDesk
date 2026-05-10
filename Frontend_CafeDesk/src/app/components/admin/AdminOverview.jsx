import { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  FileText,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

import {
  getSummary,
  getWeeklySales,
  getCategorySales,
  getLowStock,
  getActiveOrders,
} from "@/app/api/dashboardService";

import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export const AdminOverview = () => {
  // ================= STATES =================

  const [kpiData, setKpiData] = useState({});
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================= FETCH DASHBOARD =================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [
          summary,
          weeklySales,
          categorySales,
          lowStock,
          activeOrdersData,
        ] = await Promise.all([
          getSummary(),
          getWeeklySales(),
          getCategorySales(),
          getLowStock(),
          getActiveOrders(),
        ]);

        setKpiData(summary);
        setSalesData(weeklySales);
        setCategoryData(categorySales);
        setLowStockItems(lowStock);
        setActiveOrders(activeOrdersData);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-[#6B4423] text-lg font-semibold">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= KPI CARDS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL SALES */}

        <Card className="p-6 border-[#E8D5BF] bg-gradient-to-br from-[#6B4423] to-[#4A2C1A] text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>

            <Badge className="bg-green-500 text-white">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>

          <p className="text-sm text-white/80 mb-1">Total Sales</p>

          <p className="text-3xl font-bold">
            ₹{(kpiData?.totalSales || 0).toFixed(2)}
          </p>

          <p className="text-xs text-white/60 mt-2">Paid Revenue</p>
        </Card>

        {/* TOTAL ORDERS */}

        <Card className="p-6 border-[#E8D5BF] bg-gradient-to-br from-[#2D5A3D] to-[#1F3D2A] text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>

            <Badge className="bg-blue-500 text-white">
              {kpiData?.activeOrders || 0} active
            </Badge>
          </div>

          <p className="text-sm text-white/80 mb-1">Total Orders</p>

          <p className="text-3xl font-bold">{kpiData?.totalOrders || 0}</p>

          <p className="text-xs text-white/60 mt-2">All Orders</p>
        </Card>

        {/* INVENTORY ALERTS */}

        <Card className="p-6 border-[#E8D5BF] bg-gradient-to-br from-[#D4A574] to-[#B8956A] text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>

            <Badge className="bg-yellow-500 text-white">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {kpiData?.inventoryAlerts || 0}
            </Badge>
          </div>

          <p className="text-sm text-white/80 mb-1">Inventory Alerts</p>

          <p className="text-3xl font-bold">{lowStockItems.length}</p>

          <p className="text-xs text-white/60 mt-2">Low Stock Items</p>
        </Card>

        {/* PENDING BILLS */}

        <Card className="p-6 border-[#E8D5BF] bg-gradient-to-br from-[#8B6F47] to-[#6B4423] text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>

            <Badge className="bg-red-500 text-white">
              {kpiData?.pendingBills || 0} pending
            </Badge>
          </div>

          <p className="text-sm text-white/80 mb-1">Pending Bills</p>

          <p className="text-3xl font-bold">{kpiData?.pendingBills || 0}</p>

          <p className="text-xs text-white/60 mt-2">Awaiting Payment</p>
        </Card>
      </div>

      {/* ================= CHARTS ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WEEKLY SALES */}

        <Card className="p-6 border-[#E8D5BF]">
          <h3 className="font-semibold text-[#2C1810] mb-4">
            Weekly Sales Trend
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D5BF" />

              <XAxis dataKey="name" stroke="#8B6F47" />

              <YAxis stroke="#8B6F47" />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E8D5BF",
                  borderRadius: "8px",
                }}
              />

              <Line
                type="monotone"
                dataKey="sales"
                stroke="#6B4423"
                strokeWidth={3}
                dot={{ fill: "#6B4423", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* CATEGORY SALES */}

        <Card className="p-6 border-[#E8D5BF]">
          <h3 className="font-semibold text-[#2C1810] mb-4">
            Sales by Category
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D5BF" />

              <XAxis dataKey="name" stroke="#8B6F47" />

              <YAxis stroke="#8B6F47" />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E8D5BF",
                  borderRadius: "8px",
                }}
              />

              <Bar dataKey="value" fill="#6B4423" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ================= QUICK STATS ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LOW STOCK */}

        <Card className="border-[#E8D5BF]">
          <div className="p-6 border-b border-[#E8D5BF]">
            <h3 className="font-semibold text-[#2C1810] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Low Stock Alerts
            </h3>
          </div>

          <div className="p-6 space-y-3">
            {lowStockItems.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 bg-[#FBF8F3] rounded-lg"
              >
                <div>
                  <p className="font-medium text-[#2C1810]">{item.name}</p>

                  <p className="text-sm text-[#8B6F47]">
                    {item.quantity} {item.unit} remaining
                  </p>
                </div>

                <Badge
                  className={
                    item.status === "critical"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-white"
                  }
                >
                  {item.status === "critical" ? "Critical" : "Low"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* ACTIVE ORDERS */}

        <Card className="border-[#E8D5BF]">
          <div className="p-6 border-b border-[#E8D5BF]">
            <h3 className="font-semibold text-[#2C1810] flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
              Active Orders
            </h3>
          </div>

          <div className="p-6 space-y-3">
            {activeOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center p-3 bg-[#FBF8F3] rounded-lg"
              >
                <div>
                  <p className="font-medium text-[#2C1810]">
                    Order #{order.id}
                  </p>

                  <p className="text-sm text-[#8B6F47]">
                    Table {order.tableNumber} • ₹
                    {(order.amount || 0).toFixed(2)}
                  </p>
                </div>

                <Badge
                  className={
                    order.status === "PENDING"
                      ? "bg-yellow-500 text-white"
                      : order.status === "PREPARING"
                        ? "bg-blue-500 text-white"
                        : "bg-green-500 text-white"
                  }
                >
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
