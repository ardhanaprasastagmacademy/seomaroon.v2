import React, { useState, useEffect } from 'react';
import { store } from '@/lib/storage/store';
import type { Project } from '@/types';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import confetti from 'canvas-confetti';
import {
  FolderKanban,
  Plus,
  Globe,
  Building,
  MapPin,
  MessageSquare,
  FileCheck,
  CheckCircle2,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  RefreshCw,
  Search,
  Sparkles,
  X
} from 'lucide-react';

const ProjectManagerInner: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    website_url: '',
    business_name: '',
    industry: '',
    description: '',
    primary_location: 'Jakarta',
    default_language: 'Bahasa Indonesia (Formal & Informatif)',
    default_tone: 'Profesional & Otoritatif',
    default_cta: 'Konsultasi Gratis via WhatsApp',
  });

  useEffect(() => {
    loadData(false);
    const unsubscribe = store.subscribe(() => {
      loadData(false);
    });
    return () => unsubscribe();
  }, []);

  const loadData = async (fetchCloud = false) => {
    setProjects(store.getProjects());
    setActiveProject(store.getActiveProject());

    if (fetchCloud) {
      setIsLoading(true);
      await store.fetchProjectsFromSupabase();
      setProjects(store.getProjects());
      setActiveProject(store.getActiveProject());
      setIsLoading(false);
    }
  };

  const handleRefreshCloud = async () => {
    setIsLoading(true);
    await store.fetchProjectsFromSupabase();
    setProjects(store.getProjects());
    setActiveProject(store.getActiveProject());
    setIsLoading(false);
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      website_url: '',
      business_name: '',
      industry: '',
      description: '',
      primary_location: 'Jakarta',
      default_language: 'Bahasa Indonesia (Formal & Informatif)',
      default_tone: 'Profesional & Otoritatif',
      default_cta: 'Konsultasi Gratis via WhatsApp',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setFormData({
      name: p.name,
      website_url: p.website_url || '',
      business_name: p.business_name || '',
      industry: p.industry || '',
      description: p.description || '',
      primary_location: p.primary_location || 'Jakarta',
      default_language: p.default_language || 'Bahasa Indonesia (Formal & Informatif)',
      default_tone: p.default_tone || 'Profesional & Otoritatif',
      default_cta: p.default_cta || 'Konsultasi Gratis via WhatsApp',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama project wajib diisi.');
      return;
    }

    if (editingProject) {
      store.updateProject(editingProject.id, formData);
    } else {
      store.createProject(formData);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus project ini beserta data kalender terkait?')) {
      store.deleteProject(id);
      loadData(false);
    }
  };

  const handleSetActive = (id: string) => {
    store.setActiveProject(id);
  };

  const filteredProjects = projects.filter(p => {
    if (!p) return false;
    const name = String(p.name || '');
    const ind = String(p.industry || '');
    const loc = String(p.primary_location || '');
    const q = searchQuery.toLowerCase();
    return !q || name.toLowerCase().includes(q) || ind.toLowerCase().includes(q) || loc.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Kelola Multi-Project SEO
            </h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              {projects.length} Projects Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Setiap project menyimpan profil brand, lokasi target GEO, konfigurasi CTA, dan Content Calendar terpisah di Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshCloud}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-emerald-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Syncing...' : 'Sync Cloud'}</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Project Baru</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari project berdasarkan nama, industri, atau lokasi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Project Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p) => {
            const isActive = p.id === activeProject?.id;
            const articleCount = store.getCalendar(p.id).length;

            return (
              <div
                key={p.id}
                onClick={() => handleSetActive(p.id)}
                className={`flex flex-col justify-between rounded-2xl border p-5 transition-all cursor-pointer ${
                  isActive
                    ? 'border-blue-500 bg-blue-50/20 shadow-md ring-1 ring-blue-500 dark:bg-blue-950/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {p.industry || 'General SEO'}
                    </span>

                    {isActive ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Aktif Sekarang</span>
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetActive(p.id);
                        }}
                        className="text-[11px] font-semibold text-slate-400 hover:text-blue-600"
                      >
                        Jadikan Aktif
                      </button>
                    )}
                  </div>

                  <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                    {p.name}
                  </h3>

                  {p.business_name && (
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {p.business_name}
                    </p>
                  )}

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {p.website_url && (
                      <div className="flex items-center gap-2 text-[11px]">
                        <Globe className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate font-mono">{p.website_url}</span>
                      </div>
                    )}
                    {p.primary_location && (
                      <div className="flex items-center gap-2 text-[11px]">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{p.primary_location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[11px]">
                      <Layers className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {articleCount} Artikel di Kalender
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <a
                    href="/calendar"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetActive(p.id);
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Buka Kalender &rarr;
                  </a>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openEditModal(p)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                      title="Edit Profil Project"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleDelete(p.id, e)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                      title="Hapus Project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex max-w-md flex-col items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <FolderKanban className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              Belum Ada Project
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Anda belum memiliki project terdaftar. Buat project baru untuk mulai mengelola strategi SEO dan prompt kalender.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-5 flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Project Baru</span>
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingProject ? 'Edit Profil Project' : 'Tambah Project Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Nama Project / Klien *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kontraktor Bangunan Malang"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Industri / Niche
                  </label>
                  <input
                    type="text"
                    placeholder="Konstruksi & Renovasi"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Lokasi Target (GEO SEO)
                  </label>
                  <input
                    type="text"
                    placeholder="Malang & Surabaya"
                    value={formData.primary_location}
                    onChange={(e) => setFormData({ ...formData, primary_location: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://kontraktorpro.com"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Default CTA Konversi
                  </label>
                  <input
                    type="text"
                    placeholder="Konsultasi via WhatsApp (0812...)"
                    value={formData.default_cta}
                    onChange={(e) => setFormData({ ...formData, default_cta: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Default Tone of Voice
                </label>
                <input
                  type="text"
                  placeholder="Profesional, Otoritatif, Ramah & Solutif"
                  value={formData.default_tone}
                  onChange={(e) => setFormData({ ...formData, default_tone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{editingProject ? 'Simpan Perubahan' : 'Buat Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const ProjectManager: React.FC = () => {
  return (
    <ErrorBoundary fallbackTitle="Kendala Memuat Manajer Project">
      <ProjectManagerInner />
    </ErrorBoundary>
  );
};
