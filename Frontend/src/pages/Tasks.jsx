import { useState, useEffect } from 'react';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Plus, Filter, Search, CheckSquare, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form state for new task
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    project_id: '',
    assigned_to_id: '',
  });

  const [projectMembers, setProjectMembers] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (formData.project_id) {
      const selectedProj = projects.find(p => p.id === parseInt(formData.project_id));
      if (selectedProj) {
        setProjectMembers(selectedProj.members || []);
      }
    } else {
      setProjectMembers([]);
    }
  }, [formData.project_id, projects]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks/');
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects/');
      setProjects(response.data);
      if (response.data.length > 0) {
        setFormData(prev => ({ ...prev, project_id: response.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (payload.assigned_to_id === '') delete payload.assigned_to_id;

      await api.post('/tasks/', payload);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
        project_id: projects[0]?.id || '',
        assigned_to_id: '',
      });
      fetchTasks();
    } catch (err) {
      console.error('Failed to create task', err);
      alert(err.response?.data?.detail || 'Failed to create task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="w-full text-[#1F2937] font-sans pb-12 pt-4">
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">Tasks</h1>
            <p className="text-[#6B7280] text-sm font-medium mt-1">
              {isAdmin ? "Manage all team tasks" : "Tasks assigned to you"}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#1E3A5F] hover:bg-[#152943] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center space-x-2 text-sm self-start sm:self-center"
            >
              <Plus size={18} />
              <span>Create Task</span>
            </button>
          )}
        </div>

        {/* Filter and Search Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search tasks by title or details..."
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-[#1F2937] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]/20 transition-all shadow-sm text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          {/* Status Dropdown */}
          <div className="relative min-w-[160px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-10 text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]/20 shadow-sm appearance-none font-bold text-sm cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all" className="bg-white">All Status</option>
              <option value="todo" className="bg-white">To Do</option>
              <option value="in_progress" className="bg-white">In Progress</option>
              <option value="done" className="bg-white">Completed</option>
            </select>
          </div>
        </div>

        {/* Task Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-[#1E3A5F] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#6B7280] font-medium animate-pulse text-sm">Loading task workspace...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                    onClick={() => setSelectedTask(task)}
                    className="cursor-pointer"
                  >
                    <TaskCard task={task} hideStatusDropdown={true} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 max-w-md mx-auto w-full">
                  <CheckSquare size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-bold text-[#1F2937] mb-1">No Tasks Found</h3>
                  <p className="text-[#6B7280] text-sm">Create a task to get started.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <TaskModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={fetchTasks}
            userRole={user?.role}
          />
        )}
      </AnimatePresence>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-2xl text-slate-800 font-sans overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Create Task</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                    <Layout size={14} className="mr-2 text-slate-400" /> Project
                  </label>
                  <select
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]/30 transition-all text-sm font-bold"
                    value={formData.project_id}
                    onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                  >
                    <option value="" disabled className="bg-white">Select a workspace</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id} className="bg-white">{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                    <Plus size={14} className="mr-2 text-slate-400" /> Assign To
                  </label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]/30 transition-all text-sm font-bold"
                    value={formData.assigned_to_id}
                    onChange={(e) => setFormData({ ...formData, assigned_to_id: e.target.value })}
                  >
                    <option value="" className="bg-white">Unassigned</option>
                    {projectMembers.map(m => (
                      <option key={m.id} value={m.user_id} className="bg-white">{m.user.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]/30 transition-all text-sm"
                    placeholder="e.g. Design Landing Page"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]/30 transition-all text-sm resize-none"
                    placeholder="Describe what needs to be done..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Due Date</label>
                    <input
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 text-sm focus:outline-none"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 text-sm focus:outline-none font-bold"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
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
                    Create Task
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

export default Tasks;
