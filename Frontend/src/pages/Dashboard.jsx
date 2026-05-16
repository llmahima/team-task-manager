import { useState, useEffect } from 'react';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { CheckCircle2, Clock, AlertCircle, ListTodo, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 mt-20 text-white">Loading stats...</div>;
  if (!stats) return <div className="p-8 mt-20 text-white">No data available. Join or create a project to see stats.</div>;

  const statusData = Object.entries(stats.tasks_by_status).map(([name, value]) => ({
    name: name.replace('_', ' ').toUpperCase(),
    value
  }));

  const userData = Object.entries(stats.tasks_per_user).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#38bdf8', '#fbbf24', '#10b981', '#f87171'];

  const StatCard = ({ title, value, icon: Icon, color, subValue }) => (
    <div className="glass p-6 rounded-3xl border border-white/10 flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        {subValue && <p className="text-rose-400 text-xs mt-2 flex items-center">
          <AlertCircle size={12} className="mr-1" /> {subValue} Overdue
        </p>}
      </div>
      <div className={`p-3 rounded-2xl ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400">Track your team's progress and productivity</p>
        </div>
        <div className="glass px-4 py-2 rounded-full border border-white/10 flex items-center space-x-2">
          <TrendingUp size={16} className="text-primary-400" />
          <span className="text-sm font-medium text-slate-200">Live Updates</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Tasks" 
          value={stats.total_tasks} 
          icon={ListTodo} 
          color="bg-primary-500/10 text-primary-400" 
          subValue={stats.overdue_tasks}
        />
        <StatCard 
          title="To Do" 
          value={stats.tasks_by_status.todo || 0} 
          icon={Clock} 
          color="bg-slate-500/10 text-slate-400" 
        />
        <StatCard 
          title="In Progress" 
          value={stats.tasks_by_status.in_progress || 0} 
          icon={Clock} 
          color="bg-amber-500/10 text-amber-400" 
        />
        <StatCard 
          title="Completed" 
          value={stats.tasks_by_status.done || 0} 
          icon={CheckCircle2} 
          color="bg-emerald-500/10 text-emerald-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-8 rounded-3xl border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-6">Tasks by Status</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-8 rounded-3xl border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-6">Tasks Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userData.length > 0 ? userData : [{ name: 'No User', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(userData.length > 0 ? userData : [{ name: 'No User', value: 1 }]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                   itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {userData.map((user, index) => (
              <div key={user.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-slate-400">{user.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
