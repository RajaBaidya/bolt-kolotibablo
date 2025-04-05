import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User2, LogOut, Users, DollarSign, Ban, Activity, LineChart } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminNavbar({ user }: { user: any }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="navbar-admin bg-[#1a1a1a] text-white p-4 fixed w-full top-0 z-50">
      <div className="navbar-container max-w-7xl mx-auto flex justify-between items-center">
        <div className="navbar-stats flex items-center space-x-8">
          <div className="stat-item flex items-center space-x-4">
            <div className="stat-label text-gray-400">TOTAL USERS</div>
            <div className="stat-value text-2xl">{user.total_users || 0}</div>
          </div>
        </div>

        <div className="navbar-actions flex items-center space-x-4">
          <button 
            onClick={() => navigate('/withdraw')}
            className="withdraw-button bg-[#00ffff] text-black px-4 py-2 rounded hover:bg-[#00cccc] transition"
          >
            Withdraw
          </button>

          <div className="admin-menu relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="menu-button flex items-center space-x-2 bg-[#333] px-3 py-2 rounded"
            >
              <span className="admin-initial text-[#00ffff]">R</span>
              <span className="username">{user.username}</span>
            </button>

            {isMenuOpen && (
              <div className="menu-dropdown absolute right-0 mt-2 w-64 bg-[#2a2a2a] rounded-lg shadow-lg py-2">
                <div className="menu-header px-4 py-2 text-lg font-semibold text-gray-300">ADMIN MENU</div>
                <a href="/admin" className="menu-item flex items-center px-4 py-2 text-sm hover:bg-[#333] cursor-pointer">
                  <Home size={16} className="mr-2" />
                  Home
                </a>
                <a href="/users" className="menu-item flex items-center px-4 py-2 text-sm hover:bg-[#333] cursor-pointer">
                  <User2 size={16} className="mr-2" />
                  USER DETAILS
                </a>
                <div className="admin-actions px-4 py-2">
                  <div className="menu-item flex items-center px-4 py-2 text-sm hover:bg-[#333] cursor-pointer">
                    <DollarSign size={16} className="mr-2" />
                    USER PAYMENT
                  </div>
                  <div className="menu-item flex items-center px-4 py-2 text-sm hover:bg-[#333] cursor-pointer">
                    <Activity size={16} className="mr-2" />
                    WITHDRAW REQUEST
                  </div>
                  <div className="menu-item flex items-center px-4 py-2 text-sm hover:bg-[#333] cursor-pointer">
                    <Ban size={16} className="mr-2" />
                    BAN USER
                  </div>
                </div>
                <div className="menu-stats border-t border-gray-700 mt-2 pt-2">
                  <div className="stats-header px-4 py-2 text-sm text-gray-400">Statistics</div>
                  <div className="menu-item flex items-center px-4 py-2 text-sm hover:bg-[#333] cursor-pointer">
                    <LineChart size={16} className="mr-2" />
                    Monitor real-time earnings
                  </div>
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