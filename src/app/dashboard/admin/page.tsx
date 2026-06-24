'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Users, 
  UserCheck, 
  HelpCircle, 
  Megaphone, 
  Bot, 
  ArrowUpRight, 
  TrendingUp, 
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { announcements, faqs } = useApp();

  // Metrics
  const totalInterns = 15;
  const activeUsers = 12;
  const totalFaqsCount = faqs.length;
  const totalAnnouncementsCount = announcements.length;
  const aiQueriesAnswered = 158;

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  } as const;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  } as const;

  // Mock Activity Feed
  const activityLogs = [
    { id: 1, text: "Jane Doe resolved their blocker using the AI Assistant", time: "5 mins ago", type: "ai" },
    { id: 2, text: "Admin Mentor published 'Daily Standup Call Link Update'", time: "10 mins ago", type: "announcement" },
    { id: 3, text: "Team Horizon submitted their Mid-term wireframes link", time: "1 hr ago", type: "submission" },
    { id: 4, text: "Rohan Patel voted helpful on FAQ 'GitHub branching conventions'", time: "3 hrs ago", type: "faq" },
    { id: 5, text: "New intern account created: aditya.sen@internflow.ai", time: "1 day ago", type: "user" }
  ];

  // FAQ Categories stats
  const faqCategoriesStats = [
    { name: 'GitHub', count: 145, pct: '92%', color: 'bg-blue-500' },
    { name: 'Onboarding', count: 110, pct: '74%', color: 'bg-emerald-500' },
    { name: 'Projects', count: 92, pct: '60%', color: 'bg-purple-500' },
    { name: 'Standups', count: 84, pct: '56%', color: 'bg-cyan-500' }
  ];

  return (
    <div className="space-y-8 select-none">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin & Mentor Hub</h1>
          <p className="text-gray-400 text-sm mt-1">Manage announcements, FAQ database, and monitor active intern squads.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/60 border border-white/5 py-2 px-4 rounded-xl text-xs text-gray-300 font-semibold shadow-sm">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span>Cohort: Summer 2026</span>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        
        {/* Total Interns */}
        <motion.div variants={cardVariants} className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:border-blue-500/20 transition-all duration-300 shadow-md">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/15">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <span>+18%</span>
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-white tracking-tight">{totalInterns}</span>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Total Interns</h3>
          </div>
        </motion.div>

        {/* Active Users */}
        <motion.div variants={cardVariants} className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-300 shadow-md">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/15">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
              80% active
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-white tracking-tight">{activeUsers}</span>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Active Users</h3>
          </div>
        </motion.div>

        {/* Total FAQs */}
        <motion.div variants={cardVariants} className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-300 shadow-md">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
              <HelpCircle className="w-5 h-5" />
            </div>
            <Link href="/dashboard/admin/faqs" className="text-gray-500 hover:text-gray-300">
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-white tracking-tight">{totalFaqsCount}</span>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Total FAQs</h3>
          </div>
        </motion.div>

        {/* Total Announcements */}
        <motion.div variants={cardVariants} className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:border-amber-500/20 transition-all duration-300 shadow-md">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/15">
              <Megaphone className="w-5 h-5" />
            </div>
            <Link href="/dashboard/admin/announcements" className="text-gray-500 hover:text-gray-300">
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-white tracking-tight">{totalAnnouncementsCount}</span>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Announcements</h3>
          </div>
        </motion.div>

        {/* AI Queries Answered */}
        <motion.div variants={cardVariants} className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:border-purple-500/20 transition-all duration-300 shadow-md">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/15">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>96% match</span>
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-white tracking-tight">{aiQueriesAnswered}</span>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">AI Queries</h3>
          </div>
        </motion.div>

      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Growth Chart */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-200">Daily Active Intern Activity</h3>
                <p className="text-[11px] text-gray-500">Number of portal pageviews over the past week</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+24.8% vs last week</span>
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="w-full h-48 relative mt-6 flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal Grid lines */}
                <line x1="0" y1="30" x2="600" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="130" x2="600" y2="130" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="170" x2="600" y2="170" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                {/* Area Gradient */}
                <path 
                  d="M 0,170 C 50,140 80,120 130,130 C 180,140 220,70 270,60 C 320,50 360,90 410,70 C 460,50 500,20 600,10 L 600,170 Z" 
                  fill="url(#chartGradient)" 
                />

                {/* Line Path */}
                <path 
                  d="M 0,170 C 50,140 80,120 130,130 C 180,140 220,70 270,60 C 320,50 360,90 410,70 C 460,50 500,20 600,10" 
                  fill="none" 
                  stroke="#3B82F6" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />

                {/* Plot Dots */}
                <circle cx="130" cy="130" r="5" fill="#3B82F6" stroke="#0B1120" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all" />
                <circle cx="270" cy="60" r="5" fill="#3B82F6" stroke="#0B1120" strokeWidth="2" />
                <circle cx="410" cy="70" r="5" fill="#3B82F6" stroke="#0B1120" strokeWidth="2" />
                <circle cx="600" cy="10" r="6" fill="#3B82F6" stroke="#0B1120" strokeWidth="2" />
              </svg>
            </div>
            
            {/* Chart Labels */}
            <div className="flex justify-between items-center px-1 mt-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed (Today)</span>
            </div>
          </div>
        </div>

        {/* FAQ Usage Statistics */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-md">
          <div>
            <h3 className="text-sm font-bold text-gray-200 mb-1">FAQ Category Popularity</h3>
            <p className="text-[11px] text-gray-500 mb-6">Views and interactions by category field</p>

            <div className="space-y-4">
              {faqCategoriesStats.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-300">{item.name}</span>
                    <span className="font-bold text-gray-400">{item.count} views</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: item.pct }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full rounded-full ${item.color}`}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link 
            href="/dashboard/admin/faqs" 
            className="mt-6 flex items-center justify-between text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider pt-4 border-t border-white/5 cursor-pointer group"
          >
            <span>FAQ Analytics Panel</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>

      {/* Announcements and Activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Announcements Panel */}
        <div className="glass-panel p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-200">Recent Announcements</h3>
            <Link 
              href="/dashboard/admin/announcements" 
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              Manage All
            </Link>
          </div>

          <div className="space-y-3.5">
            {announcements.slice(0, 3).map((item) => (
              <div 
                key={item.id} 
                className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-white/10 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-gray-200">{item.title}</h4>
                    {item.isPinned && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                        Pinned
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{item.description}</p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    item.priority === 'urgent' 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/15'
                      : item.priority === 'high'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/15'
                  }`}>
                    {item.priority}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">{item.postedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-panel p-6 rounded-2xl shadow-md">
          <h3 className="text-sm font-bold text-gray-200 mb-6">Cohort Activity Log</h3>
          <div className="relative border-l border-white/5 pl-4 ml-2.5 space-y-5">
            {activityLogs.map((log) => (
              <div key={log.id} className="relative">
                {/* Bullet indicator */}
                <div className={`absolute -left-6.5 w-4 h-4 rounded-full border-2 border-gray-950 flex items-center justify-center ${
                  log.type === 'announcement'
                    ? 'bg-amber-500'
                    : log.type === 'submission'
                    ? 'bg-purple-500'
                    : log.type === 'faq'
                    ? 'bg-blue-500'
                    : log.type === 'ai'
                    ? 'bg-emerald-500'
                    : 'bg-gray-500'
                }`}></div>
                <div>
                  <p className="text-xs font-semibold text-gray-300 leading-normal">{log.text}</p>
                  <span className="text-[10px] text-gray-500 font-medium block mt-0.5">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
