import React, { useState, useEffect } from 'react';
import { store } from '@/lib/storage/store';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import {
  Sparkles,
  CalendarDays,
  FolderKanban,
  FileCode,
  Layers,
  Boxes,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  FileText,
  Upload,
  Zap,
  Tag,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import type { Project, ContentArticle, PromptTemplate, GeneratedPrompt } from '@/types';

const DashboardOverviewInner: React.FC = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [projectsCount, setProjectsCount] = useState(0);
  const [calendar, setCalendar] = useState<ContentArticle[]>([]);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Instant synchronous render from localStorage memory
    syncFromMemory();

    // Subscribe to local memory changes
    const unsubscribe = store.subscribe(() => {
      syncFromMemory();
    });

    return () => unsubscribe();
  }, []);

  const syncFromMemory = () => {
    const curProject = store.getActiveProject();
    setProject(curProject);
    setProjectsCount(store.getProjects().length);
    setCalendar(store.getCalendar(curProject?.id));
    setTemplates(store.getTemplates());
    setGeneratedPrompts(store.getGeneratedPrompts(curProject?.id));
  };

  const handleSyncCloud = async () => {
    setIsLoading(true);
    await Promise.all([
      store.fetchProjectsFromSupabase(),
      store.fetchCalendarFromSupabase(),
      store.fetchTemplatesFromSupabase(),
      store.fetchGeneratedPromptsFromSupabase(),
    ]);
    setIsLoading(false);
  };

  // Status breakdown
  const publishedCount = calendar.filter(a => a.status === 'Published').length;
  const draftCount = calendar.filter(a => a.status === 'Draft').length;
  const readyCount = calendar.filter(a => a.status === 'Ready').length;
  const genCount = calendar.filter(a => a.status === 'Generated').length;

  // Journey stage breakdown
  const tofuCount = calendar.filter(a => a.journey_stage === 'TOFU').length;
  const mofuCount = calendar.filter(a => a.journey_stage === 'MOFU').length;
  const bofuCount = calendar.filter(a => a.journey_stage === 'BOFU').length;

  // Cluster counts
  const clusterMap: Record<string, number> = {};
  calendar.forEach(a => {
    if (a) {
      const cluster = String(a.content_cluster || 'Umum');
      clusterMap[cluster] = (clusterMap[cluster] || 0) + 1;
    }
  });
  const topClusters = Object.entries(clusterMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-xl shadow-blue-500/10 dark:border-blue-900/50">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-100 backdrop-blur-sm">
                Project Aktif
              </span>
              <span className="text-xs text-blue-200">{project?.industry || 'SEO Content'}</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              {project?.name || 'SEO Prompt Studio'}
            </h1>
            <p className="mt-1 max-w-2xl text-xs text-blue-100/90 leading-relaxed sm:text-sm">
              Satu alur kerja terintegrasi: <span className="font-semibold text-white">Content Calendar &rarr; Data SEO &rarr; Template Prompt &rarr; Auto Fill &rarr; Export MD/JSON/ZIP</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSyncCloud}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-white backdrop-blur hover:bg-white/20 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>
            <a
              href="/prompt-builder"
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 shadow-md transition-all hover:bg-blue-50 hover:shadow-lg"
            >
              <Sparkles className="h-4 w-4" />
              <span>Buka Prompt Studio</span>
            </a>
            <a
              href="/calendar"
              className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              <Upload className="h-4 w-4" />
              <span>Import Excel</span>
            </a>
          </div>
        </div>

        {/* Ambient decorative circles */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 right-40 h-48 w-48 rounded-full bg-indigo-400/20 blur-xl" />
      </div>

      {/* 4 Metric Cards (Section 9 PRD) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Projects</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <FolderKanban className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{projectsCount}</span>
            <span className="text-[11px] font-medium text-slate-500">Project Terdaftar</span>
          </div>
          <a href="/projects" className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400">
            <span>Kelola project</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Content Items</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{calendar.length}</span>
            <span className="text-[11px] font-medium text-emerald-600">
              {calendar.length === 0 ? 'Mulai dari 0 artikel' : `${calendar.length} Artikel Kalender`}
            </span>
          </div>
          <a href="/calendar" className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline">
            <span>Lihat Content Calendar</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Generated Prompts</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <FileCode className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{generatedPrompts.length}</span>
            <span className="text-[11px] font-medium text-indigo-600">Tersimpan di DB</span>
          </div>
          <a href="/history" className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
            <span>Lihat Histori Prompt</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all hover:border-amber-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Templates</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{templates.length}</span>
            <span className="text-[11px] font-medium text-amber-600">Template 04-40</span>
          </div>
          <a href="/templates-manager" className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:underline dark:text-amber-400">
            <span>Jelajahi Library Template</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Middle Grid: Content Status & Funnel Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Content Status Breakdown (PRD Section 9) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Status Konten Kalender</h3>
            <span className="text-xs text-slate-400">{calendar.length} Total</span>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Published</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{publishedCount} artikel</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${(publishedCount / (calendar.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Ready</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{readyCount} artikel</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${(readyCount / (calendar.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Generated</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{genCount} artikel</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${(genCount / (calendar.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-600 dark:text-amber-400">Draft</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{draftCount} artikel</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${(draftCount / (calendar.length || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-850/50">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Journey Funnel Distribution</span>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="rounded bg-sky-100 px-2 py-0.5 font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">TOFU: {tofuCount}</span>
              <span className="rounded bg-violet-100 px-2 py-0.5 font-bold text-violet-800 dark:bg-violet-950 dark:text-violet-300">MOFU: {mofuCount}</span>
              <span className="rounded bg-rose-100 px-2 py-0.5 font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">BOFU: {bofuCount}</span>
            </div>
          </div>
        </div>

        {/* Content Clusters Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Topik & Cluster Teratas</h3>
            <Tag className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-4 space-y-3">
            {topClusters.length > 0 ? (
              topClusters.map(([name, count], i) => (
                <div key={name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 transition-colors hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-100 text-[10px] font-black text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 truncate dark:text-slate-200">{name}</span>
                  </div>
                  <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    {count} artikel
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                Belum ada cluster / artikel di project ini.
              </div>
            )}
          </div>
        </div>

        {/* Quick Launchpad & Workflows */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Aksi Cepat & Workflow</h3>

          <div className="mt-4 space-y-2.5">
            <a
              href="/prompt-builder"
              className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs font-semibold text-blue-900 transition-all hover:bg-blue-100 hover:shadow-sm dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold">Prompt Builder Studio</p>
                  <p className="text-[10px] text-blue-700/80 dark:text-blue-300/70">Auto-mapping 3-kolom & preview</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </a>

            <a
              href="/bulk"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-800 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                  <Boxes className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold">Bulk Generator</p>
                  <p className="text-[10px] text-slate-500">Generate 90 prompt & export .ZIP</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </a>

            <a
              href="/formatter"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-800 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                  <FileCode className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold">Prompt Formatter</p>
                  <p className="text-[10px] text-slate-500">Konversi ke JSON, YAML, TXT</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline (PRD Section 9) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Aktivitas Terkini</h3>
            <p className="text-xs text-slate-500">Histori generasi prompt dan impor kalender</p>
          </div>
          <a
            href="/history"
            className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Lihat Semua Histori
          </a>
        </div>

        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {generatedPrompts.length > 0 ? (
            generatedPrompts.slice(0, 5).map((gen) => (
              <div key={gen.id} className="flex items-center justify-between py-3.5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Generated Prompt: "{gen.article_title}"
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Template #{gen.template_number} ({gen.template_name}) &bull; Keyword: <span className="font-medium text-slate-700 dark:text-slate-300">{gen.primary_keyword}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">
                    {new Date(gen.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <a
                    href={`/formatter?genId=${gen.id}`}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                  >
                    Format
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              Belum ada prompt yang di-generate. Buka <a href="/prompt-builder" className="font-semibold text-blue-600 hover:underline">Prompt Builder</a> untuk memulai.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const DashboardOverview: React.FC = () => {
  return (
    <ErrorBoundary fallbackTitle="Kendala Memuat Dashboard">
      <DashboardOverviewInner />
    </ErrorBoundary>
  );
};
