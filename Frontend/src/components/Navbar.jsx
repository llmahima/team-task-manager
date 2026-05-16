import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FolderKanban, CheckSquare, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold gradient-text">
          TTM
        </Link>
        
        <div className="flex items-center space-x-8">
          <Link to="/dashboard" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/projects" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
            <FolderKanban size={20} />
            <span>Projects</span>
          </Link>
          <Link to="/tasks" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
            <CheckSquare size={20} />
            <span>My Tasks</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <UserIcon size={16} className="text-primary-400" />
            <span className="text-sm text-slate-200">{user.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
