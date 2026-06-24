'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Users, 
  Trophy, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Zap,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeamsPage() {
  const { teams } = useApp();

  // Sort teams by leaderboard points for ranks
  const rankedTeams = [...teams].sort((a, b) => b.score - a.score);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: return <Trophy className="w-5 h-5 text-yellow-400 fill-current animate-pulse" />;
      case 1: return <Award className="w-5 h-5 text-gray-300 fill-current" />;
      case 2: return <Award className="w-5 h-5 text-amber-600 fill-current" />;
      default: return <Star className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRankBadgeClass = (rank: number) => {
    switch (rank) {
      case 0: return 'border-yellow-500/20 bg-yellow-500/5 shadow-yellow-500/5';
      case 1: return 'border-slate-400/20 bg-slate-400/5';
      default: return 'border-white/5';
    }
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-500" />
          <span>Squads & Leaderboard</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Monitor project team progress, browse details of active peers, and track cohort rankings.</p>
      </div>

      {/* Leaderboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Teams Directory List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Internship Squads</h3>
          {rankedTeams.map((team, idx) => (
            <div 
              key={team.id} 
              className={`glass-panel p-6 rounded-2xl flex flex-col justify-between border hover:border-white/10 transition-all duration-300 relative shadow-md ${getRankBadgeClass(idx)}`}
            >
              <div>
                
                {/* Header details */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-200">{team.name}</h3>
                    <span className="text-[10px] text-gray-500 font-semibold block mt-0.5">Lead: <strong className="text-gray-300 font-bold">{team.teamLead}</strong></span>
                  </div>
                  
                  {/* Rank positioning */}
                  <div className="flex items-center gap-1">
                    {getRankIcon(idx)}
                    <span className="text-xs font-bold text-gray-400">Rank #{idx + 1}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="my-5 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400">
                    <span>Task Completion</span>
                    <span className="text-blue-400">{team.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${team.progress}%` }}
                      transition={{ duration: 1, delay: 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500"
                    ></motion.div>
                  </div>
                </div>

                {/* Members list initials */}
                <div className="flex -space-x-2 mt-4 items-center">
                  {team.members.map((email, memberIdx) => {
                    const namePart = email.split('@')[0];
                    const initial = namePart[0].toUpperCase();
                    const colorIndex = memberIdx % 4;
                    const colors = [
                      'from-blue-500 to-indigo-600',
                      'from-purple-500 to-indigo-500',
                      'from-cyan-500 to-blue-500',
                      'from-emerald-500 to-teal-500'
                    ];

                    return (
                      <div 
                        key={email}
                        className={`w-7 h-7 rounded-full bg-gradient-to-br ${colors[colorIndex]} text-white font-extrabold flex items-center justify-center text-[10px] border border-gray-950 uppercase shadow-md`}
                        title={email}
                      >
                        {initial}
                      </div>
                    );
                  })}
                  <span className="text-[10px] text-gray-500 font-bold pl-3.5 block uppercase tracking-wider">
                    {team.members.length} members
                  </span>
                </div>

              </div>

              {/* Collapsible recent activity updates */}
              <div className="mt-5 pt-4 border-t border-white/5 space-y-2">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Recent Squad Activity</span>
                <ul className="space-y-1.5">
                  {team.activity.slice(0, 2).map((act, actIdx) => (
                    <li key={actIdx} className="flex gap-2 items-start text-[10px] text-gray-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500/60 shrink-0 mt-0.5" />
                      <span className="font-medium truncate leading-normal">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>

        {/* Leaderboard point stats sidebar widget */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Rankings Analytics</h3>
          
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-md space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <h3 className="text-xs font-bold text-gray-200">Point Scoreboards</h3>
              <Zap className="w-4.5 h-4.5 text-yellow-400 fill-current" />
            </div>

            <div className="space-y-4">
              {rankedTeams.map((team, idx) => (
                <div key={team.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] uppercase border ${
                      idx === 0 
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25' 
                        : idx === 1 
                        ? 'bg-slate-400/10 text-slate-400 border-slate-400/25' 
                        : 'bg-gray-800 text-gray-400 border-white/5'
                    }`}>
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-gray-300 truncate max-w-28">{team.name.split(' (')[0]}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-gray-200">{team.score}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">pts</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl text-[10px] text-purple-400 leading-normal font-semibold">
              🏆 Points are awarded on timely checklist completions, helpful FAQ suggestions, and successful PR reviews. Keep syncing!
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
