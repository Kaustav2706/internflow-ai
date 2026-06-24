'use client';

import React from 'react';
import { BarChart3, TrendingUp, Cpu, Award, Zap, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-8 select-none">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-500" />
          <span>Cohort Analytics & Metrics</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Review AI assistant efficacy, FAQ resolution success rates, and team milestones.</p>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* FAQ Resolution Success */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-md">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-gray-200">Self-Service Resolution Rate</h3>
                <p className="text-[11px] text-gray-500">Percentage of questions solved via FAQs/AI without mentor intervention</p>
              </div>
              <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 py-1 px-2.5 rounded-full text-xs font-bold">
                84.2% Success
              </span>
            </div>

            {/* Circular Gauge Ring */}
            <div className="flex justify-center py-6">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                  <motion.circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="#10B981" 
                    strokeWidth="8" 
                    fill="transparent"
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 * (1 - 0.842) }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-white tracking-tight">84%</span>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">Resolved</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 flex items-center justify-between text-[11px] font-medium text-gray-400">
            <span>Resolved via AI Assistant: <strong className="text-purple-400">54%</strong></span>
            <span>Resolved via FAQs: <strong className="text-blue-400">30%</strong></span>
          </div>
        </div>

        {/* AI Queries Performance */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-md">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-gray-200">AI Assistant Accuracy & Intent</h3>
                <p className="text-[11px] text-gray-500">Matching confidence over typical queries</p>
              </div>
              <Cpu className="w-5 h-5 text-purple-400" />
            </div>

            {/* Custom Bar Graph */}
            <div className="space-y-4 py-3">
              {[
                { label: 'Git & Submission rules', val: '95%', color: 'bg-blue-500' },
                { label: 'Daily standup queries', val: '90%', color: 'bg-purple-500' },
                { label: 'Team assignment search', val: '82%', color: 'bg-cyan-500' },
                { label: 'Unstructured/General Qs', val: '68%', color: 'bg-indigo-500' }
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-400">{item.label}</span>
                    <span className="font-bold text-gray-200">{item.val} match</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: item.val }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full rounded-full ${item.color}`}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Team Milestone Completions */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-200">Team Deliverables Completion Pace</h3>
              <p className="text-[11px] text-gray-500">Average days ahead of schedule for key deadlines</p>
            </div>
            <Award className="w-5 h-5 text-amber-500 animate-bounce" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            
            {/* Team 1 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Team Horizon</span>
              <div className="my-3">
                <span className="text-2xl font-extrabold text-blue-400">+2.5</span>
                <span className="text-[10px] text-gray-400 block font-semibold mt-0.5">days early</span>
              </div>
              <div className="w-full h-1 bg-blue-500/20 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-blue-500 rounded-full"></div>
              </div>
            </div>

            {/* Team 2 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Team CyberPulse</span>
              <div className="my-3">
                <span className="text-2xl font-extrabold text-cyan-400">+1.2</span>
                <span className="text-[10px] text-gray-400 block font-semibold mt-0.5">days early</span>
              </div>
              <div className="w-full h-1 bg-cyan-500/20 rounded-full overflow-hidden">
                <div className="h-full w-3/5 bg-cyan-500 rounded-full"></div>
              </div>
            </div>

            {/* Team 3 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Team CloudOps</span>
              <div className="my-3">
                <span className="text-2xl font-extrabold text-purple-400">+4.1</span>
                <span className="text-[10px] text-gray-400 block font-semibold mt-0.5">days early</span>
              </div>
              <div className="w-full h-1 bg-purple-500/20 rounded-full overflow-hidden">
                <div className="h-full w-11/12 bg-purple-500 rounded-full"></div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
