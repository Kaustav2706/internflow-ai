'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function Home() {
  const { currentUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    // Since AppContext initializes on mount, check user status.
    // Use a small timeout or wait until next tick to ensure state is synchronized.
    const checkRedirect = () => {
      const stored = localStorage.getItem('if_current_user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user.role === 'admin') {
            router.replace('/dashboard/admin');
          } else {
            router.replace('/dashboard/intern');
          }
          return;
        } catch (e) {
          // ignore
        }
      }
      
      if (currentUser) {
        if (currentUser.role === 'admin') {
          router.replace('/dashboard/admin');
        } else {
          router.replace('/dashboard/intern');
        }
      } else {
        router.replace('/login');
      }
    };

    const timer = setTimeout(checkRedirect, 100);
    return () => clearTimeout(timer);
  }, [currentUser, router]);

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-14 h-14 border-4 border-purple-500/10 border-b-purple-500 rounded-full animate-spin [animation-duration:1.5s]"></div>
        </div>
        <p className="text-gray-400 font-medium tracking-wide animate-pulse text-xs uppercase">Redirecting...</p>
      </div>
    </div>
  );
}
