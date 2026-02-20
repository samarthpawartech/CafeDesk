"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Hash,
  Tag,
  FileText,
  DollarSign,
  Layers,
  Upload,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
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

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "Drinks",
    available: true,
    image: null,
  });

  const cafeInput =
    "h-12 w-full rounded-full bg-white border border-gray-300 px-5 text-[#5C4A3E] placeholder:text-[#8C7A6B] focus:outline-none focus:ring-0 focus:border-gray-400 transition-all";

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      price: "",
      category: "Drinks",
      available: true,
      image: null,
    });
    setEditingItem(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
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
    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [menuItems, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3EDE6] to-[#E6D5C3] p-10">
      {/* Search + Add */}
      <div className="flex justify-center mb-12">
        <div className="flex w-full max-w-6xl items-center gap-6 flex-col md:flex-row">
          <div className="relative w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
            <Input
              placeholder="Search menu item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${cafeInput} pl-12`}
            />
          </div>

          <Button
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
            className="h-12 px-8 rounded-full bg-white text-gray-800 shadow-md hover:bg-gray-100"
          >
            <Plus className="w-4 h-4 mr-2 text-gray-800" />
            Add Menu Item
          </Button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="rounded-3xl p-6 bg-white shadow-lg"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-40 w-full object-cover rounded-xl mb-3"
                  />
                )}

                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-[#4B2E2B]">{item.name}</h3>
                  <Badge
                    className={
                      item.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                <p className="text-sm text-[#6B4F3A] mb-2">
                  {item.description}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-[#A4754E]">
                    ₹ {item.price}
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

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="relative rounded-3xl bg-white shadow-xl border-none">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#4B2E2B]">
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {editingItem && (
              <div className="relative">
                <Hash
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                />
                <Input value={formData.id} disabled className={cafeInput} />
              </div>
            )}

            <div className="relative">
              <Tag
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
              />
              <Input
                className={`${cafeInput} pl-12`}
                placeholder="Item Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="relative">
              <FileText
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
              />
              <Input
                className={`${cafeInput} pl-12`}
                placeholder="Item Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="relative">
              <DollarSign
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
              />
              <Input
                type="number"
                className={`${cafeInput} pl-12`}
                placeholder="Item Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            <div className="relative">
              <Layers
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
              />
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className={`${cafeInput} pl-12`}>
                  <SelectValue placeholder="Item Category" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="Drinks">Drinks</SelectItem>
                  <SelectItem value="Snacks">Snacks</SelectItem>
                  <SelectItem value="Meals">Meals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <CheckCircle
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
              />
              <Select
                value={formData.available ? "true" : "false"}
                onValueChange={(value) =>
                  setFormData({ ...formData, available: value === "true" })
                }
              >
                <SelectTrigger className={`${cafeInput} pl-12`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="true">Available</SelectItem>
                  <SelectItem value="false">Currently Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Upload
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
              />
              <Input
                type="file"
                accept="image/*"
                className={`${cafeInput} pl-12`}
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSave}
              className="rounded-full px-8 h-12 bg-[#B8895C] hover:bg-[#A4754E] text-white"
            >
              Save Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
