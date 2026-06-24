'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  LayoutDashboard, 
  Megaphone, 
  HelpCircle, 
  BarChart3, 
  Users, 
  FolderOpen, 
  Settings, 
  Bot, 
  User, 
  LogOut,
  ChevronRight,
  Menu,
  X,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useApp();

  if (!currentUser) return null;

  const role = currentUser.role;

  // Navigation config based on role
  const adminNavItems = [
    { name: 'Dashboard', path: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Announcements', path: '/dashboard/admin/announcements', icon: Megaphone },
    { name: 'FAQ Manager', path: '/dashboard/admin/faqs', icon: HelpCircle },
    { name: 'Analytics', path: '/dashboard/admin/analytics', icon: BarChart3 },
    { name: 'Users', path: '/dashboard/admin/users', icon: Users },
    { name: 'Resources', path: '/dashboard/admin/resources', icon: FolderOpen },
    { name: 'Settings', path: '/dashboard/admin/settings', icon: Settings },
  ];

  const internNavItems = [
    { name: 'Dashboard', path: '/dashboard/intern', icon: LayoutDashboard },
    { name: 'AI Assistant', path: '/dashboard/intern/ai-assistant', icon: Bot },
    { name: 'FAQs', path: '/dashboard/intern/faqs', icon: HelpCircle },
    { name: 'Announcements', path: '/dashboard/intern/announcements', icon: Megaphone },
    { name: 'Teams', path: '/dashboard/intern/teams', icon: Users },
    { name: 'Resources', path: '/dashboard/intern/resources', icon: FolderOpen },
    { name: 'Profile', path: '/dashboard/intern/profile', icon: User },
  ];

  const navItems = role === 'admin' ? adminNavItems : internNavItems;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#111827] border-r border-white/5 py-6 px-4">
      {/* Brand logo */}
      <div className="flex items-center justify-between mb-8 px-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <Compass className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white drop-shadow-md">
  InternFlow <span className="text-blue-400">AI</span>
</span>
        </Link>
        {/* Mobile close button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white border border-white/5 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Role Badge */}
      <div className="mb-6 px-2">
        <div className="py-2.5 px-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center font-bold text-sm text-gray-200 border border-white/10 uppercase shadow-inner">
            {currentUser.name[0]}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-semibold text-gray-200 truncate leading-snug">{currentUser.name}</h4>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              role === 'admin' ? 'text-purple-400' : 'text-blue-400'
            }`}>
              {role === 'admin' ? 'Mentor / Admin' : 'Scholar / Intern'}
            </span>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1.5 px-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/10 to-indigo-600/5 text-blue-400 border-l-[3px] border-blue-500 pl-[11px] bg-slate-900/60'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-l-[3px] border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-200'
                }`} />
                <span>{item.name}</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ${
                isActive ? 'text-blue-400' : 'text-gray-500'
              }`} />
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-white/5 px-1 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full py-2.5 px-3.5 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer group"
        >
          <LogOut className="w-4.5 h-4.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block w-64 h-screen fixed top-0 left-0 shrink-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer (Collapsible) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-64 h-full z-40 lg:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
