import React, { useState, useEffect } from 'react';
import { authService, type AuthState } from '@/lib/auth/supabase-auth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => ({
    user: authService.getUser(),
    session: authService.getSession(),
    isLoading: authService.isLoadingState(),
  }));

  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      setAuthState(state);
      if (!state.isLoading && !state.user && typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    });
    return () => unsubscribe();
  }, []);

  if (authState.user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
      <p className="mt-3 text-xs font-semibold text-slate-500">Mengarahkan ke halaman login...</p>
    </div>
  );
};
