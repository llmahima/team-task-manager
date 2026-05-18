import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderOpen, CheckSquare, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!user) return null;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderOpen },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Settings', path: '#settings', icon: Settings }
  ];

  const username = user?.email ? user.email.split('@')[0] : 'Admin';
  const displayName = username.charAt(0).toUpperCase() + username.slice(1);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <aside className="fixed top-[60px] left-0 bottom-0 w-[240px] bg-white text-slate-700 flex flex-col z-30 border-r border-slate-200 font-sans shadow-sm pt-4">
        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = item.path === '#settings' 
              ? isSettingsOpen
              : item.path === '/dashboard' 
                ? location.pathname === '/dashboard' 
                : location.pathname.startsWith(item.path);
            const Icon = item.icon;

            const handleClick = (e) => {
              if (item.path === '#settings') {
                e.preventDefault();
                setIsSettingsOpen(true);
              }
            };

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={handleClick}
                className={`mx-3 px-4 py-2.5 rounded-xl flex items-center space-x-3 text-[14px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#EBF3FE] text-[#1E80F5] font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#1E80F5]' : 'text-slate-400'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section Pinned to Bottom */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 text-[14px] font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all py-2.5 px-4 rounded-xl"
          >
            <LogOut size={18} className="text-slate-400 group-hover:text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl text-slate-800 font-sans">
            <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Profile Settings</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  readOnly
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-600 focus:outline-none cursor-not-allowed"
                  value={displayName}
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  readOnly
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-600 focus:outline-none cursor-not-allowed"
                  value={user?.email || ''}
                />
              </div>
            </div>
            
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="w-full bg-[#1E3A5F] hover:bg-[#152943] text-white py-3 rounded-xl font-bold transition-all shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
