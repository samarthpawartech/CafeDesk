import { useState } from 'react';
import { Package, AlertTriangle, CheckCircle, Plus, Edit } from 'lucide-react';
import { inventory as initialInventory } from '@/app/utils/mockData';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';

export const InventoryManagement = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    minStock: '',
  });

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

  const handleSave = () => {
    const updatedItem = {
      ...editingItem,
      ...formData,
      quantity: parseFloat(formData.quantity),
      minStock: parseFloat(formData.minStock),
      status: getStatus(parseFloat(formData.quantity), parseFloat(formData.minStock)),
    };
    
    setInventory(inventory.map(item => 
      item.id === editingItem.id ? updatedItem : item
    ));
    setIsDialogOpen(false);
  };

  const getStatus = (quantity, minStock) => {
    if (quantity === 0) return 'critical';
    if (quantity < minStock * 0.5) return 'critical';
    if (quantity < minStock) return 'low-stock';
    return 'in-stock';
  };

  const statusConfig = {
    'in-stock': { label: 'In Stock', color: 'bg-green-500', icon: CheckCircle },
    'low-stock': { label: 'Low Stock', color: 'bg-yellow-500', icon: AlertTriangle },
    'critical': { label: 'Critical', color: 'bg-red-500', icon: AlertTriangle },
  };

  const stockSummary = {
    inStock: inventory.filter(i => i.status === 'in-stock').length,
    lowStock: inventory.filter(i => i.status === 'low-stock').length,
    critical: inventory.filter(i => i.status === 'critical').length,
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-[#E8D5BF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#8B6F47]">In Stock</p>
              <p className="text-2xl font-bold text-[#2C1810]">{stockSummary.inStock}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#E8D5BF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#8B6F47]">Low Stock</p>
              <p className="text-2xl font-bold text-[#2C1810]">{stockSummary.lowStock}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#E8D5BF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#8B6F47]">Critical</p>
              <p className="text-2xl font-bold text-[#2C1810]">{stockSummary.critical}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="border-[#E8D5BF]">
        <div className="p-6 border-b border-[#E8D5BF] flex justify-between items-center">
          <h3 className="font-semibold text-[#2C1810] flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventory Items
          </h3>
          <Button className="bg-[#6B4423] hover:bg-[#4A2C1A] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5E6D3] hover:bg-[#F5E6D3]">
                <TableHead className="text-[#2C1810]">Item Name</TableHead>
                <TableHead className="text-[#2C1810]">Category</TableHead>
                <TableHead className="text-[#2C1810]">Current Stock</TableHead>
                <TableHead className="text-[#2C1810]">Unit</TableHead>
                <TableHead className="text-[#2C1810]">Min Stock</TableHead>
                <TableHead className="text-[#2C1810]">Status</TableHead>
                <TableHead className="text-[#2C1810]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map(item => {
                const config = statusConfig[item.status];
                const StatusIcon = config.icon;
                const percentage = (item.quantity / item.minStock) * 100;
                
                return (
                  <TableRow key={item.id} className="hover:bg-[#FBF8F3]">
                    <TableCell className="font-medium text-[#2C1810]">{item.name}</TableCell>
                    <TableCell className="text-[#8B6F47]">{item.category}</TableCell>
                    <TableCell>
                      <div>
                        <span className="font-semibold text-[#2C1810]">{item.quantity}</span>
                        <div className="w-full bg-[#E8D5BF] rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${
                              percentage >= 100 ? 'bg-green-500' :
                              percentage >= 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#8B6F47]">{item.unit}</TableCell>
                    <TableCell className="text-[#8B6F47]">{item.minStock}</TableCell>
                    <TableCell>
                      <Badge className={`${config.color} text-white`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => openEditDialog(item)}
                        size="sm"
                        variant="outline"
                        className="border-[#E8D5BF] text-[#6B4423] hover:bg-[#F5E6D3]"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Inventory Item</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Item Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter item name"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Enter category"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Quantity</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Unit</Label>
                <Input
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="kg, liters, etc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Minimum Stock Level</Label>
              <Input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-[#6B4423] hover:bg-[#4A2C1A] text-white">
              Update Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
