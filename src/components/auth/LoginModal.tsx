import React, { useState } from 'react';
import { authService } from '@/lib/auth/supabase-auth';
import { 
  Sparkles, 
  ShieldCheck, 
  X, 
  Loader2, 
  Lock, 
  CheckCircle2, 
  Mail, 
  ArrowRight,
  UserPlus,
  LogIn
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setIsLoggingIn(true);
      setErrorMsg(null);
      await authService.signInWithGoogle();
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setIsLoggingIn(false);
      setErrorMsg(err?.message || 'Gagal menghubungkan akun Google. Pastikan Google OAuth aktif di Supabase.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/65 p-0 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:rounded-3xl sm:p-8">
        {/* Modal Header & Close Button */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Multi-User Protected</span>
              </div>
              <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                {mode === 'login' ? 'Login ke Akun Anda' : 'Daftar Akun Baru'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher: Login vs Daftar */}
        <div className="mt-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Login (Masuk)</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Daftar Akun</span>
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500 leading-relaxed">
          {mode === 'login'
            ? 'Masuk dengan akun Google Anda untuk mengakses seluruh data project dan kalender tersimpan.'
            : 'Daftarkan akun Google Anda untuk mulai mengelola 90 hari artikel dan 40 master SEO prompt.'}
        </p>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <p className="font-semibold">Terjadi Kendala:</p>
            <p className="mt-0.5 text-[11px]">{errorMsg}</p>
          </div>
        )}

        {/* Google 1-Click Action Button */}
        <div className="mt-5 space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-400 hover:shadow-md disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-750"
          >
            {isLoggingIn ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>
              {isLoggingIn
                ? 'Menghubungkan ke Google...'
                : mode === 'login'
                ? 'Login dengan Akun Google'
                : 'Daftar dengan Akun Google'}
            </span>
          </button>
        </div>

        {/* Feature Checkpoints */}
        <div className="mt-6 border-t border-slate-100 pt-5 space-y-2 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
              <span>Multi-Project Pribadi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
              <span>30-Day Content Calendar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
              <span>40 Master SEO Templates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
              <span>Bulk Generator & ZIP</span>
            </div>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-center text-[10px] text-slate-400 leading-relaxed dark:border-slate-800 dark:bg-slate-850">
          <Lock className="inline-block h-3 w-3 mr-1 text-slate-400" />
          Data terenkripsi dan terpisah otomatis dengan Supabase Row Level Security.
        </div>
      </div>
    </div>
  );
};
