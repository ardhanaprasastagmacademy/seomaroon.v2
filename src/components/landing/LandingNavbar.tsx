import React, { useState } from 'react';
import { Sparkles, ArrowRight, Menu, X } from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
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

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <a href="/#workflow" className="hover:text-blue-600 dark:hover:text-blue-400">Alur Kerja</a>
          <a href="/features" className="hover:text-blue-600 dark:hover:text-blue-400">Fitur Utama</a>
          <a href="/templates" className="hover:text-blue-600 dark:hover:text-blue-400">Template 04–40</a>
        </nav>

        {/* Desktop CTA + Mobile Hamburger */}
        <div className="flex items-center gap-2.5">
          <a
            href="/dashboard"
            className="hidden sm:flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            <span>Masuk ke App</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 md:hidden"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            <a
              href="/#workflow"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800/70"
            >
              Alur Kerja
            </a>
            <a
              href="/features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800/70"
            >
              Fitur Utama
            </a>
            <a
              href="/templates"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800/70"
            >
              Template 04–40
            </a>
            <div className="pt-2 pb-1">
              <a
                href="/dashboard"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700"
              >
                <span>Masuk ke App</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
