'use client';

import React, { useState } from 'react';
import { useApp, FAQ, FAQCategory } from '@/context/AppContext';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  ThumbsUp, 
  X, 
  FileQuestion,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQManager() {
  const { 
    faqs, 
    createFAQ, 
    editFAQ, 
    deleteFAQ 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | 'All'>('All');

  // Form Fields
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState<FAQCategory>('Onboarding');

  const categories: FAQCategory[] = ['Onboarding', 'GitHub', 'Standups', 'Projects', 'Teams', 'Certificates'];

  const openCreateModal = () => {
    setEditingId(null);
    setQuestion('');
    setAnswer('');
    setCategory('Onboarding');
    setIsOpen(true);
  };

  const openEditModal = (faq: FAQ) => {
    setEditingId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!question.trim() || !answer.trim()) {
      alert("Please enter a question and answer.");
      return;
    }

    const payload = { question, answer, category };

    if (editingId) {
      editFAQ(editingId, payload);
    } else {
      createFAQ(payload);
    }

    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      deleteFAQ(id);
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-500" />
            <span>FAQ Knowledge Base Manager</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage onboarding questions, standup guides, and technical references.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm text-white flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/10 active:scale-98 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search questions or answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-9 pr-4 py-2 rounded-lg text-xs"
          />
        </div>

        {/* Category Tabs inside toolbar */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer shrink-0 transition-all ${
              selectedCategory === 'All'
                ? 'bg-blue-600/10 text-blue-400 border-blue-500/30'
                : 'bg-gray-800/40 text-gray-400 border-white/5 hover:text-white hover:bg-gray-850'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600/10 text-blue-400 border-blue-500/30'
                  : 'bg-gray-800/40 text-gray-400 border-white/5 hover:text-white hover:bg-gray-850'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 border-b border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Question & Answer</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4 text-center">Helpful</th>
                <th className="py-4 px-4 text-center">Views</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-300">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-white/2 transition-colors">
                    
                    {/* Q&A */}
                    <td className="py-4 px-6 max-w-md">
                      <span className="font-bold text-gray-200 block text-xs leading-normal">{faq.question}</span>
                      <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{faq.answer}</p>
                    </td>

                    {/* Category badge */}
                    <td className="py-4 px-4">
                      <span className="py-0.5 px-2 rounded bg-slate-950 text-slate-400 border border-white/5 font-semibold text-[9px] uppercase tracking-wide">
                        {faq.category}
                      </span>
                    </td>

                    {/* Helpful count */}
                    <td className="py-4 px-4 text-center font-bold text-emerald-400">
                      <div className="flex items-center justify-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-emerald-500/60" />
                        <span>{faq.helpfulCount}</span>
                      </div>
                    </td>

                    {/* Views */}
                    <td className="py-4 px-4 text-center font-bold text-gray-400">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-gray-600" />
                        <span>{faq.views}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(faq)}
                          className="p-1.5 rounded-lg bg-gray-800/40 border border-white/5 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                          title="Edit FAQ"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 font-semibold">
                    No FAQ entries found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit FAQ Sliding Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-45"
            />
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#0F172A] border-l border-white/5 z-50 p-6 shadow-2xl flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <h3 className="font-extrabold text-sm text-gray-200 flex items-center gap-2">
                    <FileQuestion className="w-4.5 h-4.5 text-emerald-500" />
                    <span>{editingId ? "Edit FAQ Details" : "Add FAQ Entry"}</span>
                  </h3>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form fields */}
                <div className="space-y-4 mt-6">
                  
                  {/* Category Selector */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">FAQ Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as FAQCategory)}
                      className="glass-input w-full px-3 py-2 rounded-lg text-xs appearance-none cursor-pointer focus:bg-slate-900"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-[#0F172A] text-gray-200 font-semibold">{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Question */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Question Text</label>
                    <input
                      type="text"
                      placeholder="e.g. How do I squash commits in Git?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="glass-input w-full px-3 py-2 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  {/* Answer */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Detailed Answer</label>
                    <textarea
                      placeholder="Write the clear, concise answer here..."
                      rows={8}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="glass-input w-full px-3 py-2 rounded-lg text-xs leading-relaxed resize-none"
                    />
                  </div>

                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-6 border-t border-white/5 mt-6">
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-lg shadow-blue-600/10 active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingId ? "Save Changes" : "Create FAQ Entry"}</span>
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
