import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/auth/supabase-auth';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const AuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const processAuth = async () => {
      try {
        if (typeof window === 'undefined') return;

        // 1. Check if OAuth returned a PKCE authorization code in URL query: ?code=...
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          throw new Error(errorDescription || error);
        }

        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          if (data?.session && isMounted) {
            setStatus('success');
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 600);
            return;
          }
        }

        // 2. Check if already has active session or hash fragment token
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) throw sessionErr;

        if (sessionData?.session && isMounted) {
          setStatus('success');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 600);
          return;
        }

        // 3. Listen to onAuthStateChange for background token processing
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session && isMounted) {
            setStatus('success');
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 600);
          }
        });

        // 4. Safety Fallback: After 3 seconds, if still waiting, redirect to dashboard
        const safetyTimer = setTimeout(async () => {
          if (!isMounted) return;
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            window.location.href = '/dashboard';
          } else {
            // Still forward to dashboard or show completion button
            window.location.href = '/dashboard';
          }
        }, 3000);

        return () => {
          authListener?.subscription?.unsubscribe();
          clearTimeout(safetyTimer);
        };
      } catch (err: any) {
        console.error('OAuth Callback processing error:', err);
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err?.message || 'Gagal memproses sesi login.');
        }
      }
    };

    processAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in duration-200">
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Menghubungkan Akun Google...
            </h2>
            <p className="text-xs text-slate-500">
              Sedang memverifikasi sesi login Anda dengan Supabase.
            </p>
            <div className="pt-2">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                <span>Klik di sini jika tidak otomatis beralih</span>
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Login Berhasil!
            </h2>
            <p className="text-xs text-slate-500">
              Mengalihkan Anda ke Dashboard SEO OS...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Sesi Login Belum Terdeteksi
            </h2>
            <p className="text-xs text-slate-500">
              {errorMessage}
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="/dashboard"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                <span>Lanjutkan ke Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/"
                className="text-xs font-semibold text-slate-500 hover:underline"
              >
                Kembali ke Halaman Utama
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
