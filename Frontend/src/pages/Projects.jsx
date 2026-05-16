import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Plus, FolderKanban, Users, ArrowRight, User as UserIcon, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects/');
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects/', formData);
      setShowModal(false);
      setFormData({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      console.error('Failed to create project', err);
      alert(err.response?.data?.detail || 'Failed to create project');
    }
  };

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Workspaces</h1>
          <p className="text-slate-400">
            {isAdmin ? "Manage your team's projects and members" : "Projects you are collaborating on"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/25 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-white">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {projects.length > 0 ? (
              projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass p-8 rounded-[32px] border border-white/10 hover:border-primary-500/30 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-all"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-400 shadow-inner">
                      <FolderKanban size={28} />
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border uppercase ${
                         project.my_role === 'ADMIN' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 'bg-slate-500/10 text-slate-400 border-white/10'
                       }`}>
                         {project.my_role || 'Member'}
                       </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-8 line-clamp-2 leading-relaxed">
                    {project.description || 'Collaborate with your team on this workspace.'}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1.5 text-slate-500">
                        <Users size={16} />
                        <span className="text-xs font-bold">{project.members?.length || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-slate-500">
                        <CheckSquare size={16} />
                        <span className="text-xs font-bold text-primary-400/80">{project.assigned_tasks_count || 0} Assigned</span>
                      </div>
                    </div>
                    <Link 
                      to={`/projects/${project.id}`}
                      className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-primary-500 transition-all group-hover:shadow-lg group-hover:shadow-primary-500/20"
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center glass rounded-3xl border border-white/10">
                <FolderKanban size={48} className="mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">No workspaces found.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Create Project Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass p-8 rounded-3xl border border-white/10 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Create New Workspace</h2>
              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Project Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    placeholder="e.g. Marketing Q3"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                    placeholder="Describe the workspace..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/25"
                  >
                    Create Workspace
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple icon wrapper to fix missing import in TaskCard used here
const CheckSquare = ({ size, className }) => <CheckCircle2 size={size} className={className} />;
import { CheckCircle2 } from 'lucide-react';

export default Projects;
