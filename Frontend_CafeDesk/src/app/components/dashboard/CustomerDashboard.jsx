import { useState } from "react";
import {
  Coffee,
  ShoppingCart,
  QrCode,
  FileText,
  LogOut,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { menuItems, bills } from "@/app/utils/mockData";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export const CustomerDashboard = () => {
  const {
    user,
    logout,
    currentOrder = [], // ✅ default to empty array
    addToOrder,
    updateQuantity,
    removeFromOrder,
    getTotalAmount,
    clearOrder,
  } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showQRScanner, setShowQRScanner] = useState(false);

  const categories = ["All", "Drinks", "Snacks", "Meals"];
  const filteredMenu =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const customerBills = bills.filter(
    (bill) => bill.customerName === user?.name,
  );
  const pendingBills = customerBills.filter(
    (bill) => bill.status === "pending",
  );

  const handlePlaceOrder = () => {
    alert(`Order placed successfully! Total: $${getTotalAmount().toFixed(2)}`);
    clearOrder();
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3]">
      {/* Header */}
      <div className="bg-[#6B4423] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#2D5A3D] rounded-lg flex items-center justify-center">
                <Coffee className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">CafeDesk</h1>
                <p className="text-sm text-white/80">by Samarth Pawar</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-white/80">Welcome,</p>
                <p className="font-medium">{user?.name}</p>
              </div>

              {/* Cart Button with Badge */}
              <Button
                variant="ghost"
                className="relative text-white hover:bg-white/10"
              >
                <ShoppingCart className="w-5 h-5" />
                {currentOrder.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {currentOrder.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Button>

              {/* Logout */}
              <Button
                onClick={logout}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card
                className="p-6 bg-white border-[#E8D5BF] cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setShowQRScanner(!showQRScanner)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2D5A3D] rounded-lg flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2C1810]">
                      Scan QR Menu
                    </h3>
                    <p className="text-sm text-[#8B6F47]">
                      Quick access to menu
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border-[#E8D5BF]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#6B4423] rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2C1810]">
                      Pending Bills
                    </h3>
                    <p className="text-2xl font-bold text-[#6B4423]">
                      {pendingBills.length}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  className={
                    selectedCategory === category
                      ? "bg-[#6B4423] text-white hover:bg-[#4A2C1A]"
                      : "border-[#E8D5BF] text-[#6B4423] hover:bg-[#F5E6D3]"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredMenu.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-[#E8D5BF] hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-[#F5E6D3] relative overflow-hidden">
                    <ImageWithFallback
                      src={`https://source.unsplash.com/400x300/?${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {!item.available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-[#2C1810]">
                          {item.name}
                        </h3>
                        <p className="text-sm text-[#8B6F47]">
                          {item.description}
                        </p>
                      </div>
                      <Badge className="bg-[#2D5A3D] text-white">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xl font-bold text-[#6B4423]">
                        ${item.price.toFixed(2)}
                      </span>
                      <Button
                        onClick={() => addToOrder(item)}
                        disabled={!item.available}
                        className="bg-[#6B4423] hover:bg-[#4A2C1A] text-white"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-[#E8D5BF]">
              <div className="p-6 border-b border-[#E8D5BF] bg-[#6B4423] text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <h3 className="font-semibold">Current Order</h3>
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {currentOrder.length === 0 ? (
                  <p className="text-center text-[#8B6F47] py-8">
                    Your cart is empty
                  </p>
                ) : (
                  currentOrder.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 pb-3 border-b border-[#E8D5BF]"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-[#2C1810]">
                          {item.name}
                        </h4>
                        <p className="text-sm text-[#8B6F47]">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromOrder(item.id)}
                          className="h-8 w-8 p-0 text-[#C44536]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {currentOrder.length > 0 && (
                <div className="p-6 border-t border-[#E8D5BF] space-y-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className="text-[#2C1810]">Total:</span>
                    <span className="text-[#6B4423]">
                      ${getTotalAmount().toFixed(2)}
                    </span>
                  </div>
                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full bg-[#2D5A3D] hover:bg-[#1F3D2A] text-white"
                  >
                    Place Order
                  </Button>
                  <Button
                    onClick={clearOrder}
                    variant="outline"
                    className="w-full border-[#E8D5BF] text-[#C44536] hover:bg-[#C44536]/10"
                  >
                    Clear Cart
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-8 text-center">
            <QrCode className="w-24 h-24 mx-auto mb-4 text-[#6B4423]" />
            <h3 className="text-xl font-semibold mb-2">QR Code Scanner</h3>
            <p className="text-[#8B6F47] mb-6">
              Point your camera at the QR code on your table
            </p>
            <div className="w-full h-64 bg-[#F5E6D3] rounded-lg flex items-center justify-center mb-6">
              <p className="text-[#8B6F47]">Camera view would appear here</p>
            </div>
            <Button
              onClick={() => setShowQRScanner(false)}
              className="w-full bg-[#6B4423] hover:bg-[#4A2C1A] text-white"
            >
              Close Scanner
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};
