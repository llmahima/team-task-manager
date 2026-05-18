import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Plus, FolderKanban, Users, ArrowRight, AlertCircle } from 'lucide-react';
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
    <div className="w-full text-[#1F2937] font-sans pb-12 pt-4">
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">Workspaces</h1>
            <p className="text-[#6B7280] text-sm font-medium mt-1">
              {isAdmin ? "Manage your team's projects and members" : "Projects you are collaborating on"}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#1E3A5F] hover:bg-[#152943] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center space-x-2 text-sm self-start sm:self-center"
            >
              <Plus size={18} />
              <span>New Project</span>
            </button>
          )}
        </div>

        {/* Project Workspaces Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-[#1E3A5F] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#6B7280] font-medium animate-pulse text-sm">Loading workspaces...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-[16px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 duration-300 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[250px]"
                  >
                    <div>
                      {/* Top Header Row of Card */}
                      <div className="flex justify-between items-start mb-5">
                        <div className="w-12 h-12 bg-[#1E3A5F]/5 rounded-2xl flex items-center justify-center text-[#1E3A5F] shadow-sm">
                          <FolderKanban size={24} />
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${
                          project.my_role === 'ADMIN' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-slate-50 text-slate-500 border-slate-100'
                        }`}>
                          {project.my_role || 'Member'}
                        </span>
                      </div>

                      {/* Title and Description */}
                      <h3 className="text-lg font-bold text-[#1F2937] mb-2 group-hover:text-[#1E3A5F] transition-colors leading-tight">
                        {project.name}
                      </h3>
                      <p className="text-[#6B7280] text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
                        {project.description || 'Collaborate with your team on this workspace.'}
                      </p>
                    </div>

                    {/* Stats Footer Row of Card */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                      <div className="flex items-center space-x-4 text-slate-500">
                        <div className="flex items-center space-x-1.5">
                          <Users size={15} className="text-slate-400" />
                          <span className="text-xs font-bold">{project.members?.length || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <CheckSquare size={15} className="text-slate-400" />
                          <span className="text-xs font-bold text-[#1E3A5F]/80">{project.assigned_tasks_count || 0} Assigned</span>
                        </div>
                      </div>
                      <Link
                        to={`/projects/${project.id}`}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-white hover:bg-[#1E3A5F] rounded-xl transition-all shadow-sm group-hover:shadow"
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 max-w-md mx-auto w-full">
                  <FolderKanban size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-bold text-[#1F2937] mb-1">No Workspaces Found</h3>
                  <p className="text-[#6B7280] text-sm mb-6">Create a workspace to start collaborating on tasks.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-2xl text-slate-800 font-sans"
            >
              <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Create Workspace</h2>
              
              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]/30 transition-all shadow-inner text-sm"
                    placeholder="e.g. Marketing Launch Q3"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]/30 transition-all shadow-inner text-sm resize-none"
                    placeholder="Describe what this workspace is about..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                
                <div className="flex space-x-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#1E3A5F] hover:bg-[#152943] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md text-sm"
                  >
                    Create
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

// Simple icon wrapper to fix missing import
const CheckSquare = ({ size, className }) => <CheckCircle2 size={size} className={className} />;
import { CheckCircle2 } from 'lucide-react';

export default Projects;
