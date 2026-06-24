'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Award, 
  Flame, 
  CheckSquare, 
  Calendar, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  Play, 
  Video,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function InternDashboard() {
  const { currentUser, updateProfile } = useApp();

  // Tasks Checklist
  const [newTaskText, setNewTaskText] = useState('');
  const [nextTaskId, setNextTaskId] = useState(6);
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Squash feature commits and push PR to dev', done: true },
    { id: 2, text: 'Read the GitHub branching FAQ guidelines', done: true },
    { id: 3, text: 'Submit weekly report on Deliverables form', done: false },
    { id: 4, text: 'Schedule a brief coordinate call with Aarav', done: false },
    { id: 5, text: 'Configure Docker environment parameters', done: false }
  ]);

  const addTask = () => {
    const text = newTaskText.trim();
    if (!text) return;

    const nextTask = { id: nextTaskId, text, done: false };
    const updated = [...tasks, nextTask];
    setTasks(updated);
    setNextTaskId((prev) => prev + 1);
    setNewTaskText('');
    // Persist to server
    if (currentUser) {
      const payload = { tasks: updated, tasksCompleted: updated.filter(t => t.done).length };
      // fire-and-forget
      updateProfile(payload).catch((e) => console.error('Failed to persist tasks', e));
    }
  };

  const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTask();
  };

  const toggleTask = (id: number) => {
    const list = tasks.map(t => {
      if (t.id === id) {
        const nextState = !t.done;
        // Update stats
        if (currentUser) {
          const completedOffset = nextState ? 1 : -1;
          updateProfile({ tasksCompleted: Math.max(0, currentUser.tasksCompleted + completedOffset) });
        }
        return { ...t, done: nextState };
      }
      return t;
    });
    setTasks(list);
    if (currentUser) {
      const payload = { tasks: list, tasksCompleted: list.filter(t => t.done).length };
      updateProfile(payload).catch((e) => console.error('Failed to persist tasks', e));
    }
  };

  const doneCount = tasks.filter(t => t.done).length;
  const progressPct = Math.round((doneCount / tasks.length) * 100);

  // Deadlines
  const deadlines = [
    { id: 1, title: 'Mid-term Codebase & UI submit', date: 'June 26 (Friday)', daysLeft: '2 days left', type: 'urgent' },
    { id: 2, title: 'System Architecture Document', date: 'July 01 (Wednesday)', daysLeft: '7 days left', type: 'high' },
    { id: 3, title: 'Weekly standup sync review', date: 'Every weekday 10:00 AM', daysLeft: 'Ongoing', type: 'medium' }
  ];

  // Activities logs
  const activities = [
    { id: 1, text: 'You marked FAQ Onboarding submission as helpful', time: '1 hr ago' },
    { id: 2, text: 'AI Assistant matched your query about Git commands', time: '3 hrs ago' },
    { id: 3, text: 'You synced feature/jane-auth-layout branch', time: 'Yesterday' },
    { id: 4, text: 'Joined Team Horizon (AI/ML) as Scholar Intern', time: '2026-06-01' }
  ];

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{currentUser?.name}</span> 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Active in <span className="text-blue-400 font-semibold">{currentUser?.team}</span>. Monitor deadlines and update your progress checklist.
          </p>
        </div>
        
        {/* Streak Widget */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/15 py-2 px-4 rounded-2xl shadow-sm shrink-0">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
            <Flame className="w-5 h-5 fill-current animate-pulse" />
          </div>
          <div>
            <span className="text-sm font-extrabold text-white tracking-tight">{currentUser?.streak} Days</span>
            <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Daily Streak</span>
          </div>
        </div>
      </div>

      {/* Cohort Timeline & Progress Tracker */}
      <div className="glass-panel p-6 rounded-2xl shadow-lg relative overflow-hidden">
        {/* Progress Background light */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 blur-2xl pointer-events-none"></div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cohort Internship Timeline</h3>
            <h2 className="text-lg font-extrabold text-white tracking-tight mt-0.5">Day 24 of 60 Completed</h2>
          </div>
          <span className="text-xs font-bold text-blue-400">40% Overall Progress</span>
        </div>

        {/* Animated Timeline bar */}
        <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden relative border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '40%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500"
          ></motion.div>
        </div>

        {/* Milestone Dates */}
        <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-wide">
          <span>Start (June 01)</span>
          <span className="text-blue-500 font-extrabold">Midterm (June 30)</span>
          <span>Graduation (July 31)</span>
        </div>
      </div>

      {/* Grid: Tasks checklist vs Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Checklist */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-gray-200">Daily Tasks Checklist</h3>
              </div>

              <form onSubmit={handleAddTask} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Add a new task"
                  className="glass-input w-full sm:w-[220px] px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-950/60 text-gray-100"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-all"
                >
                  Add
                </button>
              </form>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                {progressPct}% Done
              </span>
            </div>

            <div className="space-y-3.5">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    task.done 
                      ? 'bg-slate-950/40 border-white/5 text-gray-500' 
                      : 'bg-slate-900/60 border-white/5 text-gray-300 hover:border-blue-500/20 hover:bg-slate-900'
                  }`}
                >
                  <span className={`text-xs font-semibold select-none ${task.done ? 'line-through' : ''}`}>
                    {task.text}
                  </span>
                  <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center transition-all ${
                    task.done 
                      ? 'bg-blue-600 text-white' 
                      : 'border border-white/20'
                  }`}>
                    {task.done && (
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deadlines Widget */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Calendar className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-gray-200">Upcoming Deadlines</h3>
            </div>

            <div className="space-y-4">
              {deadlines.map((dl) => (
                <div key={dl.id} className="p-3 bg-slate-900/60 border border-white/5 rounded-xl flex items-start gap-2.5">
                  <Clock className={`w-4 h-4 shrink-0 mt-0.5 ${
                    dl.type === 'urgent' ? 'text-red-400 animate-pulse' : dl.type === 'high' ? 'text-amber-400' : 'text-blue-400'
                  }`} />
                  <div>
                    <h4 className="text-xs font-bold text-gray-200">{dl.title}</h4>
                    <span className="text-[10px] text-gray-400 block mt-1 font-semibold">{dl.date}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider block mt-1.5 ${
                      dl.type === 'urgent' ? 'text-red-400' : 'text-gray-500'
                    }`}>
                      {dl.daysLeft}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/dashboard/intern/resources"
            className="mt-6 flex items-center justify-between text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider pt-4 border-t border-white/5 cursor-pointer group"
          >
            <span>Deliverables submission</span>
            <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>

      {/* Action panel & activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quick Sync Meeting panel */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-gray-200">Daily Meeting Coordination</h3>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-6">
              Daily status standups occur on Google Meet. Click below to launch the video client and review agenda parameters.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://meet.google.com/abc-defg-hij"
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-600/10"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Google Meet</span>
            </a>
            <Link
              href="/dashboard/intern/announcements"
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-gray-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Agenda</span>
            </Link>
          </div>
        </div>

        {/* Activity feed */}
        <div className="glass-panel p-6 rounded-2xl shadow-md">
          <h3 className="text-sm font-bold text-gray-200 mb-5">Your Workspace Activity</h3>
          <div className="space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="flex justify-between items-center gap-4 text-xs">
                <span className="font-semibold text-gray-300 truncate">{act.text}</span>
                <span className="text-[10px] text-gray-500 font-semibold shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
