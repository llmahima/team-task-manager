import { Clock, CheckCircle2, AlertCircle, Layout } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, hideStatusDropdown = false }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'in_progress': return <Clock size={16} className="text-amber-500" />;
      default: return <AlertCircle size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="glass p-6 rounded-3xl border border-white/10 hover:border-primary-500/30 transition-all group h-full flex flex-col shadow-lg hover:shadow-primary-500/10">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <div className="flex items-center space-x-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
          <Layout size={12} className="text-slate-500" />
          <span className="text-[10px] text-slate-400 font-bold truncate max-w-[80px]">
            {task.project_name}
          </span>
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
        {task.title}
      </h3>
      <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
        {task.description || 'No description provided.'}
      </p>

      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon(task.status)}
          <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">
            {task.status.replace('_', ' ')}
          </span>
        </div>
        
        {!hideStatusDropdown && onStatusChange && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold py-1 px-2 text-slate-400 hover:text-white focus:outline-none transition-colors"
          >
            <option value="todo" className="bg-[#1e293b]">TODO</option>
            <option value="in_progress" className="bg-[#1e293b]">IN PROGRESS</option>
            <option value="done" className="bg-[#1e293b]">DONE</option>
          </select>
        )}
      </div>

      {task.due_date && (
        <div className="mt-4 flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <Clock size={12} className="mr-1.5" />
          Due {new Date(task.due_date).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
