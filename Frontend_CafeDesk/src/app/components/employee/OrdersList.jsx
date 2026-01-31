import { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, ChefHat } from 'lucide-react';
import { orders as initialOrders } from '@/app/utils/mockData';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';

export const OrdersList = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState('all');

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
    preparing: { label: 'Preparing', color: 'bg-blue-500', icon: ChefHat },
    ready: { label: 'Ready', color: 'bg-green-500', icon: CheckCircle },
    completed: { label: 'Completed', color: 'bg-gray-500', icon: CheckCircle },
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          const count = orders.filter(o => o.status === status).length;
          
          return (
            <Card 
              key={status}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-[#E8D5BF]"
              onClick={() => setFilter(status)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${config.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[#8B6F47]">{config.label}</p>
                  <p className="text-2xl font-bold text-[#2C1810]">{count}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'outline'}
          className={filter === 'all' 
            ? 'bg-[#6B4423] text-white' 
            : 'border-[#E8D5BF] text-[#6B4423]'}
        >
          All Orders
        </Button>
        {Object.entries(statusConfig).map(([status, config]) => (
          <Button
            key={status}
            onClick={() => setFilter(status)}
            variant={filter === status ? 'default' : 'outline'}
            className={filter === status 
              ? 'bg-[#6B4423] text-white' 
              : 'border-[#E8D5BF] text-[#6B4423]'}
          >
            {config.label}
          </Button>
        ))}
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredOrders.map(order => {
          const StatusIcon = statusConfig[order.status].icon;
          
          return (
            <Card key={order.id} className="p-6 border-[#E8D5BF] hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-[#2C1810] text-lg">{order.id}</h3>
                  <p className="text-sm text-[#8B6F47]">Table {order.tableNumber} • {order.customerName}</p>
                  <p className="text-xs text-[#8B6F47]">{new Date(order.timestamp).toLocaleTimeString()}</p>
                </div>
                <Badge className={`${statusConfig[order.status].color} text-white`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig[order.status].label}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-[#2C1810] text-sm">Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-[#8B6F47]">{item.quantity}x {item.itemName}</span>
                    <span className="text-[#6B4423] font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#E8D5BF]">
                <span className="font-semibold text-[#2C1810]">Total: ${order.total.toFixed(2)}</span>
                
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Start Preparing
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Mark Ready
                    </Button>
                  )}
                  {order.status === 'ready' && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      size="sm"
                      className="bg-[#6B4423] hover:bg-[#4A2C1A] text-white"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="p-12 text-center border-[#E8D5BF]">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[#8B6F47]" />
          <p className="text-[#8B6F47]">No orders found for this filter</p>
        </Card>
      )}
    </div>
  );
};
