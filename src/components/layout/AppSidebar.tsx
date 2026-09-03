import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CalendarDays,
  Sparkles,
  Layers,
  FileCode,
  Boxes,
  History,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  currentPath?: string;
}

export const AppSidebar: React.FC<SidebarProps> = ({ currentPath = '' }) => {
  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/projects', icon: FolderKanban },
    { label: 'Content Calendar', href: '/calendar', icon: CalendarDays },
    { label: 'Prompt Builder', href: '/prompt-builder', icon: Sparkles, highlight: true },
    { label: 'Prompt Templates', href: '/templates-manager', icon: Layers },
    { label: 'Prompt Formatter', href: '/formatter', icon: FileCode },
    { label: 'Bulk Generator', href: '/bulk', icon: Boxes },
    { label: 'History & Drafts', href: '/history', icon: History },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 top-16 z-30 hidden w-60 border-r border-slate-200 bg-white/95 px-3 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:flex md:flex-col md:justify-between">
      {/* Navigation Links */}
      <div className="space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href || (item.href !== '/dashboard' && currentPath.startsWith(item.href));

          return (
            <a
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : item.highlight
                  ? 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                isActive ? 'text-white' : item.highlight ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
              }`} />
              <span>{item.label}</span>
              {item.highlight && !isActive && (
                <span className="ml-auto rounded-md bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  CORE
                </span>
              )}
            </a>
          );
        })}
      </div>

      {/* Footer / Quick Info */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-850/50">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">SEO OS v1.0</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
        </div>
        <p className="mt-1 text-[10px] text-slate-500 leading-relaxed dark:text-slate-400">
          Tersinkronisasi otomatis dengan database Supabase Cloud.
        </p>
        <div className="mt-2.5 flex items-center justify-between border-t border-slate-200/60 pt-2 dark:border-slate-800">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400"
          >
            <span>Landing Page</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            Cloud Connected
          </span>
        </div>
      </div>
    </aside>
  );
};
