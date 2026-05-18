import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, User, Layout, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

const TaskModal = ({ task, onClose, onUpdate, userRole }) => {
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
      case 'high': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-white p-8 rounded-2xl border border-slate-200 shadow-2xl overflow-y-auto max-h-[90vh] text-slate-800 font-sans"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
          title="Close details"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className="text-slate-300 text-sm">•</span>
          <span className="text-slate-500 text-xs font-bold flex items-center uppercase tracking-wider">
            <Layout size={14} className="mr-1.5 text-slate-400" /> {task.project_name}
          </span>
        </div>

        {isAdmin && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[#1E3A5F] hover:underline text-xs font-bold uppercase tracking-wider"
            >
              {isEditing ? 'Cancel Editing' : 'Edit Details'}
            </button>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl py-3 px-4 text-base font-bold text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]/20 text-sm shadow-inner"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows={4}
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl py-3 px-4 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]/20 resize-none text-sm shadow-inner"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Due Date</label>
                  <input
                    type="date"
                    className="w-full bg-slate-55 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 text-sm focus:outline-none shadow-inner"
                    value={formData.due_date ? formData.due_date.split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                  <select
                    className="w-full bg-slate-55 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 text-sm focus:outline-none font-bold shadow-inner"
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
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#1F2937] leading-tight">{task.title}</h2>
              <p className="text-[#6B7280] leading-relaxed text-sm font-medium">{task.description || 'No description provided.'}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Assigned To</p>
                    <p className="text-[#1F2937] font-bold text-sm capitalize">{task.assigned_to_name || 'Unassigned'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Due Date</p>
                    <p className="text-[#1F2937] font-bold text-sm">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date set'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status Tracker */}
          <div className="pt-6 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
              <CheckCircle2 size={14} className="mr-2 text-slate-400" /> Task Status
            </label>
            <div className="flex flex-wrap gap-2.5">
              {['todo', 'in_progress', 'done'].map((s) => {
                const isSelected = formData.status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: s })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-sm'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-[#1F2937]'
                    }`}
                  >
                    {s === 'done' ? 'COMPLETED' : s === 'in_progress' ? 'IN PROGRESS' : 'TO DO'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex space-x-4 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#1E3A5F] hover:bg-[#152943] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md text-sm disabled:opacity-50"
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
