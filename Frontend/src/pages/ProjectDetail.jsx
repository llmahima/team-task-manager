import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, LayoutGrid, ArrowLeft, Mail, Plus, Trash2, Shield, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('MEMBER');
  const [actionLoading, setActionLoading] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (err) {
      console.error('Failed to fetch project details', err);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post(`/projects/${id}/members`, {
        email: newMemberEmail,
        role: newMemberRole
      });
      setNewMemberEmail('');
      fetchProjectDetails();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add member');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      fetchProjectDetails();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to remove member');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#1E3A5F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#6B7280] font-medium animate-pulse text-sm">Loading workspace details...</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="w-full text-[#1F2937] font-sans pb-12 pt-4">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Back Link */}
        <Link 
          to="/projects" 
          className="inline-flex items-center text-slate-500 hover:text-[#1E3A5F] font-bold text-xs transition-colors group uppercase tracking-wider"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Workspaces</span>
        </Link>

        {/* Two Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Project Info & Members */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Info Card */}
            <div className="bg-white p-6 rounded-[16px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.05)] transition-all">
              <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight mb-2 leading-tight">
                {project.name}
              </h1>
              <p className="text-[#6B7280] text-sm mb-6 leading-relaxed font-medium">
                {project.description || 'Collaborate with your team on this workspace.'}
              </p>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 border-t border-slate-50 pt-4 uppercase tracking-wider">
                <Shield size={14} className="text-slate-300" />
                <span>Created by {project.created_by_id === user?.id ? 'You' : 'Admin'}</span>
              </div>
            </div>

            {/* Members Card */}
            <div className="bg-white p-6 rounded-[16px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.05)] transition-all">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-50">
                <h3 className="text-sm font-bold text-[#1F2937] flex items-center uppercase tracking-wider">
                  <Users size={16} className="mr-2 text-slate-400" /> Members
                </h3>
                <span className="bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  {project.members.length} Total
                </span>
              </div>

              {/* Members List */}
              <div className="space-y-3 mb-6 max-h-[250px] overflow-y-auto pr-1">
                {project.members.map((m) => (
                  <div 
                    key={m.id} 
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50/50 border border-transparent hover:border-slate-100 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-[#1E3A5F]/5 text-[#1E3A5F] flex items-center justify-center font-extrabold text-xs shadow-sm capitalize">
                        {m.user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1F2937] leading-tight capitalize">{m.user.name}</p>
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{m.role}</p>
                      </div>
                    </div>
                    {isAdmin && m.user_id !== user.id && (
                      <button
                        onClick={() => handleRemoveMember(m.user_id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Remove member"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Member Form (Admin only) */}
              {isAdmin && (
                <form onSubmit={handleAddMember} className="space-y-4 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Add New Member</h4>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="email"
                      required
                      placeholder="Enter email address..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-9 text-xs text-[#1F2937] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]/20 transition-all shadow-inner"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-600 flex-grow focus:outline-none font-bold"
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                    >
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <button
                      disabled={actionLoading}
                      className="bg-[#1E3A5F] hover:bg-[#152943] text-white p-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
                      title="Add member"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>

          {/* Right Column: Project Tasks list */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider flex items-center">
                <LayoutGrid size={16} className="mr-2 text-slate-400" /> Project Tasks
              </h2>
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.tasks && project.tasks.length > 0 ? (
                project.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[16px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] max-w-md mx-auto w-full">
                  <LayoutGrid size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-bold text-[#1F2937] mb-1">No Tasks in Workspace</h3>
                  <p className="text-[#6B7280] text-sm">Create a task in the tasks workspace to start managing progress.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProjectDetail;
