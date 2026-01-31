import { useState } from 'react';
import { Sidebar } from '@/app/components/layout/Sidebar';
import { Navbar } from '@/app/components/layout/Navbar';
import { OrdersList } from '@/app/components/employee/OrdersList';
import { TablesView } from '@/app/components/employee/TablesView';
import { BillsView } from '@/app/components/employee/BillsView';

export const EmployeeDashboard = () => {
  const [currentView, setCurrentView] = useState('orders');

  const renderView = () => {
    switch (currentView) {
      case 'orders':
        return <OrdersList />;
      case 'tables':
        return <TablesView />;
      case 'bills':
        return <BillsView />;
      default:
        return <OrdersList />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'orders':
        return 'Orders Management';
      case 'tables':
        return 'Table Management';
      case 'bills':
        return 'Bills & Payments';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-[#FBF8F3]">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={getTitle()} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};
