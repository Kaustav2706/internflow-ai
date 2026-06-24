'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Mail, Lock, ShieldAlert, ArrowRight, Check, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const { login, currentUser } = useApp();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'intern'>('intern');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect home
  useEffect(() => {
    if (currentUser) {
      router.replace(currentUser.role === 'admin' ? '/dashboard/admin' : '/dashboard/intern');
    }
  }, [currentUser, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate short network delay
    setTimeout(() => {
      // Validate credentials
      if (role === 'admin') {
        if (email !== 'admin@internflow.ai' || password !== 'admin123') {
          setError('Invalid administrator email or password.');
          setLoading(false);
          return;
        }
      } else {
        if (email !== 'intern@internflow.ai' || password !== 'intern123') {
          setError('Invalid intern email or password.');
          setLoading(false);
          return;
        }
      }

      const success = login(email, role);
      if (success) {
        // Redirection handled by useEffect or manually below
        router.replace(role === 'admin' ? '/dashboard/admin' : '/dashboard/intern');
      } else {
        setError('Authentication failed. Please verify credentials.');
        setLoading(false);
      }
    }, 800);
  };

  const handleQuickFill = (targetRole: 'admin' | 'intern') => {
    setError('');
    setRole(targetRole);
    if (targetRole === 'admin') {
      setEmail('admin@internflow.ai');
      setPassword('admin123');
    } else {
      setEmail('intern@internflow.ai');
      setPassword('intern123');
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden bg-[#0B1120] text-gray-100 selection:bg-purple-600/30 select-none">
      
      {/* Decorative blurred background shapes */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2"></div>
      
      <div className="w-full max-w-[450px] relative z-10">
        
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent"
          >
            <span className="text-4xl font-extrabold tracking-tight">InternFlow AI</span>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-gray-400 text-sm font-medium"
          >
            The Intelligent Internship Workspace
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="glass-panel p-8 rounded-2xl shadow-2xl relative overflow-hidden"
        >
          {/* Card Border Shimmer */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[shimmer_3s_infinite]"></div>

          <h2 className="text-xl font-semibold mb-6 text-gray-200">Sign In to Your Workspace</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Role Tab Selector */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">I am an</label>
              <div className="grid grid-cols-2 p-1 bg-slate-900/60 rounded-lg border border-white/5 relative">
                <button
                  type="button"
                  onClick={() => setRole('intern')}
                  className={`py-2 text-sm font-semibold rounded-md transition-all ${
                    role === 'intern' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Intern / Scholar
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 text-sm font-semibold rounded-md transition-all ${
                    role === 'admin' 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Admin / Mentor
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder={role === 'admin' ? 'admin@internflow.ai' : 'intern@internflow.ai'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Password</label>
                <button 
                  type="button"
                  onClick={() => alert("Mock feature: Try resetting password, or use the quick-fill buttons below.")}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full pl-10 pr-10 py-2.5 rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border flex items-center justify-center mr-2 transition-all ${
                  rememberMe 
                    ? (role === 'admin' ? 'bg-purple-600 border-purple-600' : 'bg-blue-600 border-blue-600') 
                    : 'border-white/20 hover:border-white/40'
                }`}>
                  {rememberMe && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs font-medium text-gray-400">Remember my session</span>
              </label>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium"
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-sm font-semibold tracking-wide text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98] ${
                role === 'admin' 
                  ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/10' 
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/10'
              } disabled:opacity-50`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fills */}
          <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
            <p className="text-xs font-semibold text-gray-500 text-center uppercase tracking-wider">Demo Access Quick Autofill</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickFill('intern')}
                className="py-2 px-3 rounded-lg bg-blue-950/40 border border-blue-900/30 hover:bg-blue-900/40 hover:border-blue-700/50 text-blue-300 text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
              >
                <span>Intern Account</span>
                <span className="text-[10px] text-gray-500 font-normal">intern@internflow.ai</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="py-2 px-3 rounded-lg bg-purple-950/40 border border-purple-900/30 hover:bg-purple-900/40 hover:border-purple-700/50 text-purple-300 text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
              >
                <span>Admin Account</span>
                <span className="text-[10px] text-gray-500 font-normal">admin@internflow.ai</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
