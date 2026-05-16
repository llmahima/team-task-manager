import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Layout, Flag, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

const TaskModal = ({ task, onClose, onUpdate, userRole, employees, projects }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...task });
  const [loading, setLoading] = useState(false);

  const isAdmin = userRole === 'ADMIN';

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      if (isAdmin && isEditing) {
        await api.patch(`/tasks/${task.id}`, formData);
      } else {
        await api.patch(`/tasks/${task.id}/status`, { status: formData.status });
      }
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Failed to update task', err);
      alert('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'high': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'low': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getStatusColor = (s) => {
    switch (s) {
      case 'done': return 'bg-emerald-500/10 text-emerald-500';
      case 'in_progress': return 'bg-amber-500/10 text-amber-500';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl glass p-8 rounded-3xl border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className="text-slate-500 text-sm">•</span>
          <span className="text-slate-400 text-sm flex items-center">
            <Layout size={14} className="mr-1.5" /> {task.project_name}
          </span>
        </div>

        {isAdmin && (
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-primary-400 hover:text-primary-300 text-sm font-bold"
            >
              {isEditing ? 'Cancel Editing' : 'Edit All Details'}
            </button>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-2xl font-bold text-white focus:outline-none"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <textarea
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-slate-300 focus:outline-none resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Due Date</label>
                  <input
                    type="date"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white"
                    value={formData.due_date ? formData.due_date.split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Priority</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-white leading-tight">{task.title}</h2>
              <p className="text-slate-400 leading-relaxed text-lg">{task.description || 'No description provided.'}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/5 rounded-2xl text-slate-400">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Assigned To</p>
                    <p className="text-white font-medium">{task.assigned_to_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/5 rounded-2xl text-slate-400">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Due Date</p>
                    <p className="text-white font-medium">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date set'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="pt-6 border-t border-white/5">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-4 flex items-center">
               <CheckCircle2 size={14} className="mr-2" /> Task Status
            </label>
            <div className="flex flex-wrap gap-3">
              {['todo', 'in_progress', 'done'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: s })}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                    formData.status === s 
                      ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/25' 
                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {s.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskModal;
