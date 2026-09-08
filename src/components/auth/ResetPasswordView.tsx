import React, { useState, useEffect } from 'react';
import { supabase, authService } from '@/lib/auth/supabase-auth';
import confetti from 'canvas-confetti';
import {
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  ArrowRight,
  Home
} from 'lucide-react';

export const ResetPasswordView: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isRecoveryReady, setIsRecoveryReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initRecovery = async () => {
      try {
        if (typeof window === 'undefined') return;

        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDesc = searchParams.get('error_description');

        if (error) {
          throw new Error(errorDesc || error);
        }

        // 1. If PKCE authorization code is present in query
        if (code) {
          const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeErr) throw exchangeErr;
          if (data?.session && isMounted) {
            setIsRecoveryReady(true);
            setIsChecking(false);
            return;
          }
        }

        // 2. Check if recovery session already exists
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session && isMounted) {
          setIsRecoveryReady(true);
          setIsChecking(false);
          return;
        }

        // 3. Listen to auth state change (PASSWORD_RECOVERY)
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if ((event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) && isMounted) {
            setIsRecoveryReady(true);
            setIsChecking(false);
          }
        });

        // 4. Fallback check after 2 seconds
        const timer = setTimeout(async () => {
          if (!isMounted) return;
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            setIsRecoveryReady(true);
          } else {
            // Still allow the form to display so user can attempt reset if session gets picked up late
            setIsRecoveryReady(true);
          }
          setIsChecking(false);
        }, 2000);

        return () => {
          authListener?.subscription?.unsubscribe();
          clearTimeout(timer);
        };
      } catch (err: any) {
        console.error('Password recovery error:', err);
        if (isMounted) {
          setIsChecking(false);
          setIsRecoveryReady(false);
          setErrorMessage(err?.message || 'Tautan pemulihan password tidak valid atau sudah kedaluwarsa.');
        }
      }
    };

    initRecovery();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setErrorMessage('Mohon isi password baru dan konfirmasi password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password baru minimal harus 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok dengan password baru.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      // 1. Update user password
      await authService.updateUserPassword(password);

      // 2. Explicitly sign out to clear the temporary recovery session so user is NOT automatically logged in
      await supabase.auth.signOut();

      // 3. Mark success
      setIsSuccess(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (cErr) {
        // ignore if canvas not supported
      }

      // DO NOT auto-redirect to dashboard - user stays on this screen to see the notification and manually logs in
    } catch (err: any) {
      console.error('Update password error:', err);
      setErrorMessage(err?.message || 'Gagal memperbarui password. Silakan minta tautan pemulihan baru.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-xs font-semibold text-slate-500">Memverifikasi tautan pemulihan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100 via-white to-slate-100 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8 animate-in fade-in duration-200">
          {/* Header & Logo */}
          <div className="text-center">
            <a href="/" className="inline-flex items-center gap-2.5 font-bold mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="text-left">
                <span className="text-lg font-black tracking-tight text-blue-600 dark:text-blue-400">SEO PROMPT</span>
                <span className="ml-1 text-lg font-bold text-slate-800 dark:text-slate-200">STUDIO</span>
              </div>
            </a>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              <KeyRound className="h-3.5 w-3.5" />
              <span>Keamanan Akun</span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {isSuccess ? 'Password Berhasil Diganti!' : 'Buat Password Baru'}
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
              {isSuccess
                ? 'Kata sandi Anda telah sukses diperbarui. Silakan login kembali menggunakan password baru.'
                : 'Silakan masukkan kombinasi password baru untuk akun Anda.'}
            </p>
          </div>

          {/* Success State */}
          {isSuccess && (
            <div className="mt-6 space-y-4 text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              {/* Success Notification Banner */}
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50/95 p-4 text-xs text-emerald-900 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-200 text-left">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                      Password Berhasil Diganti!
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-300/90">
                      Kata sandi baru Anda telah aktif. Sesi pemulihan telah ditutup demi keamanan. Silakan login kembali menggunakan email dan password baru Anda.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <a
                  href="/login?reset=success"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-xl transition-all"
                >
                  <span>Menuju Halaman Login</span>
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="/"
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Kembali ke Beranda Utama
                </a>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-500" />
                <div className="flex-1">
                  <p className="font-bold">Kendala Pemulihan Password</p>
                  <p className="mt-1 text-[11px] leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* New Password Form */}
          {!isSuccess && isRecoveryReady && (
            <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Konfirmasi Password Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Ulangi password baru Anda"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Menyimpan Password...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Simpan Password Baru</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* If Link Invalid / Expired */}
          {!isSuccess && !isRecoveryReady && (
            <div className="mt-6 space-y-3 text-center">
              <a
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                <span>Minta Tautan Baru di Halaman Login</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}

          {/* Privacy Note */}
          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-center text-[10px] text-slate-500 leading-relaxed dark:border-slate-800 dark:bg-slate-850">
            <Lock className="inline-block h-3 w-3 mr-1 text-slate-400" />
            Password Anda dienkripsi secara end-to-end melalui protokol Supabase PostgreSQL.
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Kembali ke Halaman Depan</span>
          </a>
        </div>
      </div>
    </div>
  );
};
