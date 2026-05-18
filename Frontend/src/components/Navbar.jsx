import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const username = user?.email ? user.email.split('@')[0] : 'Admin';
  const displayName = username.charAt(0).toUpperCase() + username.slice(1);
  const initials = displayName.substring(0, 1).toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0F2942] border-b border-white/10 px-6 h-[60px] flex items-center justify-between font-sans shadow-md">
      {/* Left Logo Segment & Menu toggle */}
      <div className="flex items-center">
        {/* TTM Logo aligned with sidebar */}
        <div className="w-[180px] flex items-center space-x-2">
          <Link to="/dashboard" className="flex items-center space-x-2 text-white font-extrabold text-[20px]">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-base font-bold">✓</span>
            </div>
            <span className="tracking-tight">TTM</span>
          </Link>
        </div>
        
        {/* Menu Hamburger */}
        <button className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
          <Menu size={18} />
        </button>
      </div>

      {/* Search Bar with Shortcut hint */}
      <div className="relative max-w-xs w-full ml-6 hidden sm:block">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={14} />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full bg-[#1b3d5e]/50 hover:bg-[#204970]/50 focus:bg-[#204970]/80 text-white placeholder:text-white/40 border border-white/10 rounded-xl py-1.5 pl-9 pr-14 text-xs focus:outline-none transition-all shadow-inner focus:ring-1 focus:ring-blue-500/30"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-white/10 border border-white/5 rounded px-1 py-0.5 pointer-events-none">
          <span className="text-[8px] font-bold text-white/50 tracking-wider">Ctrl + K</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-5">
        {/* Notification Bell with Blue Count Badge */}
        <button className="relative text-white/80 hover:text-white p-2 rounded-xl transition-all hover:bg-white/5">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border border-[#0F2942]">
            3
          </span>
        </button>

        {/* Profile Avatar & Stacked Name/Email with Chevron */}
        <div className="flex items-center space-x-3 pl-3 border-l border-white/10 cursor-pointer group py-1">
          <div className="w-8 h-8 rounded-full bg-white text-[#0F2942] flex items-center justify-center font-extrabold text-xs shadow-sm select-none transition-transform group-hover:scale-105">
            {initials}
          </div>
          <div className="flex flex-col text-left leading-tight hidden md:flex">
            <span className="text-xs font-bold text-white tracking-wide">{user.email}</span>
            <span className="text-[10px] text-white/50 font-bold">{displayName}</span>
          </div>
          <ChevronDown size={14} className="text-white/60 transition-transform group-hover:translate-y-0.5 duration-200" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;






