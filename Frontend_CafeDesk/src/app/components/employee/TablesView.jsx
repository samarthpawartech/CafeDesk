import { useState } from 'react';
import { Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { tables as initialTables } from '@/app/utils/mockData';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';

export const TablesView = () => {
  const [tables, setTables] = useState(initialTables);

  const statusConfig = {
    available: { label: 'Available', color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50' },
    occupied: { label: 'Occupied', color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50' },
    reserved: { label: 'Reserved', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50' },
  };

  const updateTableStatus = (tableNumber, newStatus) => {
    setTables(tables.map(table => 
      table.number === tableNumber ? { ...table, status: newStatus } : table
    ));
  };

  const getTableCount = (status) => {
    return tables.filter(t => t.status === status).length;
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
              <p className="text-sm text-[#8B6F47]">Available Tables</p>
              <p className="text-2xl font-bold text-[#2C1810]">{getTableCount('available')}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#E8D5BF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#8B6F47]">Occupied Tables</p>
              <p className="text-2xl font-bold text-[#2C1810]">{getTableCount('occupied')}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#E8D5BF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#8B6F47]">Reserved Tables</p>
              <p className="text-2xl font-bold text-[#2C1810]">{getTableCount('reserved')}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map(table => {
          const config = statusConfig[table.status];
          
          return (
            <Card 
              key={table.number}
              className={`p-6 border-2 transition-all hover:shadow-lg ${
                table.status === 'available' ? 'border-green-200' :
                table.status === 'occupied' ? 'border-red-200' :
                'border-yellow-200'
              }`}
            >
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 mx-auto ${config.color} rounded-full flex items-center justify-center text-white font-bold text-2xl`}>
                  {table.number}
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#2C1810]">Table {table.number}</h3>
                  <p className="text-sm text-[#8B6F47] flex items-center justify-center gap-1 mt-1">
                    <Users className="w-3 h-3" />
                    {table.capacity} seats
                  </p>
                </div>

                <Badge className={`${config.color} text-white w-full justify-center`}>
                  {config.label}
                </Badge>

                <div className="space-y-2 pt-2">
                  {table.status === 'available' && (
                    <>
                      <Button
                        onClick={() => updateTableStatus(table.number, 'occupied')}
                        size="sm"
                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                      >
                        Occupy
                      </Button>
                      <Button
                        onClick={() => updateTableStatus(table.number, 'reserved')}
                        size="sm"
                        variant="outline"
                        className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                      >
                        Reserve
                      </Button>
                    </>
                  )}
                  {table.status === 'occupied' && (
                    <Button
                      onClick={() => updateTableStatus(table.number, 'available')}
                      size="sm"
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      Clear Table
                    </Button>
                  )}
                  {table.status === 'reserved' && (
                    <>
                      <Button
                        onClick={() => updateTableStatus(table.number, 'occupied')}
                        size="sm"
                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                      >
                        Check In
                      </Button>
                      <Button
                        onClick={() => updateTableStatus(table.number, 'available')}
                        size="sm"
                        variant="outline"
                        className="w-full border-[#E8D5BF] text-[#8B6F47] hover:bg-[#F5E6D3]"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
