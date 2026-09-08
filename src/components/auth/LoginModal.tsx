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
  ArrowLeft,
  UserPlus,
  LogIn,
  KeyRound,
  User,
  AlertCircle
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'forgot') {
      if (!email.trim()) {
        setErrorMsg('Mohon masukkan alamat Email Anda.');
        return;
      }
      try {
        setIsSubmitting(true);
        setErrorMsg(null);
        setSuccessMsg(null);
        await authService.resetPasswordForEmail(email);
        setSuccessMsg(`Tautan pemulihan password telah dikirim ke ${email}. Silakan periksa kotak masuk (inbox) atau folder spam Anda.`);
      } catch (err: any) {
        console.error('Forgot password error:', err);
        setErrorMsg(err?.message || 'Gagal mengirim email reset password. Pastikan email Anda valid.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!email.trim() || !password) {
      setErrorMsg('Mohon masukkan Email dan Password Anda.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password minimal harus 6 karakter.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      if (mode === 'register') {
        await authService.signUpWithEmail(email, password, fullName);
        setSuccessMsg(`Akun Anda (${email}) berhasil dibuat! Silakan masukkan password Anda di bawah untuk masuk.`);
        setMode('login');
        setPassword('');
      } else {
        const data = await authService.signInWithEmail(email, password);
        if (data?.session) {
          setSuccessMsg('Login berhasil! Memuat project Anda...');
          setTimeout(() => {
            onSuccess?.();
            onClose();
            window.location.reload();
          }, 600);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err?.message || 'Gagal memproses autentikasi.';
      if (msg.includes('Email not confirmed')) {
        msg = 'Email akun ini belum dikonfirmasi oleh Supabase. Silakan periksa inbox / spam email Anda, atau gunakan tombol kirim ulang di bawah.';
        setIsEmailNotConfirmed(true);
      } else if (msg.includes('Invalid login credentials')) {
        msg = 'Email atau password salah. Silakan periksa kembali.';
        setIsEmailNotConfirmed(false);
      } else if (msg.includes('User already registered') || msg.includes('sudah terdaftar')) {
        msg = 'Email ini sudah terdaftar. 1 email hanya dapat digunakan untuk 1 akun unik. Silakan pilih tab Login (Masuk) untuk login.';
        setIsEmailNotConfirmed(false);
        setMode('login');
      } else {
        setIsEmailNotConfirmed(false);
      }
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email.trim()) {
      setErrorMsg('Mohon masukkan email Anda terlebih dahulu.');
      return;
    }
    try {
      setIsResending(true);
      await authService.resendConfirmationEmail(email);
      setSuccessMsg(`Tautan konfirmasi baru berhasil dikirimkan ke ${email}. Silakan cek inbox atau folder spam Anda.`);
      setErrorMsg(null);
      setIsEmailNotConfirmed(false);
    } catch (err: any) {
      console.error('Resend confirmation email error:', err);
      setErrorMsg(err?.message || 'Gagal mengirim ulang email konfirmasi.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/65 p-0 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:rounded-3xl sm:p-8">
        {/* Modal Header & Close Button */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Private & Multi-User Isolated</span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                {mode === 'login' ? 'Login ke Akun Anda' : mode === 'register' ? 'Daftar Akun Baru' : 'Pemulihan Password'}
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

        {/* Tab Switcher: Login vs Daftar vs Forgot Back */}
        {mode !== 'forgot' ? (
          <div className="mt-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
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
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
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
        ) : (
          <div className="mt-4 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Halaman Login</span>
            </button>
          </div>
        )}

        <p className="mt-3 text-center text-xs text-slate-500 leading-relaxed">
          {mode === 'login'
            ? 'Masuk untuk mengakses project dan kalender pribadi Anda.'
            : mode === 'register'
            ? 'Buat akun agar project yang Anda buat hanya dapat dilihat oleh Anda sendiri.'
            : 'Masukkan email Anda. Kami akan mengirimkan tautan untuk membuat password baru.'}
        </p>

        {/* Error & Success Alerts */}
        {errorMsg && (
          <div className={`mt-4 rounded-2xl border p-3.5 text-xs ${
            isEmailNotConfirmed 
              ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200'
              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300'
          }`}>
            <div className="flex items-start gap-2.5">
              <AlertCircle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isEmailNotConfirmed ? 'text-amber-600' : 'text-red-500'}`} />
              <div className="flex-1">
                <p className="font-bold">
                  {isEmailNotConfirmed ? 'Email Belum Dikonfirmasi' : 'Kendala Autentikasi'}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed">{errorMsg}</p>
                
                {isEmailNotConfirmed && (
                  <div className="mt-3 flex flex-col gap-2 pt-2 border-t border-amber-200/60 dark:border-amber-800/40">
                    <button
                      type="button"
                      disabled={isResending}
                      onClick={handleResendEmail}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 disabled:opacity-50 transition-colors"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Mengirim tautan...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-3.5 w-3.5" />
                          <span>Kirim Ulang Email Konfirmasi</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                      💡 <strong>Konfirmasi Instan:</strong> Di dashboard Supabase &gt; Users &gt; klik menu titik tiga (⋮) di sebelah kanan email &gt; pilih <strong>"Confirm email"</strong>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 rounded-2xl border border-emerald-300 bg-emerald-50/95 p-4 text-xs text-emerald-900 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-200 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex-shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                  {mode === 'login' && !isSubmitting ? 'Akun Berhasil Dibuat!' : 'Sukses!'}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-300/90">
                  {successMsg}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailSubmit} className="mt-4 space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Nama Anda atau Perusahaan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password <span className="text-red-500">*</span>
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
                  >
                    Lupa password?
                  </button>
                )}
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === 'login' ? (
              <>
                <LogIn className="h-4 w-4" />
                <span>Masuk Sekarang</span>
              </>
            ) : mode === 'register' ? (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Daftar Akun Baru</span>
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                <span>Kirim Tautan Pemulihan</span>
              </>
            )}
          </button>

          {mode === 'forgot' && (
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Sudah ingat password Anda?{' '}
                <span className="font-bold text-blue-600 hover:underline dark:text-blue-400">Masuk</span>
              </button>
            </div>
          )}
        </form>

        {/* Privacy Note */}
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-2 text-center text-[10px] text-slate-500 leading-relaxed dark:border-slate-800 dark:bg-slate-850">
          <Lock className="inline-block h-3 w-3 mr-1 text-slate-400" />
          Data project dan kalender hanya dapat diakses oleh akun Anda sendiri.
        </div>
      </div>
    </div>
  );
};
