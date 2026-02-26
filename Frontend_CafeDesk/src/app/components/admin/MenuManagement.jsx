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

  const categories = [
    { label: "All", value: "All" },
    { label: "Beverages", value: "Beverages" },
    { label: "Breakfast & Brunch", value: "Breakfast and Brunch" },
    { label: "Desserts", value: "Desserts" },
    { label: "Snacks", value: "Snacks" },
  ];

  const API = "http://localhost:8080/api/menu";
  const BASE_URL = "http://localhost:8080";

  const buildImageUrl = (path) =>
    path ? `${BASE_URL}${path.startsWith("/") ? path : "/" + path}` : null;

  /* ================= API ================= */

  const fetchMenu = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(API, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMenuItems(res.data);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  /* ================= HANDLERS ================= */

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
    const token = localStorage.getItem("token");

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      availability: formData.available,
    };

    const form = new FormData();
    form.append(
      "menu",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );

    if (formData.imageFile) {
      form.append("image", formData.imageFile);
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    editingItem
      ? await axios.put(`${API}/${formData.id}`, form, config)
      : await axios.post(API, form, config);

    fetchMenu();
    setIsDialogOpen(false);
    resetForm();
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
    const token = localStorage.getItem("token");
    await axios.delete(`${API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMenu();
  };

  /* ================= FILTER ================= */

  const filteredItems = useMemo(() => {
    return menuItems
      .filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(
        (i) => selectedCategory === "All" || i.category === selectedCategory,
      )
      .filter(
        (i) =>
          availabilityFilter === "All" ||
          i.availability === (availabilityFilter === "Available"),
      );
  }, [menuItems, searchTerm, selectedCategory, availabilityFilter]);

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3EDE6] to-[#E6D5C3] p-10">
      <div className="max-w-6xl mx-auto">
        {/* TOP CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative h-11">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search menu item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-full w-full bg-white"
            />
          </div>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="h-11 w-full px-4 rounded-md border bg-white"
          >
            <option>All</option>
            <option>Available</option>
            <option>Unavailable</option>
          </select>

          <Button
            className="h-11 w-full"
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Item
          </Button>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex justify-center mb-10">
          <div className="flex gap-3 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.value)}
                className="h-10 px-6"
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* MENU CARDS */}
        <div className="grid md:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-lg">
              {item.imagePath && (
                <img
                  src={buildImageUrl(item.imagePath)}
                  alt={item.name}
                  className="h-40 w-full object-cover rounded-xl mb-4"
                />
              )}

              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>

              <div className="flex justify-between items-center">
                <span className="font-semibold">₹ {item.price}</span>

                <span
                  className={`px-3 py-1 text-xs rounded-md ${
                    item.availability
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.availability ? "Available" : "Unavailable"}
                </span>

                <div className="flex gap-2">
                  <Edit
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => handleEdit(item)}
                  />
                  <Trash2
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => handleDelete(item.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-[#F8F5F1] rounded-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </DialogTitle>
          </DialogHeader>

          {/* FORM */}
          <div className="space-y-4 mt-4">
            {/* NAME */}
            <div className="relative h-11">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                className="h-full w-full pl-10"
                placeholder="Item name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* DESCRIPTION */}
            <div className="relative h-11">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                className="h-full w-full pl-10"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* PRICE */}
            <div className="relative h-11">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="number"
                className="h-full w-full pl-10"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            {/* CATEGORY */}
            <div className="relative h-11">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                className="h-full w-full pl-10 border rounded-md bg-white"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {categories
                  .filter((c) => c.value !== "All")
                  .map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
              </select>
            </div>

            {/* IMAGE UPLOAD */}
            <div className="h-11 w-full">
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="fileUpload"
                className="h-full w-full border-2 border-dashed rounded-md flex items-center justify-center gap-2 cursor-pointer bg-white"
              >
                <UploadCloud size={18} />
                Upload Image
              </label>
            </div>

            {formData.preview && (
              <img
                src={formData.preview}
                className="h-40 w-full object-cover rounded-xl"
              />
            )}

            {/* AVAILABILITY */}
            <div className="relative h-11">
              <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                className="h-full w-full pl-10 border rounded-md bg-white"
                value={formData.available ? "Available" : "Unavailable"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    available: e.target.value === "Available",
                  })
                }
              >
                <option>Available</option>
                <option>Unavailable</option>
              </select>
            </div>
          </div>

          <DialogFooter className="mt-6 flex gap-3">
            <Button onClick={handleSave}>
              {editingItem ? "Update" : "Add"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
