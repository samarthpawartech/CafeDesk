import { useState } from 'react';
import { Coffee, User, Lock } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

export const CustomerLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password, 'customer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF8F3] to-[#E8D5BF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#6B4423] rounded-2xl mb-4 shadow-lg">
            <Coffee className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#2C1810] mb-2">CafeDesk</h1>
          <p className="text-[#8B6F47]">Customer Portal</p>
          <p className="text-xs text-[#8B6F47] mt-1">by Samarth Pawar</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E8D5BF]">
          <h2 className="text-xl font-semibold text-[#2C1810] mb-6">Welcome Back!</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B6F47]" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
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

            <Button type="submit" className="w-full bg-[#6B4423] hover:bg-[#4A2C1A] text-white">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#8B6F47]">
            <p>Demo: Use any username/password</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#8B6F47]">
            Are you staff?{' '}
            <a href="#" className="text-[#6B4423] hover:underline font-medium">
              Staff Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
