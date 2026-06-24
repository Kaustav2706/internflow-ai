'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Users, 
  Search, 
  UserCheck, 
  Shield, 
  Mail, 
  Calendar,
  Award,
  BookOpen
} from 'lucide-react';

export default function UserDirectory() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock list of all interns
  const internList = [
    { name: 'Jane Doe', email: 'intern@internflow.ai', role: 'intern', team: 'Team Horizon (AI/ML)', date: '2026-06-01', status: 'active', tasks: 12, streak: 8 },
    { name: 'Priya Sharma', email: 'priya.sharma@internflow.ai', role: 'intern', team: 'Team Horizon (AI/ML)', date: '2026-06-01', status: 'active', tasks: 14, streak: 12 },
    { name: 'Rohan Patel', email: 'rohan.patel@internflow.ai', role: 'intern', team: 'Team Horizon (AI/ML)', date: '2026-06-02', status: 'active', tasks: 10, streak: 5 },
    { name: 'Neha Verma', email: 'neha.verma@internflow.ai', role: 'intern', team: 'Team CyberPulse (Web Dev)', date: '2026-06-01', status: 'active', tasks: 11, streak: 7 },
    { name: 'Aditya Sen', email: 'aditya.sen@internflow.ai', role: 'intern', team: 'Team CyberPulse (Web Dev)', date: '2026-06-08', status: 'active', tasks: 8, streak: 4 },
    { name: 'Stefan Salvatore', email: 'stefan.salvatore@internflow.ai', role: 'intern', team: 'Team CloudOps (Infra)', date: '2026-06-01', status: 'active', tasks: 16, streak: 15 },
    { name: 'Damon Salvatore', email: 'damon.salvatore@internflow.ai', role: 'intern', team: 'Team CloudOps (Infra)', date: '2026-06-01', status: 'away', tasks: 15, streak: 0 },
    { name: 'Sneha Reddy', email: 'sneha.reddy@internflow.ai', role: 'intern', team: 'Team Horizon (AI/ML)', date: '2026-06-03', status: 'inactive', tasks: 3, streak: 1 }
  ];

  const filteredInterns = internList.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-500" />
          <span>Intern Directory & Management</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Monitor intern statuses, view team allocations, and evaluate project task metrics.</p>
      </div>

      {/* Search Toolbar */}
      <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by name, email, or team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-9 pr-4 py-2 rounded-lg text-xs"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInterns.map((user) => (
          <div key={user.email} className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors shadow-md relative overflow-hidden">
            
            {/* Top Row: Avatar & Status */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  {user.name[0]}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-200">{user.name}</h3>
                  <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" />
                    <span>{user.email}</span>
                  </span>
                </div>
              </div>
              <span className={`py-0.5 px-2 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                user.status === 'active' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15'
                  : user.status === 'away'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/15'
                  : 'bg-red-500/10 text-red-400 border-red-500/15'
              }`}>
                {user.status}
              </span>
            </div>

            {/* Middle Row: Team */}
            <div className="my-4 pt-3 border-t border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500 font-semibold">Team Assignment:</span>
                <span className="text-gray-300 font-bold">{user.team}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500 font-semibold">Join Date:</span>
                <span className="text-gray-300 font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span>{user.date}</span>
                </span>
              </div>
            </div>

            {/* Bottom Row: Metrics */}
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 grid grid-cols-2 gap-4 text-center mt-auto">
              <div className="space-y-0.5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Tasks Done</span>
                <div className="flex items-center justify-center gap-1 text-xs font-extrabold text-blue-400">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{user.tasks}</span>
                </div>
              </div>
              <div className="space-y-0.5 border-l border-white/5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Active Streak</span>
                <div className="flex items-center justify-center gap-1 text-xs font-extrabold text-amber-400">
                  <Award className="w-3.5 h-3.5" />
                  <span>{user.streak} days</span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
