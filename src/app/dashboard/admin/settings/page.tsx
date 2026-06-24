'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Settings, Save, User, Bell, Shield, Keyboard } from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, updateProfile } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [cohortName, setCohortName] = useState('Cohort Summer 2026');
  const [standupTime, setStandupTime] = useState('10:00 AM IST');
  
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 select-none max-w-2xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-400" />
          <span>System & Profile Settings</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Configure your profile details and specify default cohort parameters.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Profile Card */}
        <div className="glass-panel p-6 rounded-2xl shadow-md space-y-4">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-white/5">
            <User className="w-4 h-4 text-blue-500" />
            <span>Mentor Profile Settings</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Cohort Configs */}
        <div className="glass-panel p-6 rounded-2xl shadow-md space-y-4">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-white/5">
            <Keyboard className="w-4 h-4 text-purple-500" />
            <span>Internship Workspace Rules</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Cohort Designation</label>
              <input
                type="text"
                value={cohortName}
                onChange={(e) => setCohortName(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Mandatory Standup Schedule</label>
              <input
                type="text"
                value={standupTime}
                onChange={(e) => setStandupTime(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-white flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/10 active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
          {saved && (
            <span className="text-xs font-semibold text-emerald-400 animate-pulse">Configuration updated successfully!</span>
          )}
        </div>

      </form>

    </div>
  );
}
