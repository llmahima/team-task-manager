import { useState, useEffect } from 'react';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { CheckCircle2, Clock, AlertCircle, ListTodo, Plus, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [overdueTasksList, setOverdueTasksList] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingDeadlinesList, setUpcomingDeadlinesList] = useState([]);
  const [teamMembersList, setTeamMembersList] = useState([]);
  const [recentActivitiesList, setRecentActivitiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/tasks/')
        ]);
        setStats(statsRes.data);

        // Overdue tasks filter
        const now = new Date();
        const overdue = tasksRes.data.filter(task => {
          if (task.status === 'done' || !task.due_date) return false;
          return new Date(task.due_date) < now;
        });
        setOverdueTasksList(overdue);

        // Recent tasks filter
        setRecentTasks(tasksRes.data.slice(0, 4));

        // Upcoming deadlines filter
        const activeTasks = tasksRes.data.filter(task => task.status !== 'done' && task.due_date);
        const sortedDeadlines = activeTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
        setUpcomingDeadlinesList(sortedDeadlines.slice(0, 3));

        // Team members dynamically mapped from tasks_per_user
        const members = Object.keys(statsRes.data.tasks_per_user).map((name, idx) => {
          const roles = ['Project Manager', 'Frontend Developer', 'Backend Architect', 'QA Engineer', 'UI/UX Designer'];
          const statuses = ['Active', 'In Meeting', 'Away', 'Offline'];
          const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'];
          const initials = name.substring(0, 2).toUpperCase();
          return {
            name,
            initials,
            role: roles[idx % roles.length],
            status: statuses[idx % statuses.length],
            color: colors[idx % colors.length]
          };
        });
        setTeamMembersList(members);

        // Recent activities simulation
        setRecentActivitiesList([
          { id: 1, type: 'status', user: 'Admin', action: 'completed task', target: 'Redesign Navbar & Sidebar', time: '10 mins ago' },
          { id: 2, type: 'create', user: 'Mahima', action: 'created project', target: 'Marketing Launch Q3', time: '2 hours ago' },
          { id: 3, type: 'assign', user: 'Emp', action: 'assigned task', target: 'Fix database connection pool', time: '5 hours ago' },
          { id: 4, type: 'comment', user: 'Admin', action: 'commented on', target: 'Auth page responsive layout', time: 'Yesterday' }
        ]);

      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#1E3A5F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#6B7280] font-medium animate-pulse">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center font-sans p-6">
        <div className="bg-white p-8 rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] max-w-md w-full text-center border-t-4 border-t-[#1E3A5F]">
          <AlertCircle className="mx-auto text-[#6B7280] mb-4" size={48} />
          <h3 className="text-xl font-bold text-[#1F2937] mb-2">No Stats Available</h3>
          <p className="text-[#6B7280] text-sm mb-6">
            You need to join or create a project to generate dashboard statistics.
          </p>
          <button
            onClick={() => window.location.href = '/projects'}
            className="bg-[#1E3A5F] hover:bg-[#152943] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md w-full"
          >
            Go to Projects
          </button>
        </div>
      </div>
    );
  }

  const username = user?.email ? user.email.split('@')[0] : 'Admin';
  const displayName = username.charAt(0).toUpperCase() + username.slice(1);

  // Chart Data Processing
  const statusOrder = ['todo', 'in_progress', 'done'];
  const statusLabels = {
    'todo': 'To Do',
    'in_progress': 'In Progress',
    'done': 'Completed'
  };
  const statusColors = {
    'todo': '#6B7280',
    'in_progress': '#F59E0B',
    'done': '#10B981'
  };

  const statusData = statusOrder.map(key => ({
    name: statusLabels[key],
    value: stats.tasks_by_status[key] || 0,
    fill: statusColors[key]
  }));

  const userData = Object.entries(stats.tasks_per_user).map(([name, value], index) => {
    const colors = ['#1E3A5F', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
    return {
      name,
      value,
      fill: colors[index % colors.length]
    };
  });

  return (
    <div className="w-full text-[#1F2937] font-sans pb-12 pt-6">
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* HERO SECTION WITH PERFECT TOP SPACING GAP */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 transition-all hover:shadow-[0_6px_25px_rgba(0,0,0,0.05)]">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">
              Welcome back, {displayName} 👋
            </h1>
            <p className="text-[#6B7280] text-sm font-medium">
              Track your projects and tasks in real time.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/tasks'}
            className="bg-[#1E3A5F] hover:bg-[#152943] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center space-x-2 text-sm self-start md:self-center"
          >
            <Plus size={18} />
            <span>Create Task</span>
          </button>
        </div>

        {/* STAT CARDS - CLEAN AND MINIMAL (ONLY ICON, TITLE, NUMBER) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Tasks */}
          <div className="bg-white p-5 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 border-l-4 border-l-[#1E3A5F] flex flex-col justify-between h-[105px] transition-all hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 duration-300">
            <div className="flex justify-between items-start">
              <p className="text-[#6B7280] text-xs font-bold uppercase tracking-wider">Total Tasks</p>
              <div className="text-[#1E3A5F]">
                <ListTodo size={18} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-[#1F2937] leading-none">{stats.total_tasks}</h3>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white p-5 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 border-l-4 border-l-[#6B7280] flex flex-col justify-between h-[105px] transition-all hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 duration-300">
            <div className="flex justify-between items-start">
              <p className="text-[#6B7280] text-xs font-bold uppercase tracking-wider">Pending Tasks</p>
              <div className="text-[#6B7280]">
                <Clock size={18} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-[#1F2937] leading-none">{stats.tasks_by_status.todo || 0}</h3>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white p-5 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 border-l-4 border-l-[#F59E0B] flex flex-col justify-between h-[105px] transition-all hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 duration-300">
            <div className="flex justify-between items-start">
              <p className="text-[#6B7280] text-xs font-bold uppercase tracking-wider">In Progress</p>
              <div className="text-[#F59E0B]">
                <Clock size={18} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-[#1F2937] leading-none">{stats.tasks_by_status.in_progress || 0}</h3>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white p-5 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 border-l-4 border-l-[#10B981] flex flex-col justify-between h-[105px] transition-all hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 duration-300">
            <div className="flex justify-between items-start">
              <p className="text-[#6B7280] text-xs font-bold uppercase tracking-wider">Completed</p>
              <div className="text-[#10B981]">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-[#1F2937] leading-none">{stats.tasks_by_status.done || 0}</h3>
            </div>
          </div>
        </div>

        {/* TWO COLUMN CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2/3 COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* CHARTS CONTAINER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bar Chart Card */}
              <div className="bg-white p-5 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_6px_25px_rgba(0,0,0,0.05)] transition-all">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
                  <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider">Tasks by Status</h3>
                  <span className="text-[10px] font-semibold text-[#6B7280] bg-slate-100 px-2 py-0.5 rounded-md">Status Overview</span>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip
                        cursor={{ fill: 'rgba(30, 58, 95, 0.02)' }}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                        itemStyle={{ color: '#1F2937', fontWeight: 600, fontSize: '12px' }}
                        labelStyle={{ color: '#6B7280', fontSize: '10px', fontWeight: 500 }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Donut Chart Card */}
              <div className="bg-white p-5 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_6px_25px_rgba(0,0,0,0.05)] transition-all">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
                  <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider">Task Distribution</h3>
                  <span className="text-[10px] font-semibold text-[#6B7280] bg-slate-100 px-2 py-0.5 rounded-md">Per User</span>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userData.length > 0 ? userData : [{ name: 'No Data', value: 1, fill: '#cbd5e1' }]}
                        cx="50%"
                        cy="45%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {(userData.length > 0 ? userData : [{ name: 'No Data', value: 1, fill: '#cbd5e1' }]).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                        itemStyle={{ color: '#1F2937', fontWeight: 600, fontSize: '12px' }}
                      />
                      <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '11px', color: '#6B7280', paddingTop: '0px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* RECENT TASKS TABLE CARD */}
            <div className="bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_6px_25px_rgba(0,0,0,0.05)] transition-all">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider">Recent Tasks</h3>
                <span 
                  className="text-xs font-bold text-[#1E3A5F] hover:underline cursor-pointer transition-colors" 
                  onClick={() => window.location.href = '/tasks'}
                >
                  View all tasks
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider pb-3">
                      <th className="pb-3">Task Name</th>
                      <th className="pb-3">Assigned To</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentTasks.length > 0 ? (
                      recentTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 font-semibold text-[#1F2937]">{task.title}</td>
                          <td className="py-3.5 text-slate-500 capitalize">{task.assigned_to_email ? task.assigned_to_email.split('@')[0] : 'Unassigned'}</td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                              task.status === 'done' 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : task.status === 'in_progress'
                                  ? 'bg-amber-50 text-amber-600 border-amber-100'
                                  : 'bg-slate-50 text-slate-500 border-slate-100'
                            }`}>
                              {task.status === 'done' ? 'Completed' : task.status === 'in_progress' ? 'In Progress' : 'To Do'}
                            </span>
                          </td>
                          <td className="py-3.5 text-xs font-semibold text-slate-500">
                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-6 text-slate-400">No recent tasks found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
          
          {/* RIGHT 1/3 COLUMN */}
          <div className="space-y-8">
            
            {/* UPCOMING DEADLINES */}
            <div className="bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_6px_25px_rgba(0,0,0,0.05)] transition-all">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider">Upcoming Deadlines</h3>
                <span className="text-base">📅</span>
              </div>
              <div className="space-y-4">
                {upcomingDeadlinesList.length > 0 ? (
                  upcomingDeadlinesList.map((task) => {
                    const daysRemaining = Math.ceil((new Date(task.due_date) - new Date()) / (1000 * 60 * 60 * 24));
                    const isOverdue = daysRemaining < 0;
                    return (
                      <div key={task.id} className="flex flex-col space-y-1.5 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-slate-100/50">
                        <span className="text-sm font-bold text-[#1F2937] truncate">{task.title}</span>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-medium">Due: {new Date(task.due_date).toLocaleDateString()}</span>
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            isOverdue 
                              ? 'bg-red-50 text-red-600 border border-red-100'
                              : daysRemaining === 0
                                ? 'bg-amber-50 text-amber-600 border-amber-100'
                                : 'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                            {isOverdue 
                              ? 'Overdue' 
                              : daysRemaining === 0
                                ? 'Due Today'
                                : `In ${daysRemaining} days`}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-400 text-sm text-center py-4">No upcoming deadlines.</p>
                )}
              </div>
            </div>

            {/* TEAM MEMBERS */}
            <div className="bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_6px_25px_rgba(0,0,0,0.05)] transition-all">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider">Team Members</h3>
                <div className="bg-slate-100 text-slate-600 p-1.5 rounded-lg">
                  <Users size={15} />
                </div>
              </div>
              <div className="space-y-4">
                {teamMembersList.length > 0 ? (
                  teamMembersList.map((member) => (
                    <div key={member.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-full ${member.color} text-white flex items-center justify-center font-extrabold text-xs shadow-sm`}>
                          {member.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1F2937] capitalize">{member.name}</p>
                          <p className="text-[11px] text-[#6B7280] font-medium">{member.role}</p>
                        </div>
                      </div>
                      <span className={`w-2.5 h-2.5 rounded-full border border-white ${
                        member.status === 'Active' 
                          ? 'bg-emerald-500 shadow-sm'
                          : member.status === 'In Meeting'
                            ? 'bg-amber-500'
                            : member.status === 'Away'
                              ? 'bg-purple-500'
                              : 'bg-slate-300'
                      }`} title={member.status}></span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm text-center py-4">No team members.</p>
                )}
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_6px_25px_rgba(0,0,0,0.05)] transition-all">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider">Recent Activity</h3>
                <span className="text-base">⚡</span>
              </div>
              <div className="relative border-l-2 border-slate-100 pl-4 ml-2 space-y-6">
                {recentActivitiesList.map((activity) => (
                  <div key={activity.id} className="relative">
                    <span className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-[#1E3A5F] border-2 border-white"></span>
                    <div className="space-y-0.5">
                      <p className="text-xs text-[#1F2937] font-semibold leading-snug">
                        <span className="font-bold capitalize">{activity.user}</span> {activity.action}{' '}
                        <span className="text-[#1E3A5F] font-bold">{activity.target}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
