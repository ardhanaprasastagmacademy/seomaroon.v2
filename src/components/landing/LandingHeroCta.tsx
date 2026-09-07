import React, { useState, useEffect } from 'react';
import { Sparkles, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { authService } from '@/lib/auth/supabase-auth';

export const LandingHeroCta: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(authService.getUser());

  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      setCurrentUser(state.user);
    });
    return () => unsubscribe();
  }, []);

  const targetUrl = currentUser ? '/dashboard' : '/login';

  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
      <a
        href={targetUrl}
        className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:bg-blue-700 hover:scale-105"
      >
        <Sparkles className="h-4 w-4" />
        <span>{currentUser ? 'Masuk ke Studio App' : 'Buka Studio (Login)'}</span>
        <ArrowRight className="h-4 w-4" />
      </a>

      <a
        href={currentUser ? '/calendar' : '/login'}
        className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      >
        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
        <span>Lihat Kalender Konten</span>
      </a>
    </div>
  );
};
