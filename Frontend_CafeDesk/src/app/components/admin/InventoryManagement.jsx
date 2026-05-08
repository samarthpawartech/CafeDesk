import { useEffect, useState } from "react";
import {
  Package,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Tag,
  Boxes,
  Scale,
  Layers,
} from "lucide-react";

import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

// ================= API =================

const API = "http://localhost:8080/api/inventory";

export const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    minStock: "",
  });

  // ================= CATEGORIES =================

  const categories = [
    "Dairy",
    "Beverages",
    "Vegetables",
    "Fruits",
    "Grains",
    "Bakery",
    "Meat",
    "Seafood",
    "Spices",
    "Snacks",
    "Frozen Items",
    "Food",
  ];

  // ================= FETCH INVENTORY =================

  const fetchInventory = async () => {
    try {
      setLoading(true);

      const response = await fetch(API);

      const data = await response.json();

      setInventory(data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD ON START =================

  useEffect(() => {
    fetchInventory();
  }, []);

  // ================= OPEN ADD =================

  const openAddDialog = () => {
    setEditingItem(null);

    setFormData({
      name: "",
      category: "",
      quantity: "",
      unit: "",
      minStock: "",
    });

    setIsDialogOpen(true);
  };

  // ================= OPEN EDIT =================

  const openEditDialog = (item) => {
    setEditingItem(item);

    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      unit: item.unit,
      minStock: item.minStock.toString(),
    });

    setIsDialogOpen(true);
  };

  // ================= SAVE =================

  const handleSave = async () => {
    try {
      const method = editingItem ? "PUT" : "POST";

      const url = editingItem ? `${API}/${editingItem.id}` : API;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          minStock: parseFloat(formData.minStock),
        }),
      });

      if (!response.ok) {
        alert("Failed to save inventory item");
        return;
      }

      await fetchInventory();

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Delete failed");
        return;
      }

      fetchInventory();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ================= STATUS =================

  const statusConfig = {
    "in-stock": {
      label: "In Stock",
      color: "bg-green-500",
      icon: CheckCircle,
    },

    "low-stock": {
      label: "Low Stock",
      color: "bg-yellow-500",
      icon: AlertTriangle,
    },

    critical: {
      label: "Critical",
      color: "bg-red-500",
      icon: AlertTriangle,
    },
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <Card className="border-[#E8D5BF]">
        <div className="p-6 flex justify-between items-center">
          <h3 className="font-semibold text-[#2C1810] flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventory Items
          </h3>

          <Button
            onClick={openAddDialog}
            className="bg-[#6B4423] hover:bg-[#4A2C1A] text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>
      </Card>

      {/* TABLE */}

      <Card className="border-[#E8D5BF]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading inventory...
                  </TableCell>
                </TableRow>
              ) : inventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No inventory items found
                  </TableCell>
                </TableRow>
              ) : (
                inventory.map((item) => {
                  const config =
                    statusConfig[item.status] || statusConfig["in-stock"];

                  const Icon = config.icon;

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>

                      <TableCell>{item.category}</TableCell>

                      <TableCell>{item.quantity}</TableCell>

                      <TableCell>{item.unit}</TableCell>

                      <TableCell>{item.minStock}</TableCell>

                      <TableCell>
                        <Badge className={`${config.color} text-white`}>
                          <Icon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => openEditDialog(item)}
                            size="sm"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Update
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* DIALOG */}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Update Item" : "Add Item"}
            </DialogTitle>
          </DialogHeader>

          {/* FORM */}

          <div className="grid grid-cols-2 gap-4 py-4">
            {/* NAME */}

            <div className="relative">
              <Tag className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

              <Input
                className="pl-10"
                placeholder="Item Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </div>

            {/* CATEGORY */}

            <div className="relative">
              <Boxes className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10" />

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className="w-full h-10 pl-10 pr-3 border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6B4423]"
              >
                <option value="">Select Category</option>

                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* QUANTITY */}

            <div className="relative">
              <Layers className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

              <Input
                type="number"
                className="pl-10"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: e.target.value,
                  })
                }
              />
            </div>

            {/* UNIT */}

            <div className="relative">
              <Scale className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

              <Input
                className="pl-10"
                placeholder="Unit"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unit: e.target.value,
                  })
                }
              />
            </div>

            {/* MIN STOCK */}

            <div className="relative col-span-2">
              <AlertTriangle className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

              <Input
                type="number"
                className="pl-10"
                placeholder="Minimum Stock"
                value={formData.minStock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minStock: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* FOOTER */}

          <DialogFooter className="flex justify-center items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="min-w-[120px]"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              className="bg-[#6B4423] hover:bg-[#4A2C1A] text-white flex items-center justify-center gap-2 min-w-[120px]"
            >
              {editingItem ? (
                <Edit className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}

              {editingItem ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
