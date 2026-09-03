import React, { useState, useEffect, useRef } from 'react';
import { store } from '@/lib/storage/store';
import type { Project, ContentArticle } from '@/types';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  FolderKanban, 
  Plus, 
  Search, 
  CheckCircle2, 
  ChevronDown, 
  Moon, 
  Sun, 
  FileSpreadsheet,
  ExternalLink,
  X,
  Building2,
  Globe,
  MapPin,
  Layers,
  MessageSquare,
  Volume2
} from 'lucide-react';

export const AppNavbar: React.FC<{ activePage?: string }> = ({ activePage }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [calendar, setCalendar] = useState<ContentArticle[]>([]);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Project Form
  const [newProject, setNewProject] = useState({
    name: '',
    industry: '',
    business_name: '',
    website_url: '',
    primary_location: 'Indonesia',
    default_cta: 'Konsultasi via WhatsApp',
    default_tone: 'Profesional & Terpercaya',
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
    const unsubscribeStore = store.subscribe(() => {
      loadData();
    });

    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark') || 
        localStorage.getItem('theme') === 'dark';
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProjectDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      unsubscribeStore();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadData = () => {
    setProjects(store.getProjects());
    setActiveProject(store.getActiveProject());
    setCalendar(store.getCalendar());
  };

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSelectProject = (id: string) => {
    store.setActiveProject(id);
    setIsProjectDropdownOpen(false);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) {
      alert('Nama project wajib diisi.');
      return;
    }

    const created = store.createProject({
      name: newProject.name.trim(),
      industry: newProject.industry.trim() || 'General SEO',
      business_name: newProject.business_name.trim() || newProject.name.trim(),
      website_url: newProject.website_url.trim(),
      primary_location: newProject.primary_location.trim() || 'Indonesia',
      default_cta: newProject.default_cta.trim() || 'Konsultasi via WhatsApp',
      default_tone: newProject.default_tone.trim() || 'Profesional & Terpercaya',
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    setIsCreateModalOpen(false);
    setIsProjectDropdownOpen(false);
    setNewProject({
      name: '',
      industry: '',
      business_name: '',
      website_url: '',
      primary_location: 'Indonesia',
      default_cta: 'Konsultasi via WhatsApp',
      default_tone: 'Profesional & Terpercaya',
    });
  };

  // Filter projects by search
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
    (p.industry || '').toLowerCase().includes(projectSearch.toLowerCase())
  );

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
        {/* Brand & Dynamic Project Switcher */}
        <div className="flex items-center gap-3.5">
          <a href="/" className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base tracking-tight font-extrabold text-blue-600 dark:text-blue-400">SEO PROMPT</span>
              <span className="ml-1 text-base font-semibold text-slate-700 dark:text-slate-300">STUDIO</span>
            </div>
          </a>

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block" />

          {/* Dynamic Project Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 transition-all hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
            >
              <FolderKanban className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div className="flex items-center gap-1.5 max-w-[150px] truncate sm:max-w-[220px]">
                <span className="truncate">{activeProject?.name || 'Pilih Project'}</span>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isProjectDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 px-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Daftar Project ({projects.length})
                  </span>
                  <a
                    href="/projects"
                    onClick={() => setIsProjectDropdownOpen(false)}
                    className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Kelola Semua
                  </a>
                </div>

                {/* Project Search Box */}
                {projects.length > 2 && (
                  <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari project..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                )}

                {/* Project Items List */}
                <div className="mt-2 max-h-56 space-y-1 overflow-y-auto">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((proj) => {
                      const isActive = proj.id === activeProject?.id;
                      const projectArticleCount = store.getCalendar(proj.id).length;

                      return (
                        <button
                          key={proj.id}
                          onClick={() => handleSelectProject(proj.id)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-all ${
                            isActive
                              ? 'bg-blue-50/80 font-bold text-blue-700 shadow-sm dark:bg-blue-950/60 dark:text-blue-300'
                              : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/80'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <p className="truncate font-semibold">{proj.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-normal mt-0.5">
                              <span>{proj.industry || 'General'}</span>
                              <span>&bull;</span>
                              <span className="text-blue-600 dark:text-blue-400 font-medium">
                                {projectArticleCount} Artikel
                              </span>
                            </div>
                          </div>

                          {isActive && (
                            <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-4 text-center text-xs text-slate-400">
                      Belum ada project terdaftar.
                    </div>
                  )}
                </div>

                {/* Add Project Quick Action */}
                <div className="mt-2 border-t border-slate-100 pt-2 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProjectDropdownOpen(false);
                      setIsCreateModalOpen(true);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/50"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Project Baru</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Links */}
          <a
            href="/calendar"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Calendar</span>
          </a>

          <a
            href="/prompt-builder"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Buka Studio</span>
          </a>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-850/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <FolderKanban className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Buat Project SEO Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kelola brand, target lokasi, dan CTA konten terpisah
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateProject} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Project / Brand <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kontraktor Bangunan Malang"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Industri / Niche
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Konstruksi & Renovasi"
                      value={newProject.industry}
                      onChange={(e) => setNewProject({ ...newProject, industry: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lokasi Target (GEO SEO)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Malang & Surabaya"
                      value={newProject.primary_location}
                      onChange={(e) => setNewProject({ ...newProject, primary_location: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="url"
                      placeholder="https://kontraktorpro.com"
                      value={newProject.website_url}
                      onChange={(e) => setNewProject({ ...newProject, website_url: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Default Target CTA
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Konsultasi via WhatsApp"
                      value={newProject.default_cta}
                      onChange={(e) => setNewProject({ ...newProject, default_cta: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Default Tone of Voice
                </label>
                <div className="relative">
                  <Volume2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Profesional, Otoritatif, Ramah & Solutif"
                    value={newProject.default_tone}
                    onChange={(e) => setNewProject({ ...newProject, default_tone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Simpan & Aktifkan Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
