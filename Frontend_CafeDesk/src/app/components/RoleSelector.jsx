import { Coffee, User, Briefcase, Shield } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

export const RoleSelector = ({ onSelectRole }) => {
  const roles = [
    {
      id: 'customer',
      name: 'Customer',
      description: 'Browse menu and place orders',
      icon: User,
      color: 'from-[#6B4423] to-[#4A2C1A]',
    },
    {
      id: 'employee',
      name: 'Employee',
      description: 'Manage orders and tables',
      icon: Briefcase,
      color: 'from-[#2D5A3D] to-[#1F3D2A]',
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Full system control',
      icon: Shield,
      color: 'from-[#8B6F47] to-[#6B4423]',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF8F3] via-[#E8D5BF] to-[#F5E6D3] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#6B4423] rounded-3xl mb-6 shadow-2xl">
            <Coffee className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-[#2C1810] mb-3">CafeDesk</h1>
          <p className="text-xl text-[#8B6F47] mb-2">Modern Café Management System</p>
          <p className="text-sm text-[#8B6F47]">Developed by Samarth Pawar</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            
            return (
              <Card
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                className="group cursor-pointer border-2 border-[#E8D5BF] hover:border-[#6B4423] transition-all hover:shadow-2xl hover:-translate-y-2 duration-300 overflow-hidden"
              >
                <div className={`bg-gradient-to-br ${role.color} p-8 text-center`}>
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{role.name}</h2>
                  <p className="text-white/90">{role.description}</p>
                </div>
                
                <div className="p-6 bg-white text-center">
                  <p className="text-[#6B4423] font-medium group-hover:underline">
                    Continue as {role.name} →
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Features */}
        <Card className="p-8 border-[#E8D5BF] bg-white/80 backdrop-blur-sm">
          <h3 className="text-center text-lg font-semibold text-[#2C1810] mb-4">
            Complete Café Management Solution
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm text-[#8B6F47]">
            <div>✓ Digital Menu</div>
            <div>✓ Order Management</div>
            <div>✓ Inventory Tracking</div>
            <div>✓ Table Management</div>
            <div>✓ QR Code Scanner</div>
            <div>✓ Bill Generation</div>
            <div>✓ Staff Management</div>
            <div>✓ Analytics & Reports</div>
          </div>
        </Card>
      </div>
    </div>
  );
};
