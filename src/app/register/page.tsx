'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Mail, Lock, User, ArrowRight, Check, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Register() {
  const { register, currentUser } = useApp();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'intern'>('intern');
  const [team, setTeam] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      router.replace(currentUser.role === 'admin' ? '/dashboard/admin' : '/dashboard/intern');
    }
  }, [currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields before continuing.');
      setLoading(false);
      return;
    }

    const teamValue = role === 'intern' ? team.trim() || 'Unassigned Team' : undefined;
    const success = await register(name.trim(), email.trim(), password, role, teamValue);
    setLoading(false);

    if (success) {
      setSuccess('Account created successfully. Redirecting to your dashboard...');
      setTimeout(() => {
        router.replace(role === 'admin' ? '/dashboard/admin' : '/dashboard/intern');
      }, 700);
    } else {
      setError('An account already exists with that email. Please sign in or use a different email.');
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden bg-[#0B1120] text-gray-100 selection:bg-purple-600/30 select-none">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-[460px] relative z-10">
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
            Create your account and join the internship workspace.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="glass-panel p-8 rounded-2xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[shimmer_3s_infinite]"></div>

          <h2 className="text-xl font-semibold mb-6 text-gray-200">Create a new account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Full name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <User className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Password</label>
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

            {role === 'intern' && (
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Team (optional)</label>
                <input
                  type="text"
                  placeholder="Team Horizon (AI/ML)"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-lg text-sm"
                />
              </div>
            )}

            <AnimatePresence>
              {(error || success) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-xs font-medium ${
                    error ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  }`}
                >
                  <span>{error || success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-semibold tracking-wide text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98] bg-blue-600 hover:bg-blue-500 shadow-blue-600/10 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-sm text-gray-400">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-white font-semibold hover:text-blue-200"
              >
                Sign in
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
