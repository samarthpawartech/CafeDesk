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

  const cafeInput =
    "h-12 w-full rounded-full bg-white border border-gray-300 px-5 pl-12 text-[#5C4A3E] placeholder:text-[#8C7A6B] focus:outline-none focus:ring-0 focus:border-gray-400 transition-all";

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
      {/* Centered Container */}
      <div className="w-full max-w-6xl mx-auto">
        {/* Search + Add Button (Centered Between Red Lines) */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-6 w-full max-w-4xl">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
              <Input
                placeholder="Search menu item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 rounded-full w-full"
              />
            </div>

            {/* Add Button */}
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
                  <div>
                    <h3 className="font-semibold text-[#4B2E2B]">
                      {item.name}
                    </h3>
                    <p className="text-sm text-[#6B4F3A]">{item.category}</p>
                  </div>
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
    </div>
  );
};
