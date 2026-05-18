import { Clock, CheckCircle2, AlertCircle, Layout } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, hideStatusDropdown = false }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
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
    <div className="bg-white p-6 rounded-[16px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 duration-300 transition-all group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
          <Layout size={12} className="text-slate-400" />
          <span className="text-[10px] text-slate-500 font-bold truncate max-w-[90px]">
            {task.project_name || 'Project'}
          </span>
        </div>
      </div>

      <h3 className="text-base font-bold text-[#1F2937] mb-2 line-clamp-1 group-hover:text-[#1E3A5F] transition-colors leading-tight">
        {task.title}
      </h3>
      <p className="text-[#6B7280] text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
        {task.description || 'No description provided.'}
      </p>

      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon(task.status)}
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">
            {task.status.replace('_', ' ')}
          </span>
        </div>

        {!hideStatusDropdown && onStatusChange && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold py-1 px-2 text-slate-600 hover:text-[#1F2937] focus:outline-none transition-colors"
          >
            <option value="todo" className="bg-white">TODO</option>
            <option value="in_progress" className="bg-white">IN PROGRESS</option>
            <option value="done" className="bg-white">DONE</option>
          </select>
        )}
      </div>

      {task.due_date && (
        <div className="mt-4 flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <Clock size={12} className="mr-1.5" />
          Due {new Date(task.due_date).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
