import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CalendarDays,
  Sparkles,
  Layers,
  FileCode,
  Boxes,
  History
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
    <aside className="fixed inset-y-0 left-0 top-16 z-30 hidden w-60 border-r border-slate-200 bg-white px-3 py-4 md:flex md:flex-col md:justify-between shadow-sm">
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
                  ? 'text-blue-600 hover:bg-blue-50'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                isActive ? 'text-white' : item.highlight ? 'text-blue-600' : 'text-slate-500'
              }`} />
              <span>{item.label}</span>
              {item.highlight && !isActive && (
                <span className="ml-auto rounded-md bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-700">
                  CORE
                </span>
              )}
            </a>
          );
        })}
      </div>

      {/* Footer / Quick Info */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700">SEO OS v1.0</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
        </div>
        <p className="mt-1 text-[10px] text-slate-500 leading-relaxed">
          Tersinkronisasi otomatis dengan database Supabase Cloud.
        </p>
        <div className="mt-2.5 flex items-center justify-between border-t border-slate-200 pt-2">
          <span className="text-[10px] font-medium text-slate-500">
            Status Database
          </span>
          <span className="text-[10px] font-semibold text-emerald-600">
            Cloud Connected
          </span>
        </div>
      </div>
    </aside>
  );
};
