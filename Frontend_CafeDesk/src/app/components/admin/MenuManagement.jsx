import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { menuItems as initialMenuItems } from "@/app/utils/mockData";
import { Card } from "@/app/components/ui/card";
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
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "Drinks",
    price: "",
    description: "",
    available: true,
  });

  const openAddDialog = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      category: "Drinks",
      price: "",
      description: "",
      available: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description,
      available: item.available,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingItem) {
      setMenuItems(
        menuItems.map((item) =>
          item.id === editingItem.id
            ? { ...item, ...formData, price: parseFloat(formData.price) }
            : item,
        ),
      );
    } else {
      const newItem = {
        id: Math.max(...menuItems.map((i) => i.id)) + 1,
        ...formData,
        price: parseFloat(formData.price),
        image: `${formData.category.toLowerCase()} food`,
      };
      setMenuItems([...menuItems, newItem]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (itemId) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setMenuItems(menuItems.filter((item) => item.id !== itemId));
    }
  };

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const categoryCount = {
    Drinks: menuItems.filter((i) => i.category === "Drinks").length,
    Snacks: menuItems.filter((i) => i.category === "Snacks").length,
    Meals: menuItems.filter((i) => i.category === "Meals").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B6F47]" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-[#6B4423] hover:bg-[#4A2C1A] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(categoryCount).map(([category, count]) => (
          <Card key={category} className="p-6 border-[#E8D5BF]">
            <h3 className="text-sm text-[#8B6F47] mb-1">{category}</h3>
            <p className="text-2xl font-bold text-[#2C1810]">{count} items</p>
          </Card>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
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
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-[#2C1810]">{item.name}</h3>
                  <p className="text-sm text-[#8B6F47] mt-1">
                    {item.description}
                  </p>
                </div>
                <Badge className="bg-[#2D5A3D] text-white">
                  {item.category}
                </Badge>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#E8D5BF]">
                <span className="text-xl font-bold text-[#6B4423]">
                  ${item.price.toFixed(2)}
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => openEditDialog(item)}
                    size="sm"
                    variant="outline"
                    className="border-[#E8D5BF] text-[#6B4423] hover:bg-[#F5E6D3]"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Item Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter item name"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Drinks">Drinks</SelectItem>
                  <SelectItem value="Snacks">Snacks</SelectItem>
                  <SelectItem value="Meals">Meals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) =>
                  setFormData({ ...formData, available: e.target.checked })
                }
                className="w-4 h-4 rounded border-[#E8D5BF]"
              />
              <Label htmlFor="available" className="cursor-pointer">
                Available for order
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#6B4423] hover:bg-[#4A2C1A] text-white"
            >
              {editingItem ? "Update" : "Add"} Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
