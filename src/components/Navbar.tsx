'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  ChevronDown, 
  User, 
  LogOut, 
  Check, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const { 
    currentUser, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    clearNotifications,
    logout,
    theme,
    toggleTheme
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleNotificationClick = (id: string, targetUrl?: string) => {
    markNotificationRead(id);
    setNotifOpen(false);
    if (targetUrl) {
      router.push(targetUrl);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Redirect to FAQs search if intern, or just alert admin
    if (currentUser.role === 'intern') {
      router.push(`/dashboard/intern/faqs?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/dashboard/admin/faqs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-16 fixed top-0 right-0 left-0 lg:left-64 z-10 bg-[#0B1120]/75 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-6 select-none">
      
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center w-80 relative group">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 group-focus-within:text-blue-500 transition-colors">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Search FAQs or resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="glass-input w-full pl-9 pr-4 py-1.5 rounded-lg text-xs font-medium"
        />
      </form>

      {/* Mobile Toggle Button */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-white/5 text-gray-400 hover:text-white cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-extrabold text-sm tracking-tight text-white lg:hidden">
          InternFlow <span className="text-blue-500">AI</span>
        </span>
      </div>

      {/* Utility Actions */}
      <div className="flex items-center gap-3">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-850 border border-white/5 text-gray-400 hover:text-white cursor-pointer transition-all duration-200"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4.5 h-4.5 text-yellow-400" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-indigo-400" />
          )}
        </button>

        {/* Notification Bell Menu */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-white/5 text-gray-400 hover:text-white cursor-pointer relative transition-all duration-200"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center animate-bounce shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2.5 w-80 rounded-xl bg-gray-900 border border-white/5 shadow-2xl overflow-hidden z-30"
              >
                {/* Header */}
                <div className="p-3 bg-slate-900/60 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs text-gray-200">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="py-0.5 px-1.5 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-0.5 cursor-pointer"
                        title="Mark all as read"
                      >
                        <Check className="w-3 h-3" />
                        <span>Read all</span>
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-[10px] font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center gap-0.5 cursor-pointer"
                        title="Clear all"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Notification Items */}
                <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif.id, notif.targetUrl)}
                        className={`p-3 text-left hover:bg-slate-900 transition-colors cursor-pointer flex gap-2.5 ${
                          !notif.isRead ? 'bg-blue-600/5' : ''
                        }`}
                      >
                        <div className="pt-0.5">
                          <AlertCircle className={`w-3.5 h-3.5 ${
                            notif.type === 'announcement' 
                              ? 'text-amber-500' 
                              : notif.type === 'faq' 
                              ? 'text-blue-500' 
                              : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h5 className="text-[11px] font-bold text-gray-200 truncate">{notif.title}</h5>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">{notif.message}</p>
                          <span className="text-[9px] text-gray-500 font-medium block mt-1">{notif.time}</span>
                        </div>
                        {!notif.isRead && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 self-center"></div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 text-xs flex flex-col items-center gap-1.5">
                      <Bell className="w-6 h-6 text-gray-700" />
                      <span>No notifications yet.</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Action Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-1.5 p-1 rounded-lg bg-gray-800/40 hover:bg-gray-800 border border-white/5 cursor-pointer text-left transition-all duration-200"
          >
            <div className="w-7.5 h-7.5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-extrabold flex items-center justify-center text-xs shadow-inner">
              {currentUser.name[0]}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2.5 w-56 rounded-xl bg-gray-900 border border-white/5 shadow-2xl overflow-hidden z-30"
              >
                {/* User Info card */}
                <div className="p-3.5 bg-slate-900/60 border-b border-white/5 flex flex-col gap-0.5">
                  <h4 className="text-xs font-bold text-gray-200">{currentUser.name}</h4>
                  <span className="text-[10px] text-gray-500 font-medium break-all">{currentUser.email}</span>
                </div>

                {/* Links list */}
                <div className="p-1.5 space-y-0.5">
                  <Link
                    href={currentUser.role === 'admin' ? '/dashboard/admin/settings' : '/dashboard/intern/profile'}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 w-full py-2 px-3 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>My Profile Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full py-2 px-3 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
