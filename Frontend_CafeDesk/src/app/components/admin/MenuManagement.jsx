"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Tag,
  FileText,
  DollarSign,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

export const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "Beverages",
    available: true,
    image: null,
  });

  const categories = [
    "All",
    "Beverages",
    "Breakfast & Brunch",
    "Lunch & Light Meals",
    "Snacks & Sides",
    "Desserts & Sweets",
    "Healthy / Special Diet",
  ];

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      price: "",
      category: "Beverages",
      available: true,
      image: null,
    });
    setEditingItem(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) return;

    if (editingItem) {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...formData, price: parseFloat(formData.price) }
            : item,
        ),
      );
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
        price: parseFloat(formData.price),
      };
      setMenuItems((prev) => [...prev, newItem]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchTerm, activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3EDE6] to-[#E6D5C3] p-10">
      <div className="w-full max-w-6xl mx-auto">
        {/* Search + Add Button */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-6 w-full max-w-4xl">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
              <Input
                placeholder="Search menu item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 rounded-full w-full"
              />
            </div>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="h-12 px-8 rounded-full bg-white text-gray-800 shadow-md hover:bg-gray-100 flex-shrink-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex justify-center flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 h-12 flex items-center justify-center rounded-full text-sm font-medium whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-[#B8895C] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="rounded-3xl p-6 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 relative"
              >
                {/* Image + Availability Dot */}
                {item.image && (
                  <div className="relative mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-44 w-full object-cover rounded-2xl"
                    />
                    <span className="absolute top-3 left-3 bg-white/70 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.category}
                    </span>
                    {/* Hoverable availability dot */}
                    <motion.div
                      className={`absolute top-3 right-3 w-3 h-3 rounded-full border-2 border-white cursor-pointer ${
                        item.available ? "bg-green-500" : "bg-red-500"
                      }`}
                      title={item.available ? "Available" : "Unavailable"}
                      whileHover={{ scale: 1.5 }}
                    />
                  </div>
                )}

                {/* Name */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-xl text-[#4B2E2B] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#B8895C]" />
                    {item.name}
                  </h3>
                  {/* Icon status */}
                  {item.available ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>

                {/* Description */}
                <p className="text-[#6B4F3A] text-sm flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-[#B8895C]" />{" "}
                  {item.description || "No description"}
                </p>

                {/* Price + Actions */}
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-[#A4754E] text-lg flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-yellow-600" /> ₹{" "}
                    {item.price}
                  </span>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#B8895C]" />
              <Input
                placeholder="Enter item name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#B8895C]" />
              <Input
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-600" />
              <Input
                type="number"
                placeholder="Enter price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            {/* Category */}
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#B8895C]" />
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
                }
                className="flex-1"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((cat) => cat !== "All")
                    .map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image */}
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#B8895C]" />
              <Input type="file" onChange={handleImageUpload} />
            </div>

            {/* Status with symbols */}
            <div className="flex items-center gap-2">
              <span>Status:</span>
              <Select
                value={formData.available ? "available" : "unavailable"}
                onValueChange={(val) =>
                  setFormData({ ...formData, available: val === "available" })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 inline-block" />
                    Available
                  </SelectItem>
                  <SelectItem value="unavailable">
                    <XCircle className="w-4 h-4 text-red-500 mr-2 inline-block" />
                    Unavailable
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingItem ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
