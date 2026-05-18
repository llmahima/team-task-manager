import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Users, Layout, ShieldCheck, ArrowRight, Star } from 'lucide-react';

const Landing = () => {
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#0A2540] rounded-xl flex items-center justify-center shadow-md">
              <CheckCircle2 className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#0A2540]">TTM</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-[#0A2540] transition-colors">Features</a>
            <a href="#about" className="hover:text-[#0A2540] transition-colors">About</a>
            <Link to="/login" className="hover:text-[#0A2540] transition-colors">Login</Link>
            <Link to="/signup" className="bg-[#0A2540] hover:bg-[#06182C] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md">
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
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight text-[#0A2540] leading-tight">
              Manage Tasks with <br />
              <span className="text-blue-600">Elite Team Precision</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              The ultimate collaborative platform for modern teams. Organize projects, assign tasks, and track real-time progress with a premium interface designed for speed.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full md:w-auto bg-[#0A2540] hover:bg-[#06182C] text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center space-x-2 group">
                <span>Start Building for Free</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="w-full md:w-auto bg-white hover:bg-slate-50 text-[#0A2540] px-10 py-4 rounded-xl font-bold text-lg transition-all border border-slate-300 shadow-sm">
                Live Demo
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-blue-100 blur-[100px] rounded-full opacity-50"></div>
            <div className="relative bg-white p-4 rounded-[40px] border border-slate-200 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=2070" 
                alt="Dashboard Preview" 
                className="rounded-[32px] w-full shadow-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-[#F0F4F8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#0A2540]">Everything your team needs</h2>
            <p className="text-lg text-slate-600">Simple tools for complex workflows.</p>
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
      <footer className="py-12 border-t border-slate-200 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="text-[#0A2540]" size={24} />
            <span className="text-xl font-bold text-[#0A2540]">TTM</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Team Task Manager. Built for elite teams.</p>
          <div className="flex space-x-6 text-slate-500 text-sm font-medium">
            <a href="#" className="hover:text-[#0A2540] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#0A2540] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#0A2540] transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold mb-3 text-slate-800">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
