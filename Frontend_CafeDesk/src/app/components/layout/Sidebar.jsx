import { Coffee, LayoutDashboard, ShoppingCart, Package, Users, FileText, Table, LogOut } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export const Sidebar = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu Management', icon: Coffee },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'bills', label: 'Bills & Payments', icon: FileText },
    { id: 'tables', label: 'Table Management', icon: Table },
  ];

  const employeeMenuItems = [
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'tables', label: 'Tables', icon: Table },
    { id: 'bills', label: 'Bills', icon: FileText },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : employeeMenuItems;

  return (
    <div className="w-64 bg-[#4A2C1A] text-[#F5E6D3] h-screen flex flex-col shadow-lg">
      {/* Logo/Header */}
      <div className="p-6 border-b border-[#F5E6D3]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2D5A3D] rounded-lg flex items-center justify-center">
            <Coffee className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">CafeDesk</h2>
            <p className="text-xs text-[#F5E6D3]/70">by Samarth Pawar</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-[#F5E6D3]/10">
        <p className="text-sm text-[#F5E6D3]/70">Logged in as</p>
        <p className="font-medium">{user?.name}</p>
        <p className="text-xs text-[#F5E6D3]/60 capitalize">{user?.role}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? 'bg-[#2D5A3D] text-white border-l-4 border-white'
                  : 'text-[#F5E6D3] hover:bg-[#6B4423]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#F5E6D3]/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-[#F5E6D3] hover:bg-[#6B4423] rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
