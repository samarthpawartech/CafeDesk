"use client";

import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  UploadCloud,
  Tag,
  FileText,
  DollarSign,
  Layers,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";

export const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "Beverages",
    available: true,
    imageFile: null,
    preview: null,
  });

  const categories = ["Beverages", "Breakfast & Brunch", "Desserts", "Snacks"];
  const API = "http://localhost:8080/api/menu";
  const BASE_URL = "http://localhost:8080";

  const buildImageUrl = (path) => {
    if (!path) return null;
    return `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
  };

  const fetchMenu = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      price: "",
      category: "Beverages",
      available: true,
      imageFile: null,
      preview: null,
    });
    setEditingItem(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      const menuObject = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        availability: formData.available,
      };

      formDataToSend.append(
        "menu",
        new Blob([JSON.stringify(menuObject)], { type: "application/json" }),
      );

      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingItem) {
        await axios.put(`${API}/${formData.id}`, formDataToSend, config);
      } else {
        if (!formData.imageFile) {
          alert("Please select an image");
          return;
        }
        await axios.post(API, formDataToSend, config);
      }

      fetchMenu();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error("Save Error:", err.response?.data || err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      available: item.availability,
      imageFile: null,
      preview: buildImageUrl(item.imagePath),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMenu();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .filter(
        (item) =>
          selectedCategory === "All" || item.category === selectedCategory,
      )
      .filter(
        (item) =>
          availabilityFilter === "All" ||
          item.availability === (availabilityFilter === "Available"),
      );
  }, [menuItems, searchTerm, selectedCategory, availabilityFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3EDE6] to-[#E6D5C3] p-10">
      <div className="max-w-6xl mx-auto">
        {/* Top Row: Search + Availability + Add Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search menu item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 w-full rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-[#6B4423]"
            />
          </div>

          {/* Availability Filter */}
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="h-11 px-4 rounded-full border border-gray-300 bg-white w-full md:w-48 focus:ring-2 focus:ring-[#6B4423]"
          >
            <option>All</option>
            <option>Available</option>
            <option>Unavailable</option>
          </select>

          {/* Add Button */}
          <Button
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
            className="rounded-full bg-white text-black shadow-md hover:bg-gray-100 h-11 px-6"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Menu Item
          </Button>
        </div>

        {/* Second Row: Category Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className="h-11 rounded-full px-6"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Menu Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-3xl shadow-lg">
              {item.imagePath && (
                <img
                  src={buildImageUrl(item.imagePath)}
                  alt={item.name}
                  className="h-40 w-full object-cover rounded-2xl mb-4"
                />
              )}
              <h3 className="font-bold text-xl text-[#4B2E2B]">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#A4754E]">₹ {item.price}</span>
                <div className="flex gap-2">
                  <Edit
                    className="w-4 h-4 cursor-pointer text-blue-600"
                    onClick={() => handleEdit(item)}
                  />
                  <Trash2
                    className="w-4 h-4 cursor-pointer text-red-600"
                    onClick={() => handleDelete(item.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-[#F8F5F1] rounded-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#2C1810]">
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Name */}
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Item name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="pl-10 rounded-xl h-11 w-full"
              />
            </div>

            {/* Description */}
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="pl-10 rounded-xl h-11 w-full"
              />
            </div>

            {/* Price */}
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="pl-10 rounded-xl h-11 w-full"
              />
            </div>

            {/* Category Select */}
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="pl-10 w-full rounded-xl border px-3 h-11"
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div className="border-2 border-dashed rounded-2xl p-6 text-center bg-white">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="fileUpload"
                onChange={handleImageUpload}
              />
              <label htmlFor="fileUpload" className="cursor-pointer">
                <UploadCloud
                  className="mx-auto mb-2 text-[#6B4423]"
                  size={32}
                />
                <p className="text-sm text-gray-600">Upload Image</p>
              </label>
            </div>

            {formData.preview && (
              <img
                src={formData.preview}
                alt="Preview"
                className="h-40 w-full object-cover rounded-xl"
              />
            )}

            {/* Availability */}
            <div className="relative">
              <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={formData.available ? "Available" : "Unavailable"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    available: e.target.value === "Available",
                  })
                }
                className="pl-10 w-full rounded-xl border px-3 h-11"
              >
                <option>Available</option>
                <option>Unavailable</option>
              </select>
            </div>
          </div>

          <DialogFooter className="mt-6 flex gap-3">
            <Button
              onClick={handleSave}
              className="bg-[#6B4423] text-white rounded-xl px-6"
            >
              {editingItem ? "Update" : "Add"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
              className="bg-[#D6C2A8] text-black rounded-xl px-6"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
