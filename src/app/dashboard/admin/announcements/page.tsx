'use client';

import React, { useState } from 'react';
import { useApp, Announcement, Priority } from '@/context/AppContext';
import { 
  Megaphone, 
  Plus, 
  Pin, 
  Edit, 
  Trash2, 
  Eye, 
  Link as LinkIcon, 
  Paperclip, 
  X,
  FileText,
  Search,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnnouncementManager() {
  const { 
    announcements, 
    createAnnouncement, 
    editAnnouncement, 
    deleteAnnouncement, 
    togglePinAnnouncement 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [meetingLink, setMeetingLink] = useState('');
  const [attachment, setAttachment] = useState('');

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setMeetingLink('');
    setAttachment('');
    setIsOpen(true);
  };

  const openEditModal = (ann: Announcement) => {
    setEditingId(ann.id);
    setTitle(ann.title);
    setDescription(ann.description);
    setPriority(ann.priority);
    setMeetingLink(ann.meetingLink || '');
    setAttachment(ann.attachment || '');
    setIsOpen(true);
  };

  const handleSave = (status: 'draft' | 'published') => {
    if (!title.trim() || !description.trim()) {
      alert("Please specify a title and description.");
      return;
    }

    const payload = {
      title,
      description,
      priority,
      meetingLink: meetingLink.trim() || undefined,
      attachment: attachment.trim() || undefined,
      status,
      isPinned: false
    };

    if (editingId) {
      editAnnouncement(editingId, payload);
    } else {
      createAnnouncement(payload);
    }
    
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      deleteAnnouncement(id);
    }
  };

  const filteredAnnouncements = announcements.filter(ann => 
    ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ann.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-amber-500" />
            <span>Announcement Board Manager</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Distribute notifications, standup invites, and timeline warnings to interns.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm text-white flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/10 active:scale-98 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Announcement</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
        <div className="relative flex-1">
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
      </div>

      {/* Table Container */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 border-b border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-4">Priority</th>
                <th className="py-4 px-4">Posted Date</th>
                <th className="py-4 px-4 text-center">Views</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-300">
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((ann) => (
                  <tr key={ann.id} className="hover:bg-white/2 transition-colors">
                    
                    {/* Title & Info */}
                    <td className="py-4 px-6 max-w-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-200 block truncate">{ann.title}</span>
                        {ann.isPinned && (
                          <span className="shrink-0 p-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/15 text-[8px] font-extrabold flex items-center gap-0.5 uppercase tracking-wide">
                            <Pin className="w-2 h-2 fill-current" />
                            <span>Pinned</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 line-clamp-1 block leading-normal">{ann.description}</span>
                      
                      {/* Attached items */}
                      <div className="flex gap-3 mt-1.5 text-[9px] font-medium text-gray-400">
                        {ann.meetingLink && (
                          <span className="flex items-center gap-1 text-cyan-400 hover:underline">
                            <LinkIcon className="w-2.5 h-2.5" />
                            <span>Meeting link set</span>
                          </span>
                        )}
                        {ann.attachment && (
                          <span className="flex items-center gap-1 text-indigo-400 hover:underline">
                            <Paperclip className="w-2.5 h-2.5" />
                            <span>{ann.attachment}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Priority Badge */}
                    <td className="py-4 px-4">
                      <span className={`py-1 px-2.5 rounded-full font-bold uppercase tracking-wider text-[9px] ${
                        ann.priority === 'urgent'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/15'
                          : ann.priority === 'high'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15'
                          : ann.priority === 'medium'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/15'
                          : 'bg-gray-500/10 text-gray-400 border border-gray-500/15'
                      }`}>
                        {ann.priority}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-gray-400 font-semibold">{ann.postedDate}</td>

                    {/* Views count */}
                    <td className="py-4 px-4 text-center font-bold text-gray-400">
                      <div className="flex items-center justify-center gap-1 text-[11px]">
                        <Eye className="w-3.5 h-3.5 text-gray-600" />
                        <span>{ann.views}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <span className={`py-0.5 px-2 rounded-md font-semibold text-[10px] ${
                        ann.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-gray-400 border border-white/5'
                      }`}>
                        {ann.status}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Pin Button */}
                        <button
                          onClick={() => togglePinAnnouncement(ann.id)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            ann.isPinned 
                              ? 'bg-blue-600/15 text-blue-400 border-blue-500/30' 
                              : 'bg-gray-800/40 text-gray-400 border-white/5 hover:text-white hover:bg-gray-800'
                          }`}
                          title={ann.isPinned ? "Unpin Announcement" : "Pin Announcement"}
                        >
                          <Pin className={`w-3.5 h-3.5 ${ann.isPinned ? 'fill-current' : ''}`} />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(ann)}
                          className="p-1.5 rounded-lg bg-gray-800/40 border border-white/5 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(ann.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 font-semibold">
                    No announcements found matching the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide Modal Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#0F172A] border-l border-white/5 z-50 p-6 shadow-2xl flex flex-col justify-between"
            >
              
              {/* Header */}
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <h3 className="font-extrabold text-sm text-gray-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>{editingId ? "Edit Announcement" : "Create New Announcement"}</span>
                  </h3>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 mt-6">
                  
                  {/* Title */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Announcement Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Daily Standup Link Update"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="glass-input w-full px-3 py-2 rounded-lg text-xs"
                    />
                  </div>

                  {/* Priority Select */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Priority Level</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setPriority(level)}
                          className={`py-2 px-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide border transition-all cursor-pointer ${
                            priority === level 
                              ? 'bg-blue-600/10 text-blue-400 border-blue-500/50 shadow-md' 
                              : 'bg-gray-900 border-white/5 text-gray-400 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Content / Description</label>
                    <textarea
                      placeholder="Write the detailed message here..."
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="glass-input w-full px-3 py-2 rounded-lg text-xs resize-none"
                    />
                  </div>

                  {/* Meeting Link */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Meeting URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="e.g. https://meet.google.com/abc-defg-hij"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      className="glass-input w-full px-3 py-2 rounded-lg text-xs"
                    />
                  </div>

                  {/* Attachment */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">File Attachment Slug (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Project_Syllabus.pdf"
                      value={attachment}
                      onChange={(e) => setAttachment(e.target.value)}
                      className="glass-input w-full px-3 py-2 rounded-lg text-xs"
                    />
                  </div>

                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => handleSave('draft')}
                  className="py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-xs border border-white/5 transition-all cursor-pointer hover:text-white active:scale-98"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSave('published')}
                  className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-lg shadow-blue-600/10 active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Publish Now</span>
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
