import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User2, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function UserNavbar({ user }: { user: any }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="navbar-user bg-[#1a1a1a] text-white p-4 fixed w-full top-0 z-50">
      <div className="navbar-container max-w-7xl mx-auto flex justify-between items-center">
        <div className="navbar-stats flex items-center space-x-8">
          <div className="stat-item flex items-center space-x-4">
            <div className="stat-label text-[#00ffff]">TOTAL SOLVED</div>
            <div className="stat-value">{user.completed_tasks || 0}</div>
          </div>
          <div className="stat-item flex items-center space-x-4">
            <div className="stat-label text-[#00ffff]">BALANCE</div>
            <div className="stat-value">${user.earnings || 0}</div>
          </div>
        </div>

        <div className="navbar-actions flex items-center space-x-4">
          <button 
            onClick={() => navigate('/withdraw')}
            className="withdraw-button bg-[#00ffff] text-black px-4 py-2 rounded hover:bg-[#00cccc] transition"
          >
            Withdraw
          </button>

          <div className="user-menu relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="menu-button flex items-center space-x-2 bg-[#333] px-3 py-2 rounded"
            >
              <span className="user-initial text-[#00ffff]">R</span>
              <span className="username">{user.username}</span>
            </button>

            {isMenuOpen && (
              <div className="menu-dropdown absolute right-0 mt-2 w-48 bg-[#2a2a2a] rounded-lg shadow-lg py-2">
                <div className="menu-header px-4 py-2 text-sm text-gray-300">User Menu</div>
                <a href="/dashboard" className="menu-item flex items-center px-4 py-2 text-sm hover:bg-[#333] cursor-pointer">
                  <Home size={16} className="mr-2" />
                  Home
                </a>
                <a href="/profile" className="menu-item flex items-center px-4 py-2 text-sm hover:bg-[#333] cursor-pointer">
                  <User2 size={16} className="mr-2" />
                  Profile Details
                </a>
                <div className="menu-stats px-4 py-2">
                  <div className="text-sm text-gray-300">Daily Statistics</div>
                  <div className="text-sm mt-1">Tasks Completed Today: {user.daily_tasks || 0}</div>
                  <div className="text-sm">Earnings: ${user.daily_earnings || 0}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="menu-item flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-[#333] cursor-pointer"
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