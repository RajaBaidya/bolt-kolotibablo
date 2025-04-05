import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User2, LogOut, Users, DollarSign, Ban, Activity, LineChart } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar({ user }: { user: any }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Admin navbar
  if (user.is_admin) {
    return (
      <nav className="bg-[#1a1a1a] text-white p-4 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <div className="text-gray-400">TOTAL USERS</div>
              <div className="text-2xl">{user.total_users || 0}</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/withdraw')}
              className="bg-[#00ffff] text-black px-4 py-2 rounded hover:bg-[#00cccc] transition"
            >
              Withdraw
            </button>

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 bg-[#333] px-3 py-2 rounded"
              >
                <span className="text-[#00ffff]">R</span>
                <span>{user.username}</span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#2a2a2a] rounded-lg shadow-lg py-2">
                  <div className="px-4 py-2 text-lg font-semibold text-gray-300">ADMIN MENU</div>
                  <a href="/admin" className="flex items-center px-4 py-2 text-sm hover:bg-[#333] cursor-pointer">
                    <Home size={16} className="mr-2" />
                    Home
                  </a>
                  <a href="/users" className="flex items-center px-4 py-2 text-sm hover:bg-[#333] cursor-pointer">
                    <User2 size={16} className="mr-2" />
                    USER DETAILS
                  </a>
                  <div className="px-4 py-2">
                    <div className="flex items-center px-4 py-2 text-sm hover:bg-[#333] cursor-pointer">
                      <DollarSign size={16} className="mr-2" />
                      USER PAYMENT
                    </div>
                    <div className="flex items-center px-4 py-2 text-sm hover:bg-[#333] cursor-pointer">
                      <Activity size={16} className="mr-2" />
                      WITHDRAW REQUEST
                    </div>
                    <div className="flex items-center px-4 py-2 text-sm hover:bg-[#333] cursor-pointer">
                      <Ban size={16} className="mr-2" />
                      BAN USER
                    </div>
                  </div>
                  <div className="border-t border-gray-700 mt-2 pt-2">
                    <div className="px-4 py-2 text-sm text-gray-400">Statistics</div>
                    <div className="flex items-center px-4 py-2 text-sm hover:bg-[#333] cursor-pointer">
                      <LineChart size={16} className="mr-2" />
                      Monitor real-time earnings
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-[#333] cursor-pointer"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // User navbar
  return (
    <nav className="bg-[#1a1a1a] text-white p-4 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4">
            <div className="text-[#00ffff]">TOTAL SOLVED</div>
            <div>{user.completed_tasks || 0}</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-[#00ffff]">BALANCE</div>
            <div>${user.earnings || 0}</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/withdraw')}
            className="bg-[#00ffff] text-black px-4 py-2 rounded hover:bg-[#00cccc] transition"
          >
            Withdraw
          </button>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 bg-[#333] px-3 py-2 rounded"
            >
              <span className="text-[#00ffff]">R</span>
              <span>{user.username}</span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#2a2a2a] rounded-lg shadow-lg py-2">
                <div className="px-4 py-2 text-sm text-gray-300">User Menu</div>
                <a href="/dashboard" className="flex items-center px-4 py-2 text-sm hover:bg-[#333] cursor-pointer">
                  <Home size={16} className="mr-2" />
                  Home
                </a>
                <a href="/profile" className="flex items-center px-4 py-2 text-sm hover:bg-[#333] cursor-pointer">
                  <User2 size={16} className="mr-2" />
                  Profile Details
                </a>
                <div className="px-4 py-2">
                  <div className="text-sm text-gray-300">Daily Statistics</div>
                  <div className="text-sm mt-1">Tasks Completed Today: {user.daily_tasks || 0}</div>
                  <div className="text-sm">Earnings: ${user.daily_earnings || 0}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-[#333] cursor-pointer"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}