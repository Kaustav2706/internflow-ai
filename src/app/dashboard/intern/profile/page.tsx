'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  User, 
  Save, 
  Flame, 
  CheckSquare, 
  Calendar,
  Layers,
  Award,
  Clock
} from 'lucide-react';

export default function InternProfile() {
  const { currentUser, updateProfile } = useApp();
  const displayName = currentUser?.name || 'Intern';

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    
    updateProfile({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-blue-500" />
          <span>My Intern Profile</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Review your cohort milestone metrics and edit account contact information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card & Stats */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-6 rounded-2xl text-center shadow-md relative overflow-hidden flex flex-col items-center">
            
            {/* Backdrop glow */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-blue-500/5 blur-xl pointer-events-none"></div>

            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-xl border-2 border-white/5 uppercase">
              {currentUser?.name[0]}
            </div>

            {/* Profile headers */}
            <h2 className="text-sm font-extrabold text-white tracking-tight mt-4 leading-normal">{currentUser?.name}</h2>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mt-0.5">Scholar / Intern</span>
            
            {/* Meta details list */}
            <div className="w-full text-left mt-6 pt-5 border-t border-white/5 space-y-3.5 text-xs text-gray-300 font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Team:</span>
                </span>
                <span className="text-gray-200 text-[11px] truncate max-w-36">{currentUser?.team}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined Date:</span>
                </span>
                <span className="text-gray-400 text-[11px]">{currentUser?.joinDate}</span>
              </div>
            </div>

          </div>

          {/* Quick Metrics stats boxes */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="glass-panel p-4 rounded-xl text-center shadow-sm">
              <Flame className="w-5 h-5 text-amber-500 mx-auto fill-current animate-pulse" />
              <span className="text-lg font-extrabold text-white block mt-2">{currentUser?.streak}</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mt-0.5">Daily Streak</span>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center shadow-sm">
              <CheckSquare className="w-5 h-5 text-blue-400 mx-auto" />
              <span className="text-lg font-extrabold text-white block mt-2">{currentUser?.tasksCompleted}</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mt-0.5">Tasks Done</span>
            </div>
          </div>
        </div>

        {/* Editable profile form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="glass-panel p-6 rounded-2xl shadow-md space-y-5">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-white/5">
              <Award className="w-4 h-4 text-purple-500" />
              <span>Personal Information Settings</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full px-3 py-2.5 rounded-lg text-xs"
                />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full px-3 py-2.5 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3.5 border-t border-white/5">
              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-white flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/10 active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
              {saved && (
                <span className="text-xs font-semibold text-emerald-400 animate-pulse">Profile updated successfully!</span>
              )}
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
