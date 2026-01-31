import { useState } from 'react';
import { Coffee, User, Lock, Briefcase } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

export const EmployeeLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password, 'employee');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D5A3D] to-[#1F3D2A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-4 shadow-lg">
            <Briefcase className="w-12 h-12 text-[#2D5A3D]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CafeDesk</h1>
          <p className="text-[#F5E6D3]">Employee Portal</p>
          <p className="text-xs text-[#F5E6D3]/70 mt-1">by Samarth Pawar</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E8D5BF]">
          <h2 className="text-xl font-semibold text-[#2C1810] mb-6">Staff Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Employee ID</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B6F47]" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter employee ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B6F47]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#2D5A3D] hover:bg-[#1F3D2A] text-white">
              Clock In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#8B6F47]">
            <p>Demo: Use any employee ID/password</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#F5E6D3]">
            Need help?{' '}
            <a href="#" className="text-white hover:underline font-medium">
              Contact Admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
