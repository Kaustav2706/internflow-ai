'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  FolderOpen, 
  GitBranch, 
  BookOpen, 
  Video, 
  FileText, 
  ExternalLink,
  Info
} from 'lucide-react';

export default function ResourcesPage() {
  const { resources } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'github': return <GitBranch className="w-5 h-5 text-gray-200" />;
      case 'docs': return <FileText className="w-5 h-5 text-blue-400" />;
      case 'learning': return <BookOpen className="w-5 h-5 text-purple-400" />;
      case 'meeting': return <Video className="w-5 h-5 text-cyan-400" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-indigo-400" />
          <span>Shared Project Resources</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Access cohort repositories, meeting schedules, documentation hubs, and submission forms.</p>
      </div>

      {/* Info Warning */}
      <div className="flex gap-2.5 p-4 rounded-xl bg-blue-500/10 border border-blue-500/15 text-blue-300 text-xs leading-relaxed">
        <Info className="w-4.5 h-4.5 shrink-0 mt-0.5" />
        <span>Mentors: To edit or update these resources, please update the context database or coordinate with your HR team. Interns will see changes instantly.</span>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {resources.map((item) => (
          <div key={item.id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 hover:shadow-xl transition-all duration-300 group">
            <div>
              
              {/* Type Icon */}
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 shadow-inner">
                  {getIcon(item.type)}
                </div>
                <span className="py-0.5 px-2 rounded-md bg-white/5 text-gray-400 font-semibold text-[9px] uppercase tracking-wide">
                  {item.category}
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="text-xs font-bold text-gray-200 group-hover:text-blue-400 transition-colors">{item.title}</h3>
              <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">{item.description}</p>

            </div>

            {/* Link button */}
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="mt-6 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-[10px] font-bold text-gray-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Access Resource</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
            </a>

          </div>
        ))}
      </div>

    </div>
  );
}
