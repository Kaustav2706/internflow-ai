'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check authentication
    const stored = localStorage.getItem('if_current_user');
    if (!stored && !currentUser) {
      router.replace('/login');
    } else {
      // Role-based route protection
      try {
        const user = stored ? JSON.parse(stored) : currentUser;
        
        if (pathname.includes('/dashboard/admin') && user.role !== 'admin') {
          // Intern trying to access admin route
          router.replace('/dashboard/intern');
        } else if (pathname.includes('/dashboard/intern') && user.role !== 'intern') {
          // Admin trying to access intern route
          router.replace('/dashboard/admin');
        } else {
          setCheckingAuth(false);
        }
      } catch (e) {
        router.replace('/login');
      }
    }
  }, [currentUser, router, pathname]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-14 h-14 border-4 border-purple-500/10 border-b-purple-500 rounded-full animate-spin [animation-duration:1.5s]"></div>
          </div>
          <p className="text-gray-400 font-semibold tracking-wider text-xs uppercase animate-pulse">Authenticating Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100 flex overflow-hidden">
      
      {/* Sidebar - fixed left panel */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main container wrapping top navbar & scrollable page content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pt-24 pb-4 px-4 md:pt-28 md:pb-6 md:px-6 lg:pb-8 lg:px-8 relative min-h-screen select-none">
          
          {/* Subtle background glow lights */}
          <div className="absolute top-20 right-20 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-20 left-20 w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
