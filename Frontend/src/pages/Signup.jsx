import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Check } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Left Side (60%) */}
      <div className="w-full md:w-[60%] bg-[#F0F4F8] p-8 md:p-16 flex flex-col justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
            Manage Your Team's Work, Together
          </h1>
          <p className="text-lg text-slate-600 mb-12">
            Assign tasks, track progress, collaborate seamlessly
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-slate-700">
              <div className="flex-shrink-0 bg-blue-100 p-1 rounded-full text-blue-600">
                <Check size={20} />
              </div>
              <span className="text-lg">Role-based access for Admin & Members</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-700">
              <div className="flex-shrink-0 bg-blue-100 p-1 rounded-full text-blue-600">
                <Check size={20} />
              </div>
              <span className="text-lg">Real-time task tracking & dashboard</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-700">
              <div className="flex-shrink-0 bg-blue-100 p-1 rounded-full text-blue-600">
                <Check size={20} />
              </div>
              <span className="text-lg">Project-based team collaboration</span>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-0">
          <p className="text-sm font-medium text-slate-500">Trusted by teams at INNOIRA</p>
        </div>
      </div>

      {/* Right Side (40%) */}
      <div className="w-full md:w-[40%] bg-white p-8 md:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-[#0A2540] mb-2">Create Account</h2>
            <p className="text-slate-500">Please enter your details to sign up.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2540] focus:border-transparent transition-all"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2540] focus:border-transparent transition-all"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full border border-slate-300 rounded-lg py-2.5 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2540] focus:border-transparent transition-all"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0A2540] hover:bg-[#06182C] text-white font-medium py-3 rounded-lg transition-colors mt-2"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0A2540] hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
