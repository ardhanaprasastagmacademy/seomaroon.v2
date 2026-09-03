import React, { useState, useEffect } from 'react';
import { store } from '@/lib/storage/store';
import type { ContentArticle, Project } from '@/types';
import { ExcelImportModal } from './ExcelImportModal';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import confetti from 'canvas-confetti';
import {
  CalendarDays,
  Search,
  Upload,
  Boxes,
  Sparkles,
  CheckSquare,
  Square,
  Trash2,
  FileSpreadsheet,
  X,
  Tag,
  Target,
  Clock,
  Layers,
  CheckCircle2,
  Plus,
  Edit2,
  RefreshCw,
  LayoutGrid,
  List,
  ArrowUpDown,
  Filter,
  Check,
  Zap
} from 'lucide-react';

const ContentCalendarInner: React.FC = () => {
  const [calendar, setCalendar] = useState<ContentArticle[]>(() => {
    const activeProj = store.getActiveProject();
    return store.getCalendar(activeProj?.id);
  });
  const [project, setProject] = useState<Project | null>(() => store.getActiveProject());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('ALL');
  const [selectedJourney, setSelectedJourney] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDay, setSelectedDay] = useState('ALL');
  const [sortBy, setSortBy] = useState<'DAY_ASC' | 'DAY_DESC' | 'TITLE_AZ' | 'DATE_NEWEST'>('DAY_ASC');
  const [viewMode, setViewMode] = useState<'TABLE' | 'GRID'>('TABLE');
  const [isLoading, setIsLoading] = useState(false);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCluster('ALL');
    setSelectedJourney('ALL');
    setSelectedStatus('ALL');
    setSelectedDay('ALL');
  };

  // Multi-selection for bulk generation
  const [selectedArticleIds, setSelectedArticleIds] = useState<Set<string>>(new Set());

  // Modals & Notifications
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedArticleDetail, setSelectedArticleDetail] = useState<ContentArticle | null>(null);
  const [editingArticle, setEditingArticle] = useState<ContentArticle | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // New article form state
  const [newArticle, setNewArticle] = useState<Partial<ContentArticle>>({
    day: 'Hari 01',
    time_slot: '09:00',
    content_cluster: 'Umum',
    title: '',
    primary_keyword: '',
    secondary_keywords: '',
    search_volume: '> 2,000',
    competition: 'Menengah',
    journey_stage: 'TOFU',
    content_format: 'Panduan Lengkap + AEO FAQ',
    cta: 'Konsultasi via WhatsApp',
    status: 'Ready',
  });

  useEffect(() => {
    // Instant synchronous render from localStorage memory
    syncCalendarFromMemory();

    // Subscribe to memory changes
    const unsubscribe = store.subscribe(() => {
      syncCalendarFromMemory();
    });

    return () => unsubscribe();
  }, []);

  const syncCalendarFromMemory = () => {
    const activeProj = store.getActiveProject();
    setProject(activeProj);
    const items = store.getCalendar(activeProj?.id);
    setCalendar(Array.isArray(items) ? items : []);
  };

  const handleRefreshCloud = async () => {
    setIsLoading(true);
    await store.fetchCalendarFromSupabase();
    setIsLoading(false);
    setSuccessBanner('Sinkronisasi data langsung dari cloud Supabase berhasil.');
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleImportSuccess = (count: number) => {
    loadCalendar(false);
    setSuccessBanner(`Berhasil mengimpor ${count} artikel ke dalam Content Calendar dan Supabase.`);
    setTimeout(() => setSuccessBanner(null), 6000);
  };

  const handleQuickStatusChange = (id: string, newStatus: ContentArticle['status'], e: React.MouseEvent) => {
    e.stopPropagation();
    store.updateArticle(id, { status: newStatus });
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.primary_keyword) {
      alert('Mohon isi Judul Artikel dan Target Keyword Utama.');
      return;
    }

    const created = store.addArticles([newArticle]);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    setIsAddModalOpen(false);
    setNewArticle({
      day: 'Hari 01',
      time_slot: '09:00',
      content_cluster: 'Umum',
      title: '',
      primary_keyword: '',
      secondary_keywords: '',
      search_volume: '> 2,000',
      competition: 'Menengah',
      journey_stage: 'TOFU',
      content_format: 'Panduan Lengkap + AEO FAQ',
      cta: 'Konsultasi via WhatsApp',
      status: 'Ready',
    });
    setSuccessBanner('Artikel baru berhasil ditambahkan ke kalender dan cloud Supabase.');
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleSaveEditArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    store.updateArticle(editingArticle.id, editingArticle);
    setEditingArticle(null);
    setSuccessBanner('Perubahan artikel berhasil disimpan.');
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  // Distinct filters with safe string handling
  const allClusters = Array.from(new Set(calendar.map(a => String(a?.content_cluster || 'Umum')))).filter(Boolean);
  const allDays = Array.from(new Set(calendar.map(a => String(a?.day || 'Hari 01')))).filter(Boolean);

  // Filtered & Sorted articles with safe string coercion
  const filteredArticles = calendar
    .filter((item) => {
      if (!item) return false;
      const title = String(item.title || '');
      const primary = String(item.primary_keyword || '');
      const secondary = String(item.secondary_keywords || '');
      const cluster = String(item.content_cluster || 'Umum');
      const journey = String(item.journey_stage || 'TOFU');
      const status = String(item.status || 'Draft');
      const day = String(item.day || 'Hari 01');

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        title.toLowerCase().includes(searchLower) ||
        primary.toLowerCase().includes(searchLower) ||
        secondary.toLowerCase().includes(searchLower);

      const matchesCluster = selectedCluster === 'ALL' || cluster === selectedCluster;
      const matchesJourney = selectedJourney === 'ALL' || journey === selectedJourney;
      const matchesStatus = selectedStatus === 'ALL' || status === selectedStatus;
      const matchesDay = selectedDay === 'ALL' || day === selectedDay;

      return matchesSearch && matchesCluster && matchesJourney && matchesStatus && matchesDay;
    })
    .sort((a, b) => {
      if (sortBy === 'DAY_ASC') {
        return String(a.day || '').localeCompare(String(b.day || ''));
      }
      if (sortBy === 'DAY_DESC') {
        return String(b.day || '').localeCompare(String(a.day || ''));
      }
      if (sortBy === 'TITLE_AZ') {
        return String(a.title || '').localeCompare(String(b.title || ''));
      }
      if (sortBy === 'DATE_NEWEST') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

  // Dynamic status counters for currently active project
  const countPublished = calendar.filter(a => a.status === 'Published').length;
  const countReady = calendar.filter(a => a.status === 'Ready').length;
  const countGenerated = calendar.filter(a => a.status === 'Generated').length;
  const countDraft = calendar.filter(a => a.status === 'Draft').length;

  const handleToggleSelectAll = () => {
    if (selectedArticleIds.size === filteredArticles.length && filteredArticles.length > 0) {
      setSelectedArticleIds(new Set());
    } else {
      setSelectedArticleIds(new Set(filteredArticles.map(a => a.id)));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    const next = new Set(selectedArticleIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedArticleIds(next);
  };

  const handleDeleteArticle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus artikel ini dari content calendar dan database Supabase?')) {
      store.deleteArticle(id);
    }
  };

  const handleLaunchBulk = () => {
    const ids = Array.from(selectedArticleIds).join(',');
    window.location.href = `/bulk?articleIds=${ids}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dynamic Content Calendar
            </h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              {calendar.length} Items Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Project: <span className="font-semibold text-slate-700 dark:text-slate-300">{project?.name || 'Project Aktif'}</span> &bull; 
            Tersinkronisasi real-time dengan database Supabase Cloud.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Cloud Sync Refresh */}
          <button
            onClick={handleRefreshCloud}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            title="Sinkronkan ulang dari Supabase"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-emerald-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync Cloud</span>
          </button>

          {/* Add Article Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <Plus className="h-4 w-4 text-emerald-400" />
            <span>Tambah Artikel</span>
          </button>

          {/* Import Excel Button */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Import Excel</span>
          </button>

          {/* Bulk Generator */}
          <a
            href="/bulk"
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 shadow-sm transition-all hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300"
          >
            <Boxes className="h-4 w-4" />
            <span>Bulk Studio</span>
          </a>
        </div>
      </div>

      {/* Dynamic Status Counter Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          onClick={() => setSelectedStatus(selectedStatus === 'Published' ? 'ALL' : 'Published')}
          className={`cursor-pointer rounded-2xl border p-3.5 transition-all ${
            selectedStatus === 'Published'
              ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Published</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <span className="mt-1 block text-2xl font-black text-slate-900 dark:text-white">{countPublished}</span>
        </div>

        <div
          onClick={() => setSelectedStatus(selectedStatus === 'Ready' ? 'ALL' : 'Ready')}
          className={`cursor-pointer rounded-2xl border p-3.5 transition-all ${
            selectedStatus === 'Ready'
              ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Ready</span>
            <span className="h-2 w-2 rounded-full bg-blue-500" />
          </div>
          <span className="mt-1 block text-2xl font-black text-slate-900 dark:text-white">{countReady}</span>
        </div>

        <div
          onClick={() => setSelectedStatus(selectedStatus === 'Generated' ? 'ALL' : 'Generated')}
          className={`cursor-pointer rounded-2xl border p-3.5 transition-all ${
            selectedStatus === 'Generated'
              ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Generated</span>
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
          </div>
          <span className="mt-1 block text-2xl font-black text-slate-900 dark:text-white">{countGenerated}</span>
        </div>

        <div
          onClick={() => setSelectedStatus(selectedStatus === 'Draft' ? 'ALL' : 'Draft')}
          className={`cursor-pointer rounded-2xl border p-3.5 transition-all ${
            selectedStatus === 'Draft'
              ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Draft</span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <span className="mt-1 block text-2xl font-black text-slate-900 dark:text-white">{countDraft}</span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Floating Multi-Selection Action Bar */}
      {selectedArticleIds.size > 0 && (
        <div className="sticky top-20 z-20 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-600 px-4 py-3 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-700">
              {selectedArticleIds.size}
            </span>
            <span className="text-xs font-semibold">Artikel dipilih</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedArticleIds(new Set())}
              className="rounded-lg px-3 py-1 text-xs font-medium text-blue-100 hover:bg-blue-700"
            >
              Batal
            </button>
            <button
              onClick={handleLaunchBulk}
              className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-1.5 text-xs font-bold text-blue-700 shadow-sm hover:bg-blue-50"
            >
              <Boxes className="h-3.5 w-3.5" />
              <span>Generate {selectedArticleIds.size} Prompt</span>
            </button>
          </div>
        </div>
      )}

      {/* Filters & Control Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul artikel, keyword utama, atau LSI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Filter Dropdowns & View Mode */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Day Filter */}
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-700 focus:border-blue-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="ALL">Semua Hari ({calendar.length})</option>
              {allDays.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>

            {/* Cluster Filter */}
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-700 focus:border-blue-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="ALL">Semua Cluster</option>
              {allClusters.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Journey Stage */}
            <select
              value={selectedJourney}
              onChange={(e) => setSelectedJourney(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-700 focus:border-blue-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="ALL">Semua Funnel</option>
              <option value="TOFU">TOFU</option>
              <option value="MOFU">MOFU</option>
              <option value="BOFU">BOFU</option>
            </select>

            {/* Sort Selector */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-slate-800 dark:bg-slate-800">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none dark:text-slate-300"
              >
                <option value="DAY_ASC">Urutkan: Hari (01 &rarr; 30)</option>
                <option value="DAY_DESC">Urutkan: Hari (30 &rarr; 01)</option>
                <option value="TITLE_AZ">Urutkan: Judul (A &rarr; Z)</option>
                <option value="DATE_NEWEST">Urutkan: Terbaru</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('TABLE')}
                className={`rounded-md p-1.5 text-xs transition-all ${
                  viewMode === 'TABLE'
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
                title="Tampilan Tabel"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('GRID')}
                className={`rounded-md p-1.5 text-xs transition-all ${
                  viewMode === 'GRID'
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
                title="Tampilan Grid Matrix"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: DYNAMIC TABLE VIEW */}
      {viewMode === 'TABLE' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-850">
                <tr>
                  <th className="w-10 px-4 py-3 text-center">
                    <button onClick={handleToggleSelectAll} className="text-slate-400 hover:text-slate-600">
                      {selectedArticleIds.size === filteredArticles.length && filteredArticles.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-3 py-3">Hari / Waktu</th>
                  <th className="px-4 py-3 min-w-[280px]">Judul Artikel</th>
                  <th className="px-3 py-3">Target Keyword</th>
                  <th className="px-3 py-3">Cluster</th>
                  <th className="px-3 py-3">Funnel</th>
                  <th className="px-3 py-3">Status (Klik Ubah)</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((art) => {
                    const isSelected = selectedArticleIds.has(art.id);
                    const title = String(art.title || 'Artikel Tanpa Judul');
                    const primaryKw = String(art.primary_keyword || '-');
                    const cluster = String(art.content_cluster || 'Umum');
                    const day = String(art.day || 'Hari 01');
                    const time = String(art.time_slot || '');
                    const journey = String(art.journey_stage || 'TOFU');
                    const status = String(art.status || 'Draft');

                    return (
                      <tr
                        key={art.id}
                        onClick={() => setSelectedArticleDetail(art)}
                        className={`cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
                          isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggleSelectOne(art.id)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>

                        {/* Day & Time */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="font-bold text-slate-800 dark:text-slate-200">{day}</div>
                          {time && <div className="text-[10px] text-slate-400">{time}</div>}
                        </td>

                        {/* Title */}
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900 line-clamp-1 dark:text-white">
                            {title}
                          </div>
                          {art.slug && (
                            <div className="text-[10px] text-slate-400 truncate max-w-xs font-mono">
                              {art.slug}
                            </div>
                          )}
                        </td>

                        {/* Primary Keyword */}
                        <td className="px-3 py-3 font-medium text-slate-700 dark:text-slate-300">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                            {primaryKw}
                          </span>
                        </td>

                        {/* Cluster */}
                        <td className="px-3 py-3">
                          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            {cluster}
                          </span>
                        </td>

                        {/* Funnel */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-extrabold ${
                              journey === 'TOFU'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : journey === 'MOFU'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            }`}
                          >
                            {journey}
                          </span>
                        </td>

                        {/* Live Quick Status Selector */}
                        <td className="px-3 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={status}
                            onChange={(e) => handleQuickStatusChange(art.id, e.target.value as any, e as any)}
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              status === 'Published'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : status === 'Ready'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                : status === 'Generated'
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            <option value="Published">Published</option>
                            <option value="Ready">Ready</option>
                            <option value="Generated">Generated</option>
                            <option value="Draft">Draft</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`/prompt-builder?articleId=${art.id}`}
                              className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400"
                            >
                              <Sparkles className="h-3 w-3" />
                              <span>Prompt</span>
                            </a>

                            <button
                              onClick={() => setEditingArticle(art)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                              title="Edit artikel"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              onClick={(e) => handleDeleteArticle(art.id, e)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                              title="Hapus artikel"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="mx-auto flex max-w-md flex-col items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                          <FileSpreadsheet className="h-8 w-8" />
                        </div>
                        {calendar.length === 0 ? (
                          <>
                            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                              Project Baru: Belum Ada Artikel (Mulai dari 0)
                            </h3>
                            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              Project <span className="font-semibold text-slate-700 dark:text-slate-300">{project?.name || 'ini'}</span> masih bersih tanpa artikel. Anda dapat menambahkan artikel secara bertahap atau mengimpor file Excel Content Calendar Anda.
                            </p>
                            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                              <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
                              >
                                <Plus className="h-4 w-4" />
                                <span>Tambah Artikel Pertama</span>
                              </button>
                              <button
                                onClick={() => setIsImportModalOpen(true)}
                                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                              >
                                <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span>Import File Excel</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
                              Tidak Ada Artikel yang Sesuai Filter
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                              Coba ubah kata kunci pencarian atau reset filter di atas.
                            </p>
                            <button
                              onClick={resetFilters}
                              className="mt-3 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400"
                            >
                              Reset Filter
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: DYNAMIC GRID / MATRIX VIEW */}
      {viewMode === 'GRID' && (
        filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticleDetail(art)}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {art.day} &bull; {art.time_slot}
                  </span>

                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      art.status === 'Published'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : art.status === 'Ready'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {art.status}
                  </span>
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900 line-clamp-2 dark:text-white">
                  {art.title}
                </h3>

                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 truncate">
                    🎯 {art.primary_keyword}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                  <span className="text-[11px] text-slate-500">{art.content_cluster}</span>
                  <a
                    href={`/prompt-builder?articleId=${art.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-blue-700"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Build Prompt</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex max-w-md flex-col items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <FileSpreadsheet className="h-8 w-8" />
              </div>
              {calendar.length === 0 ? (
                <>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    Project Baru: Belum Ada Artikel (Mulai dari 0)
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Project <span className="font-semibold text-slate-700 dark:text-slate-300">{project?.name || 'ini'}</span> masih bersih tanpa artikel. Anda dapat menambahkan artikel secara bertahap atau mengimpor file Excel Content Calendar Anda.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Tambah Artikel Pertama</span>
                    </button>
                    <button
                      onClick={() => setIsImportModalOpen(true)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>Import File Excel</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
                    Tidak Ada Artikel yang Sesuai Filter
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Coba ubah kata kunci pencarian atau reset filter di atas.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-3 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400"
                  >
                    Reset Filter
                  </button>
                </>
              )}
            </div>
          </div>
        )
      )}

      {/* MODAL 1: ADD NEW ARTICLE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tambah Artikel Kalender Baru
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Hari (Slot)</label>
                  <input
                    type="text"
                    value={newArticle.day}
                    onChange={(e) => setNewArticle({ ...newArticle, day: e.target.value })}
                    placeholder="Hari 01"
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Slot Waktu</label>
                  <input
                    type="text"
                    value={newArticle.time_slot}
                    onChange={(e) => setNewArticle({ ...newArticle, time_slot: e.target.value })}
                    placeholder="09:00"
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Judul Artikel *</label>
                <input
                  type="text"
                  required
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="Contoh: 10 Rekomendasi Jasa Kontraktor..."
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Target Keyword Utama *</label>
                <input
                  type="text"
                  required
                  value={newArticle.primary_keyword}
                  onChange={(e) => setNewArticle({ ...newArticle, primary_keyword: e.target.value })}
                  placeholder="Contoh: jasa kontraktor jakarta"
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Content Cluster</label>
                  <input
                    type="text"
                    value={newArticle.content_cluster}
                    onChange={(e) => setNewArticle({ ...newArticle, content_cluster: e.target.value })}
                    placeholder="Renovasi Rumah"
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Funnel Stage</label>
                  <select
                    value={newArticle.journey_stage}
                    onChange={(e) => setNewArticle({ ...newArticle, journey_stage: e.target.value as any })}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="TOFU">TOFU (Awareness)</option>
                    <option value="MOFU">MOFU (Consideration)</option>
                    <option value="BOFU">BOFU (Decision)</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  <Check className="h-4 w-4" />
                  <span>Simpan ke Database</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ARTICLE MODAL */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Artikel Kalender
              </h3>
              <button onClick={() => setEditingArticle(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditArticle} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Judul Artikel</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Target Keyword Utama</label>
                <input
                  type="text"
                  required
                  value={editingArticle.primary_keyword}
                  onChange={(e) => setEditingArticle({ ...editingArticle, primary_keyword: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Cluster</label>
                  <input
                    type="text"
                    value={editingArticle.content_cluster}
                    onChange={(e) => setEditingArticle({ ...editingArticle, content_cluster: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Status</label>
                  <select
                    value={editingArticle.status}
                    onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value as any })}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Published">Published</option>
                    <option value="Ready">Ready</option>
                    <option value="Generated">Generated</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Target CTA Konversi</label>
                <input
                  type="text"
                  value={editingArticle.cta}
                  onChange={(e) => setEditingArticle({ ...editingArticle, cta: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  <Check className="h-4 w-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ARTICLE STRATEGY DETAIL DRAWER */}
      {selectedArticleDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {selectedArticleDetail.day} &bull; {selectedArticleDetail.time_slot}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {selectedArticleDetail.content_cluster}
                  </span>
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {selectedArticleDetail.journey_stage}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                  {selectedArticleDetail.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedArticleDetail(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5 dark:border-slate-800 dark:bg-slate-850/40">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-blue-600" />
                  SEO Information
                </span>
                <div>
                  <span className="text-slate-500 block text-[10px]">Target Keyword Utama:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedArticleDetail.primary_keyword}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Keyword Sekunder / LSI:</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedArticleDetail.secondary_keywords || '-'}</span>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Search Volume:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedArticleDetail.search_volume}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Tingkat Kompetisi:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedArticleDetail.competition}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5 dark:border-slate-800 dark:bg-slate-850/40">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-emerald-600" />
                  Content Strategy
                </span>
                <div>
                  <span className="text-slate-500 block text-[10px]">Format Konten & GEO:</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedArticleDetail.content_format}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Target CTA Konversi:</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">{selectedArticleDetail.cta}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">URL Slug:</span>
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">{selectedArticleDetail.slug}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedArticleDetail(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Tutup
              </button>
              <a
                href={`/prompt-builder?articleId=${selectedArticleDetail.id}`}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                <Sparkles className="h-4 w-4" />
                <span>Buka di Prompt Builder</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: EXCEL IMPORTER */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={(count) => handleImportSuccess(count)}
      />
    </div>
  );
};

export const ContentCalendarView: React.FC = () => {
  return (
    <ErrorBoundary fallbackTitle="Kendala Memuat Content Calendar">
      <ContentCalendarInner />
    </ErrorBoundary>
  );
};
