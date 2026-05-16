import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Users, Layout, ShieldCheck, ArrowRight, Star } from 'lucide-react';

const Landing = () => {
  return (
    <div className="bg-[#0f172a] min-h-screen text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <CheckCircle2 className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">TTM</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 text-primary-400 px-4 py-2 rounded-full border border-primary-500/20 mb-8">
              <Star size={16} fill="currentColor" />
              <span className="text-sm font-bold uppercase tracking-wider">New: Team Workspaces 2.0</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
              Manage Tasks with <br />
              <span className="gradient-text">Elite Team Precision</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The ultimate collaborative platform for modern teams. Organize projects, assign tasks, and track real-time progress with a premium interface designed for speed.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full md:w-auto bg-primary-500 hover:bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary-500/25 flex items-center justify-center space-x-2 group">
                <span>Start Building for Free</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="w-full md:w-auto glass hover:bg-white/10 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all border border-white/10">
                Live Demo
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-primary-500/20 blur-[120px] rounded-full"></div>
            <div className="relative glass p-4 rounded-[40px] border border-white/10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=2070" 
                alt="Dashboard Preview" 
                className="rounded-[32px] w-full shadow-inner"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything your team needs</h2>
            <p className="text-slate-400">Simple tools for complex workflows.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Users} 
              title="Team Workspaces" 
              desc="Create dedicated spaces for each project. Add members and manage roles effortlessly."
            />
            <FeatureCard 
              icon={Layout} 
              title="Task Visualization" 
              desc="Track progress with beautiful charts and real-time status updates from your team."
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Role-Based Security" 
              desc="Granular permissions ensure only Admins can manage projects while members focus on work."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="text-primary-500" size={24} />
            <span className="text-xl font-bold">TTM</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Team Task Manager. Built for elite teams.</p>
          <div className="flex space-x-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="glass p-8 rounded-3xl border border-white/10 hover:border-primary-500/30 transition-all group">
    <div className="w-14 h-14 bg-primary-500/10 text-primary-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
