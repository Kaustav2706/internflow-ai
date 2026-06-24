'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp, FAQ, FAQCategory } from '@/context/AppContext';
import { 
  HelpCircle, 
  Search, 
  ThumbsUp, 
  Eye, 
  Sparkles, 
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQExplorer() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { faqs, voteHelpfulFAQ, incrementFAQViews, currentUser } = useApp();
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | 'All'>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const categories: FAQCategory[] = ['Onboarding', 'GitHub', 'Standups', 'Projects', 'Teams', 'Certificates'];

  // Handle click to read/expand
  const handleFaqClick = (faq: FAQ) => {
    if (expandedFaqId !== faq.id) {
      incrementFAQViews(faq.id);
      setExpandedFaqId(faq.id);
    } else {
      setExpandedFaqId(null);
    }
  };

  const handleHelpfulClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent card expand toggle
    if (currentUser) {
      voteHelpfulFAQ(id, currentUser.email);
    }
  };

  // Basic semantic match simulation
  const getSemanticMatchScore = (faq: FAQ, query: string) => {
    if (!query) return null;
    const qLower = query.toLowerCase();
    const questionLower = faq.question.toLowerCase();
    const answerLower = faq.answer.toLowerCase();

    // Direct match in question
    if (questionLower.includes(qLower)) {
      return 98;
    }
    // Direct match in answer
    if (answerLower.includes(qLower)) {
      return 85;
    }

    // Token overlap match
    const queryTokens = qLower.split(/\s+/).filter(t => t.length > 2);
    let matches = 0;
    queryTokens.forEach(token => {
      if (questionLower.includes(token) || answerLower.includes(token)) {
        matches++;
      }
    });

    if (matches > 0) {
      return Math.min(94, 60 + (matches * 10));
    }

    return null;
  };

  const filteredFaqs = faqs
    .map(faq => ({
      ...faq,
      matchScore: getSemanticMatchScore(faq, searchQuery)
    }))
    .filter(faq => {
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      const matchesSearch = searchQuery === '' || faq.matchScore !== null;
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      // Sort by semantic match score if search active
      if (searchQuery !== '') {
        const scoreA = a.matchScore || 0;
        const strokeB = b.matchScore || 0;
        return strokeB - scoreA;
      }
      // Otherwise sort by views/popularity
      return b.views - a.views;
    });

  return (
    <div className="space-y-6 select-none">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-400" />
          <span>Semantic FAQ Explorer</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Search the database using standard keywords or questions. Matches are weighted using semantic scoring.</p>
      </div>

      {/* Semantic Search Area */}
      <div className="glass-panel p-5 rounded-2xl shadow-lg relative overflow-hidden">
        
        {/* Decorative spark grid background */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-2xl pointer-events-none"></div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            placeholder="Type your query (e.g. 'How do I squashing my code?' or 'Standup timings')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-10 pr-12 py-3 rounded-xl text-xs font-semibold"
          />
          {searchQuery && (
            <div className="absolute inset-y-0 right-3 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin [animation-duration:8s]" />
              <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider hidden sm:inline">Semantic Matching Active</span>
            </div>
          )}
        </div>

        {/* Suggestion tags */}
        <div className="flex flex-wrap gap-2.5 mt-3 text-[10px] items-center">
          <span className="text-gray-500 font-bold uppercase tracking-wider">Try:</span>
          <button onClick={() => setSearchQuery('branching conventions')} className="text-gray-400 hover:text-white underline">branching conventions</button>
          <span className="text-gray-700">•</span>
          <button onClick={() => setSearchQuery('daily standup Meet')} className="text-gray-400 hover:text-white underline">daily standup Meet</button>
          <span className="text-gray-700">•</span>
          <button onClick={() => setSearchQuery('final certificates')} className="text-gray-400 hover:text-white underline">final certificates</button>
        </div>
      </div>

      {/* Category Selection Tabs */}
      <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`py-2 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider border cursor-pointer shrink-0 transition-all ${
            selectedCategory === 'All'
              ? 'bg-blue-600/10 text-blue-400 border-blue-500/30 shadow-md'
              : 'bg-gray-800/40 text-gray-400 border-white/5 hover:text-white hover:bg-gray-850'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`py-2 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider border cursor-pointer shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600/10 text-blue-400 border-blue-500/30 shadow-md'
                : 'bg-gray-800/40 text-gray-400 border-white/5 hover:text-white hover:bg-gray-850'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQs Cards List */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            const hasVoted = currentUser ? faq.helpfulByUsers.includes(currentUser.email) : false;
            
            return (
              <motion.div
                key={faq.id}
                onClick={() => handleFaqClick(faq)}
                className={`glass-panel rounded-2xl overflow-hidden cursor-pointer hover:border-white/10 transition-all duration-300 relative select-none ${
                  isExpanded ? 'border-blue-500/15 shadow-md shadow-blue-500/5' : ''
                }`}
                layout
              >
                
                {/* Header question row */}
                <div className="p-5 flex justify-between gap-4 items-center">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Bookmark className={`w-4 h-4 shrink-0 ${isExpanded ? 'text-blue-400 fill-current' : 'text-gray-600'}`} />
                    <span className="font-bold text-xs text-gray-200 text-left leading-normal">{faq.question}</span>
                  </div>
                  
                  <div className="flex items-center gap-2.5 shrink-0">
                    
                    {/* Semantic Match badge */}
                    {faq.matchScore && (
                      <span className="py-0.5 px-2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/15 text-[9px] font-extrabold uppercase tracking-wide flex items-center gap-1 animate-pulse">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>{faq.matchScore}% Match</span>
                      </span>
                    )}

                    {/* Category tag */}
                    <span className="py-0.5 px-2 rounded bg-slate-950 text-slate-400 border border-white/5 font-semibold text-[8px] uppercase tracking-wide hidden sm:inline-block">
                      {faq.category}
                    </span>

                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-400' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>

                {/* Collapsible Answer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-white/5 bg-slate-900/60 p-5 space-y-4"
                    >
                      {/* Answer content */}
                      <p className="text-xs text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">{faq.answer}</p>
                      
                      {/* Interactive Actions Footer */}
                      <div className="flex justify-between items-center pt-3.5 border-t border-white/5">
                        {/* Popularity views count */}
                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-gray-600" />
                            <span>{faq.views} views</span>
                          </span>
                        </div>

                        {/* Helpful Upvote */}
                        <button
                          onClick={(e) => handleHelpfulClick(e, faq.id)}
                          className={`py-1.5 px-3 rounded-lg border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                            hasVoted 
                              ? 'bg-emerald-600/15 border-emerald-500/30 text-emerald-400' 
                              : 'bg-gray-800/40 border-white/5 text-gray-400 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-current' : ''}`} />
                          <span>Helpful ({faq.helpfulCount})</span>
                        </button>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })
        ) : (
          <div className="py-16 text-center text-gray-500 font-semibold flex flex-col items-center gap-2">
            <HelpCircle className="w-8 h-8 text-gray-700" />
            <span>No FAQ matches for your filters or search terms.</span>
          </div>
        )}
      </div>

    </div>
  );
}
