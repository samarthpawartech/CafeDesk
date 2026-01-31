import { useState } from 'react';
import { Users, UserPlus, Mail, Phone, Clock, CheckCircle, XCircle } from 'lucide-react';
import { employees as initialEmployees } from '@/app/utils/mockData';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';

export const EmployeeManagement = () => {
  const [employees, setEmployees] = useState(initialEmployees);

  const roleColors = {
    Barista: 'bg-[#6B4423]',
    Waiter: 'bg-[#2D5A3D]',
    Chef: 'bg-[#D4A574]',
    Manager: 'bg-[#8B6F47]',
  };

  const shiftColors = {
    Morning: 'bg-blue-500',
    Evening: 'bg-purple-500',
    'Full-day': 'bg-green-500',
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const toggleStatus = (id) => {
    setEmployees(employees.map(emp => 
      emp.id === id 
        ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' }
        : emp
    ));
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-[#E8D5BF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#6B4423] rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#8B6F47]">Total Staff</p>
              <p className="text-2xl font-bold text-[#2C1810]">{employees.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#E8D5BF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#8B6F47]">Active</p>
              <p className="text-2xl font-bold text-[#2C1810]">
                {employees.filter(e => e.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#E8D5BF]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#8B6F47]">On Shift</p>
              <p className="text-2xl font-bold text-[#2C1810]">
                {employees.filter(e => e.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#E8D5BF]">
          <Button className="w-full bg-[#2D5A3D] hover:bg-[#1F3D2A] text-white h-full">
            <UserPlus className="w-5 h-5 mr-2" />
            Add Employee
          </Button>
        </Card>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(employee => (
          <Card key={employee.id} className="p-6 border-[#E8D5BF] hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 bg-[#6B4423] text-white">
                  <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-[#2C1810]">{employee.name}</h3>
                  <Badge className={`${roleColors[employee.role]} text-white mt-1`}>
                    {employee.role}
                  </Badge>
                </div>
              </div>
              <Badge className={
                employee.status === 'active' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-400 text-white'
              }>
                {employee.status === 'active' ? (
                  <><CheckCircle className="w-3 h-3 mr-1" />Active</>
                ) : (
                  <><XCircle className="w-3 h-3 mr-1" />Inactive</>
                )}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-[#8B6F47]">
                <Mail className="w-4 h-4" />
                {employee.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#8B6F47]">
                <Phone className="w-4 h-4" />
                {employee.phone}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-[#8B6F47]" />
                <Badge className={`${shiftColors[employee.shift]} text-white`}>
                  {employee.shift} Shift
                </Badge>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-[#E8D5BF]">
              <Button
                onClick={() => toggleStatus(employee.id)}
                variant="outline"
                size="sm"
                className="flex-1 border-[#E8D5BF] text-[#6B4423] hover:bg-[#F5E6D3]"
              >
                {employee.status === 'active' ? 'Deactivate' : 'Activate'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-[#E8D5BF] text-[#6B4423] hover:bg-[#F5E6D3]"
              >
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Table */}
      <Card className="border-[#E8D5BF]">
        <div className="p-6 border-b border-[#E8D5BF]">
          <h3 className="font-semibold text-[#2C1810]">Employee Details</h3>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5E6D3] hover:bg-[#F5E6D3]">
                <TableHead className="text-[#2C1810]">Name</TableHead>
                <TableHead className="text-[#2C1810]">Role</TableHead>
                <TableHead className="text-[#2C1810]">Email</TableHead>
                <TableHead className="text-[#2C1810]">Phone</TableHead>
                <TableHead className="text-[#2C1810]">Shift</TableHead>
                <TableHead className="text-[#2C1810]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map(employee => (
                <TableRow key={employee.id} className="hover:bg-[#FBF8F3]">
                  <TableCell className="font-medium text-[#2C1810]">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8 bg-[#6B4423] text-white">
                        <AvatarFallback className="text-xs">{getInitials(employee.name)}</AvatarFallback>
                      </Avatar>
                      {employee.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${roleColors[employee.role]} text-white`}>
                      {employee.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#8B6F47]">{employee.email}</TableCell>
                  <TableCell className="text-[#8B6F47]">{employee.phone}</TableCell>
                  <TableCell>
                    <Badge className={`${shiftColors[employee.shift]} text-white`}>
                      {employee.shift}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      employee.status === 'active' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-400 text-white'
                    }>
                      {employee.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
