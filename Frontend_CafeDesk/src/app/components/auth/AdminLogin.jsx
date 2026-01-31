import { useState } from 'react';
import { Coffee, User, Lock, Shield } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password, 'admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A2C1A] to-[#2C1810] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#2D5A3D] rounded-2xl mb-4 shadow-lg">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CafeDesk</h1>
          <p className="text-[#F5E6D3]">Admin Portal</p>
          <p className="text-xs text-[#F5E6D3]/70 mt-1">by Samarth Pawar</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E8D5BF]">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-[#6B4423]" />
            <h2 className="text-xl font-semibold text-[#2C1810]">Administrator Access</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Admin Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B6F47]" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B6F47]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#6B4423] hover:bg-[#4A2C1A] text-white">
              Access Dashboard
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#8B6F47]">
            <p>Demo: Use any username/password</p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-[#2D5A3D]/20 backdrop-blur-sm rounded-lg p-4 border border-[#2D5A3D]/30">
          <p className="text-xs text-[#F5E6D3] text-center">
            <Shield className="w-3 h-3 inline mr-1" />
            Secure Admin Access - All actions are logged
          </p>
        </div>
      </div>
    </div>
  );
};
