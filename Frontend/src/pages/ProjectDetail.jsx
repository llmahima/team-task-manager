import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, LayoutGrid, ArrowLeft, Mail, Plus, Trash2, User as UserIcon, Shield } from 'lucide-react';
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

  if (loading) return <div className="p-8 mt-20 text-white">Loading project details...</div>;
  if (!project) return null;

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto pb-12">
      <Link to="/projects" className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors group">
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Info & Members */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass p-8 rounded-3xl border border-white/10">
            <h1 className="text-3xl font-bold text-white mb-4">{project.name}</h1>
            <p className="text-slate-400 mb-6">{project.description || 'No description provided.'}</p>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <Shield size={14} />
              <span>Created by {project.created_by_id === user?.id ? 'You' : 'Admin'}</span>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Users size={20} className="mr-2 text-primary-400" /> Members
              </h3>
              <span className="bg-white/5 px-3 py-1 rounded-full text-xs text-slate-400 border border-white/10">
                {project.members.length} Total
              </span>
            </div>

            <div className="space-y-4 mb-8">
              {project.members.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center font-bold">
                      {m.user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{m.user.name}</p>
                      <p className="text-slate-500 text-xs">{m.role}</p>
                    </div>
                  </div>
                  {isAdmin && m.user_id !== user.id && (
                    <button 
                      onClick={() => handleRemoveMember(m.user_id)}
                      className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isAdmin && (
              <form onSubmit={handleAddMember} className="space-y-4 pt-6 border-t border-white/5">
                <h4 className="text-sm font-bold text-slate-300">Add New Member</h4>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="email"
                    required
                    placeholder="Member email..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    className="bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white flex-grow focus:outline-none"
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <button
                    disabled={actionLoading}
                    className="bg-primary-500 hover:bg-primary-600 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Project Tasks */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Project Tasks</h2>
            <div className="flex space-x-2">
               {/* Filters could go here */}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.tasks && project.tasks.length > 0 ? (
              project.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center glass rounded-3xl border border-white/10">
                <LayoutGrid size={48} className="mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">No tasks in this project yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
