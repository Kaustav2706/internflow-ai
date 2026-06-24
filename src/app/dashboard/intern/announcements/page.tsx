'use client';

import React, { useState } from 'react';
import { useApp, Announcement, Priority } from '@/context/AppContext';
import { 
  Megaphone, 
  Search, 
  Pin, 
  Calendar, 
  User, 
  ExternalLink, 
  Paperclip,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function InternAnnouncements() {
  const { announcements, incrementAnnouncementViews } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'All'>('All');
  const [sortByDate, setSortByDate] = useState<'newest' | 'oldest'>('newest');

  // Filter only published ones for interns
  const publishedAnnouncements = announcements.filter(ann => ann.status === 'published');

  const handleCardClick = (id: string) => {
    incrementAnnouncementViews(id);
  };

  const filteredAnnouncements = publishedAnnouncements
    .filter(ann => {
      const matchesSearch = 
        ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ann.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = selectedPriority === 'All' || ann.priority === selectedPriority;
      return matchesSearch && matchesPriority;
    })
    .sort((a, b) => {
      // Pinned items always come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Then sort by date
      const dateA = new Date(a.postedDate).getTime();
      const dateB = new Date(b.postedDate).getTime();
      return sortByDate === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const getPriorityStyles = (p: Priority) => {
    switch (p) {
      case 'urgent': return 'bg-red-500/10 text-red-400 border-red-500/15';
      case 'high': return 'bg-amber-500/10 text-amber-400 border-amber-500/15';
      case 'medium': return 'bg-blue-500/10 text-blue-400 border-blue-500/15';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/15';
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-blue-500" />
          <span>Announcement Bulletin</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Stay updated with cohort releases, standup updates, and timeline reminders.</p>
      </div>

      {/* Toolbar Filters */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row items-center gap-4">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-9 pr-4 py-2 rounded-lg text-xs"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {(['All', 'low', 'medium', 'high', 'urgent'] as (Priority | 'All')[]).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedPriority(level)}
              className={`py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer shrink-0 transition-all ${
                selectedPriority === level
                  ? 'bg-blue-600/10 text-blue-400 border-blue-500/30'
                  : 'bg-gray-800/40 text-gray-400 border-white/5 hover:text-white hover:bg-gray-850'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Date Sort Toggle */}
        <div className="w-full md:w-auto">
          <select
            value={sortByDate}
            onChange={(e) => setSortByDate(e.target.value as 'newest' | 'oldest')}
            className="glass-input w-full px-3 py-2 rounded-lg text-xs appearance-none cursor-pointer focus:bg-slate-900 pr-8 relative"
          >
            <option value="newest" className="bg-[#0F172A]">Newest First</option>
            <option value="oldest" className="bg-[#0F172A]">Oldest First</option>
          </select>
        </div>

      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((ann) => (
            <motion.div
              key={ann.id}
              onClick={() => handleCardClick(ann.id)}
              className={`glass-panel p-6 rounded-2xl flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative cursor-pointer ${
                ann.isPinned 
                  ? 'border-blue-500/20 bg-gradient-to-br from-blue-950/10 via-slate-900 to-indigo-950/5 shadow-md shadow-blue-500/5' 
                  : 'hover:border-white/10'
              }`}
              whileHover={{ y: -2 }}
            >
              
              {/* Card Ribbon Shimmer for Pinned items */}
              {ann.isPinned && (
                <div className="absolute top-0 left-0 w-24 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              )}

              <div>
                
                {/* Badge tags */}
                <div className="flex justify-between items-center mb-4">
                  <span className={`py-1 px-2.5 rounded-full font-bold uppercase tracking-wider text-[8px] ${getPriorityStyles(ann.priority)}`}>
                    {ann.priority}
                  </span>
                  
                  {ann.isPinned && (
                    <span className="flex items-center gap-1 text-blue-400 text-[9px] font-extrabold uppercase tracking-wider bg-blue-500/10 py-0.5 px-2 rounded">
                      <Pin className="w-2.5 h-2.5 fill-current" />
                      <span>Pinned</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xs font-bold text-gray-200 leading-snug">{ann.title}</h3>
                
                {/* Description */}
                <p className="text-[11px] text-gray-400 mt-2.5 leading-relaxed">{ann.description}</p>

                {/* Attachments / Link Buttons */}
                <div className="flex flex-wrap gap-2.5 mt-4">
                  {ann.meetingLink && (
                    <a
                      href={ann.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="py-1.5 px-3 rounded-lg bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 text-[10px] font-bold flex items-center gap-1 border border-cyan-500/20 transition-all"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Join Standup Meet</span>
                    </a>
                  )}
                  {ann.attachment && (
                    <div className="py-1.5 px-3 rounded-lg bg-indigo-600/10 text-indigo-400 text-[10px] font-bold flex items-center gap-1 border border-indigo-500/20">
                      <Paperclip className="w-3 h-3" />
                      <span>{ann.attachment}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Card Footer Details */}
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-semibold">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-600" />
                  <span>Posted by {ann.postedBy}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-600" />
                  <span>{ann.postedDate}</span>
                </div>
              </div>

            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-gray-500 font-semibold flex flex-col items-center gap-2">
            <Megaphone className="w-8 h-8 text-gray-700" />
            <span>No published announcements match the filters.</span>
          </div>
        )}
      </div>

    </div>
  );
}
