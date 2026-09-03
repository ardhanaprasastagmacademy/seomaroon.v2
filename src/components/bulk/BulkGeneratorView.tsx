import React, { useState, useEffect } from 'react';
import { store } from '@/lib/storage/store';
import type { ContentArticle, PromptTemplate, ExportFormat, Project } from '@/types';
import {
  executeBulkGeneration,
  downloadBulkAsZip,
  downloadBulkMasterFile,
  type BulkGenerationProgress,
  type BulkGeneratedItem
} from '@/lib/bulk/bulk-generator';
import { getFormatFileInfo } from '@/lib/formatter/prompt-formatter';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import confetti from 'canvas-confetti';
import {
  Boxes,
  Sparkles,
  Layers,
  CheckCircle2,
  Download,
  CalendarDays,
  Square,
  CheckSquare,
  ArrowRight,
  FileCode,
  FileSpreadsheet,
  RefreshCw,
  Copy,
  Check,
  Eye,
  X,
  FileText,
  Search,
  Zap,
  FolderArchive
} from 'lucide-react';

const BulkGeneratorViewInner: React.FC = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [calendar, setCalendar] = useState<ContentArticle[]>([]);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [selectedArticleIds, setSelectedArticleIds] = useState<Set<string>>(new Set());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-04');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('md');
  const [searchArticle, setSearchArticle] = useState('');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<BulkGenerationProgress | null>(null);
  const [generatedItems, setGeneratedItems] = useState<BulkGeneratedItem[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [previewItem, setPreviewItem] = useState<BulkGeneratedItem | null>(null);

  useEffect(() => {
    // Synchronous instant memory load
    syncFromMemory();

    // Subscribe to memory updates
    const unsubscribe = store.subscribe(() => {
      syncFromMemory();
    });

    return () => unsubscribe();
  }, []);

  const syncFromMemory = () => {
    const activeProj = store.getActiveProject();
    setProject(activeProj);
    const curCalendar = store.getCalendar(activeProj?.id);
    const curTemplates = store.getTemplates();
    setCalendar(curCalendar);
    setTemplates(curTemplates);

    // Check if articleIds passed via query params from calendar view
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const idsParam = urlParams.get('articleIds');
      if (idsParam) {
        const idList = idsParam.split(',').filter(Boolean);
        setSelectedArticleIds(new Set(idList));
      } else if (selectedArticleIds.size === 0) {
        setSelectedArticleIds(new Set(curCalendar.map(a => a.id)));
      }
    }
  };

  const handleRefreshCloud = async () => {
    setIsLoading(true);
    await Promise.all([
      store.fetchProjectsFromSupabase(),
      store.fetchCalendarFromSupabase(),
      store.fetchTemplatesFromSupabase(),
    ]);
    const activeProj = store.getActiveProject();
    setProject(activeProj);
    setCalendar(store.getCalendar(activeProj?.id));
    setTemplates(store.getTemplates());
    setIsLoading(false);
  };

  const handleToggleAll = () => {
    if (selectedArticleIds.size === filteredArticles.length && filteredArticles.length > 0) {
      setSelectedArticleIds(new Set());
    } else {
      setSelectedArticleIds(new Set(filteredArticles.map(a => a.id)));
    }
  };

  const handleToggleOne = (id: string) => {
    const next = new Set(selectedArticleIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedArticleIds(next);
  };

  const handleStartGeneration = async () => {
    const selectedArticles = calendar.filter(a => selectedArticleIds.has(a.id));
    const targetTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
    if (selectedArticles.length === 0 || !targetTemplate) return;

    setIsGenerating(true);
    setGeneratedItems([]);
    setProgress({
      current: 0,
      total: selectedArticles.length,
      percentage: 0,
      currentTitle: 'Menyiapkan batch...',
      isCompleted: false,
    });

    const items = await executeBulkGeneration(
      selectedArticles,
      targetTemplate,
      store.getActiveProject(),
      exportFormat,
      (prog) => setProgress(prog)
    );

    // Automatically persist all generated items to Supabase cloud and store
    items.forEach((item) => {
      const art = item.article;
      if (art && art.id) {
        store.saveGeneratedPrompt({
          project_id: store.getActiveProject()?.id || '',
          content_id: art.id,
          template_id: targetTemplate.id,
          template_number: targetTemplate.number,
          template_name: targetTemplate.name,
          template_version: targetTemplate.version,
          article_title: art.title || 'Artikel',
          primary_keyword: art.primary_keyword || '',
          input_data: item.variables,
          field_sources: {},
          generated_markdown: item.rawMarkdown || item.content,
        });
      }
    });

    setGeneratedItems(items);
    setIsGenerating(false);
    confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
  };

  const currentFormatInfo = getFormatFileInfo(exportFormat);

  const handleDownloadZip = async () => {
    if (generatedItems.length === 0) return;
    const cleanProjName = (project?.name || 'SEO-Prompts').replace(/[^a-zA-Z0-9_-]/g, '-');
    await downloadBulkAsZip(generatedItems, `${cleanProjName}-Prompts-${currentFormatInfo.extension.toUpperCase()}-ZIP.zip`);
  };

  const handleDownloadMasterFile = () => {
    if (generatedItems.length === 0) return;
    const cleanProjName = (project?.name || 'SEO-Prompts').replace(/[^a-zA-Z0-9_-]/g, '-');
    downloadBulkMasterFile(generatedItems, exportFormat, `${cleanProjName}-Master-Prompts`);
  };

  const handleCopyAll = () => {
    if (generatedItems.length === 0) return;

    let textToCopy = '';
    if (exportFormat === 'json_structured' || exportFormat === 'json_raw') {
      const jsonList = generatedItems.map(item => {
        try {
          return JSON.parse(item.content);
        } catch {
          return item.content;
        }
      });
      textToCopy = JSON.stringify(jsonList, null, 2);
    } else {
      textToCopy = generatedItems
        .map((item, idx) => `=== PROMPT #${idx + 1}: ${item.article.title || ''} ===\n\n${item.content}`)
        .join('\n\n' + '='.repeat(60) + '\n\n');
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Distinct clusters
  const allClusters = Array.from(new Set(calendar.map(a => String(a?.content_cluster || 'Umum')))).filter(Boolean);

  const filteredArticles = calendar.filter((a) => {
    if (!a) return false;
    const title = String(a.title || '');
    const kw = String(a.primary_keyword || '');
    const cluster = String(a.content_cluster || 'Umum');
    const matchesSearch = !searchArticle || title.toLowerCase().includes(searchArticle.toLowerCase()) || kw.toLowerCase().includes(searchArticle.toLowerCase());
    const matchesCluster = selectedClusterFilter === 'ALL' || cluster === selectedClusterFilter;
    return matchesSearch && matchesCluster;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Bulk Prompt Generator
            </h1>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
              Format Aktif: .{currentFormatInfo.extension.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Project: <strong className="text-slate-700 dark:text-slate-300">{project?.name || 'Project Aktif'}</strong> &bull; 
            Unduh puluhan prompt SEO dalam format yang Anda pilih: Markdown (.md), JSON Terstruktur (.json), atau YAML (.yaml).
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

          <a
            href="/calendar"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <CalendarDays className="h-4 w-4 text-blue-600" />
            <span>Lihat Kalender</span>
          </a>
        </div>
      </div>

      {/* Progress Box & Result Actions if Generating or Done */}
      {progress && (
        <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 animate-in fade-in duration-200">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3.5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-bold ${
                progress.isCompleted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 animate-pulse'
              }`}>
                {progress.isCompleted ? <CheckCircle2 className="h-7 w-7" /> : <Boxes className="h-7 w-7" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {progress.isCompleted ? `Sukses Men-generate ${generatedItems.length} File .${currentFormatInfo.extension.toUpperCase()}!` : 'Sedang Men-generate Prompt Massal...'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {progress.current} dari {progress.total} diproses &bull; Format: <strong className="text-blue-600 dark:text-blue-400 font-mono">.{currentFormatInfo.extension}</strong>
                </p>
              </div>
            </div>

            {/* Dynamic Format-True Download Actions */}
            {progress.isCompleted && (
              <div className="flex flex-wrap items-center gap-2.5">
                {/* 1. Download Master File in exact chosen format */}
                <button
                  onClick={handleDownloadMasterFile}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg"
                  title={`Download 1 file master gabungan berformat .${currentFormatInfo.extension}`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Download Master File (.{currentFormatInfo.extension})</span>
                </button>

                {/* 2. Download ZIP of individual files */}
                <button
                  onClick={handleDownloadZip}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-700"
                  title={`Unduh ZIP berisi ${generatedItems.length} file .${currentFormatInfo.extension} individual`}
                >
                  <FolderArchive className="h-4 w-4" />
                  <span>Download ZIP ({generatedItems.length} File .{currentFormatInfo.extension})</span>
                </button>

                {/* 3. Copy All */}
                <button
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {copiedAll ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedAll ? 'Tersalin Semua!' : 'Copy All'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Animated Progress Bar */}
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-150 ease-out ${
                progress.isCompleted ? 'bg-emerald-500' : 'bg-blue-600'
              }`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Configuration & Selection Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Step 1: Choose Template & Format */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              1. Pilih Master Template
            </h3>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {templates.length} Templates
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Template Prompt SEO:
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  #{String(tpl.number).padStart(2, '0')} &bull; {tpl.name} ({tpl.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Pilih Format Output Berkas:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'md', label: 'Markdown (.md)', ext: '.md' },
                { id: 'json_structured', label: 'JSON Structured (.json)', ext: '.json' },
                { id: 'json_raw', label: 'JSON Raw (.json)', ext: '.json' },
                { id: 'yaml', label: 'YAML (.yaml)', ext: '.yaml' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setExportFormat(f.id as ExportFormat)}
                  className={`rounded-xl border p-2.5 text-center text-xs font-bold transition-all ${
                    exportFormat === f.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-600 dark:bg-blue-950 dark:text-blue-300'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p>{f.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-850">
            <span className="font-bold text-slate-700 dark:text-slate-300">Format File yang Akan Diunduh:</span>
            <p className="mt-1 font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
              001-judul-artikel.{currentFormatInfo.extension}
            </p>
          </div>

          <button
            onClick={handleStartGeneration}
            disabled={selectedArticleIds.size === 0 || isGenerating}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate {selectedArticleIds.size} Prompt ({currentFormatInfo.extension.toUpperCase()})</span>
          </button>
        </div>

        {/* Step 2: Select Articles from Calendar (2 Cols) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="flex flex-col justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                2. Pilih Artikel ({selectedArticleIds.size} dipilih dari {calendar.length})
              </h3>
              <p className="text-[11px] text-slate-500">Centang artikel yang ingin dimasukkan dalam proses generate massal</p>
            </div>

            <button
              onClick={handleToggleAll}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
            >
              {selectedArticleIds.size === filteredArticles.length && filteredArticles.length > 0 ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              <span>{selectedArticleIds.size === filteredArticles.length && filteredArticles.length > 0 ? 'Batalkan Semua' : `Pilih Semua (${filteredArticles.length} Items)`}</span>
            </button>
          </div>

          {/* Quick Filters */}
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari judul atau keyword artikel..."
                value={searchArticle}
                onChange={(e) => setSearchArticle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <select
              value={selectedClusterFilter}
              onChange={(e) => setSelectedClusterFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="ALL">Semua Cluster ({calendar.length})</option>
              {allClusters.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Articles List */}
          <div className="mt-3 max-h-[460px] space-y-1.5 overflow-y-auto pr-1">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((art) => {
                const isSelected = selectedArticleIds.has(art.id);

                return (
                  <div
                    key={art.id}
                    onClick={() => handleToggleOne(art.id)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-2.5 text-xs transition-colors ${
                      isSelected
                        ? 'border-blue-200 bg-blue-50/60 dark:border-blue-900/60 dark:bg-blue-950/40'
                        : 'border-slate-100 bg-slate-50/40 hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-850/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <button className="text-slate-400 hover:text-slate-600">
                        {isSelected ? <CheckSquare className="h-4 w-4 text-blue-600" /> : <Square className="h-4 w-4" />}
                      </button>
                      <span className="font-bold text-slate-500 whitespace-nowrap">{art.day}</span>
                      <span className="font-semibold text-slate-800 truncate dark:text-slate-200">{art.title}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {art.content_cluster}
                      </span>
                      <span className="rounded bg-slate-200/80 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {art.primary_keyword}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                {calendar.length === 0 ? (
                  <div className="flex flex-col items-center justify-center">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">
                      Project ini belum memiliki artikel (mulai dari 0).
                    </p>
                    <p className="mt-1 text-slate-400">
                      Tambahkan artikel di Content Calendar atau impor data dari Excel terlebih dahulu.
                    </p>
                    <a
                      href="/calendar"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-all"
                    >
                      Buka Content Calendar
                    </a>
                  </div>
                ) : (
                  'Tidak ada artikel yang sesuai pencarian.'
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step 3: Interactive Table of Generated Results */}
      {generatedItems.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Hasil Berkas .{currentFormatInfo.extension.toUpperCase()} yang Di-generate ({generatedItems.length} File)
            </h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              Otomatis Tersimpan ke Supabase Cloud
            </span>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase dark:border-slate-800 dark:bg-slate-850">
                <tr>
                  <th className="px-3 py-2.5">No</th>
                  <th className="px-3 py-2.5">Nama File di ZIP</th>
                  <th className="px-4 py-2.5">Judul Artikel</th>
                  <th className="px-3 py-2.5">Format</th>
                  <th className="px-4 py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {generatedItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <td className="px-3 py-2.5 font-mono text-slate-400">{idx + 1}</td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                      {item.filename}
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-slate-900 dark:text-white">
                      {item.article.title}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        .{currentFormatInfo.extension}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Lihat ({currentFormatInfo.extension.toUpperCase()})</span>
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.content);
                            alert(`File "${item.filename}" berhasil disalin ke clipboard!`);
                          }}
                          className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview Modal for single item in exact chosen format */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  .{currentFormatInfo.extension}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-md">
                  {previewItem.filename}
                </h3>
              </div>
              <button onClick={() => setPreviewItem(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <pre className="rounded-xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap dark:border-slate-800">
                {previewItem.content}
              </pre>
            </div>
            <div className="flex justify-end p-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(previewItem.content);
                  setPreviewItem(null);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Isian ({currentFormatInfo.extension.toUpperCase()})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const BulkGeneratorView: React.FC = () => {
  return (
    <ErrorBoundary fallbackTitle="Kendala Memuat Bulk Generator">
      <BulkGeneratorViewInner />
    </ErrorBoundary>
  );
};
