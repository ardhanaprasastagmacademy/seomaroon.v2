import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, User, LogIn, Menu, X, Layers, Workflow, LayoutDashboard, LogOut } from 'lucide-react';
import { authService } from '@/lib/auth/supabase-auth';
import { LoginModal } from '@/components/auth/LoginModal';

export const LandingNavbar: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(authService.getUser());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      setCurrentUser(state.user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <a href="/" className="flex items-center gap-2.5 font-bold">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-blue-600 dark:text-blue-400">SEO PROMPT</span>
              <span className="ml-1 text-base font-semibold text-slate-800 dark:text-slate-200">STUDIO</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="/#workflow" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Alur Kerja</a>
            <a href="/features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Fitur Utama</a>
            <a href="/templates" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Master Templates</a>
          </nav>

          {/* Desktop Right Action */}
          <div className="hidden md:flex items-center gap-2.5">
            {currentUser ? (
              <a
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-white/20 text-[10px]">
                  {currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
                </div>
                <span className="max-w-[120px] truncate">{currentUser.email?.split('@')[0]}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Masuk</span>
                </a>
                <a
                  href="/login"
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg"
                >
                  <span>Buka App</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </>
            )}
          </div>

          {/* Mobile Right Controls: Quick Link + Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            {currentUser ? (
              <a
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>App</span>
              </a>
            ) : (
              <a
                href="/login"
                className="flex items-center gap-1 rounded-xl bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Masuk</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white/98 px-4 py-4 shadow-xl backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/98 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1">
              <a
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900 transition-colors"
              >
                <span>Beranda</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </a>
              <a
                href="/#workflow"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900 transition-colors"
              >
                <span>Alur Kerja</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </a>
              <a
                href="/features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900 transition-colors"
              >
                <span>Fitur Utama</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </a>
              <a
                href="/templates"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>Master Templates</span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                    6 Core
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </a>
            </nav>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>Login sebagai:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{currentUser.email}</span>
                  </div>
                  <a
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Buka Dashboard & Studio</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await authService.signOut();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-slate-800 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
                  >
                    <LogIn className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Masuk</span>
                  </a>
                  <a
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all"
                  >
                    <span>Buka App</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};
