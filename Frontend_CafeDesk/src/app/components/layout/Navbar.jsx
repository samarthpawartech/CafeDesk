import { Bell, User, Search } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export const Navbar = ({ title }) => {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-[#E8D5BF] px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#2C1810]">{title}</h1>
          <p className="text-sm text-[#8B6F47]">Welcome back, {user?.name}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B6F47]" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-[#FBF8F3] border border-[#E8D5BF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B4423] w-64"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-[#FBF8F3] rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-[#6B4423]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#C44536] rounded-full"></span>
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 hover:bg-[#FBF8F3] p-2 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-[#2D5A3D] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden md:block text-sm font-medium text-[#2C1810]">{user?.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
