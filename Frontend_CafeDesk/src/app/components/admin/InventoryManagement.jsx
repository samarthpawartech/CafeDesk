import { useEffect, useMemo, useState } from "react";
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
  XCircle,
  Search,
  Filter,
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

  // ================= FILTER STATES =================

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

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

  // ================= FILTERED INVENTORY =================

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [inventory, searchTerm, statusFilter, categoryFilter]);

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

      let status = "in-stock";

      const qty = parseFloat(formData.quantity);
      const min = parseFloat(formData.minStock);

      if (qty === 0) {
        status = "out-of-stock";
      } else if (qty <= min) {
        status = "low-stock";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          quantity: qty,
          unit: formData.unit,
          minStock: min,
          status,
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

    "out-of-stock": {
      label: "Out Of Stock",
      color: "bg-red-500",
      icon: XCircle,
    },
  };

  return (
    <div className="space-y-6">
      {/* FILTER SECTION */}

      <div className="flex justify-center items-center w-full">
        <div className="flex flex-wrap items-center justify-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-sm border border-[#E8D5BF]">
          {/* SEARCH */}

          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

            <Input
              placeholder="Search item or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-[280px] bg-white"
            />
          </div>

          {/* STATUS FILTER */}

          <div className="relative">
            <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 pl-10 pr-3 border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6B4423] min-w-[180px]"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out Of Stock</option>
            </select>
          </div>

          {/* CATEGORY FILTER */}

          <div className="relative">
            <Boxes className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10" />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 pl-10 pr-3 border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6B4423] min-w-[180px]"
            >
              <option value="all">All Categories</option>

              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* RESET BUTTON */}

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setCategoryFilter("all");
            }}
            className="min-w-[120px] bg-white"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* HEADER */}

      <Card className="border-[#E8D5BF] shadow-sm">
        <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-semibold text-[#2C1810] flex items-center gap-2 text-lg">
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

      <Card className="border-[#E8D5BF] shadow-sm">
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
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading inventory...
                  </TableCell>
                </TableRow>
              ) : filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No inventory items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map((item) => {
                  const config =
                    statusConfig[item.status] || statusConfig["in-stock"];

                  const Icon = config.icon;

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>

                      <TableCell>{item.category}</TableCell>

                      <TableCell>{item.quantity}</TableCell>

                      <TableCell>{item.unit}</TableCell>

                      <TableCell>{item.minStock}</TableCell>

                      <TableCell>
                        <Badge
                          className={`${config.color} text-white px-3 py-1`}
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            onClick={() => openEditDialog(item)}
                            size="sm"
                            className="min-w-[100px] flex items-center justify-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Update
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                            className="min-w-[100px] flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
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
            <DialogTitle className="text-xl">
              {editingItem ? "Update Item" : "Add Item"}
            </DialogTitle>
          </DialogHeader>

          {/* FORM */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
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

            <div className="relative md:col-span-2">
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

          <DialogFooter className="flex flex-row justify-center items-center gap-4 pt-4">
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
