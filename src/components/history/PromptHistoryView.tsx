import React, { useState, useEffect } from 'react';
import { store } from '@/lib/storage/store';
import type { GeneratedPrompt } from '@/types';
import { saveFile } from '@/lib/utils/download';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import {
  History,
  Search,
  FileCode,
  Copy,
  Download,
  Trash2,
  ExternalLink,
  Check,
  Eye,
  X,
  Sparkles,
  CalendarDays,
  RefreshCw,
  Clock,
  Tag
} from 'lucide-react';

const PromptHistoryViewInner: React.FC = () => {
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPromptPreview, setSelectedPromptPreview] = useState<GeneratedPrompt | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadHistory(false);
    const unsubscribe = store.subscribe(() => {
      loadHistory(false);
    });
    return () => unsubscribe();
  }, []);

  const loadHistory = async (fetchCloud = false) => {
    setPrompts(store.getGeneratedPrompts());
    if (fetchCloud) {
      setIsLoading(true);
      await store.fetchGeneratedPromptsFromSupabase();
      setPrompts(store.getGeneratedPrompts());
      setIsLoading(false);
    }
  };

  const handleRefreshCloud = async () => {
    setIsLoading(true);
    await store.fetchGeneratedPromptsFromSupabase();
    setPrompts(store.getGeneratedPrompts());
    setIsLoading(false);
  };

  const filteredPrompts = prompts.filter((p) => {
    if (!p) return false;
    const searchLower = searchQuery.toLowerCase();
    const title = String(p.article_title || '');
    const kw = String(p.primary_keyword || '');
    const tplName = String(p.template_name || '');

    return (
      !searchQuery ||
      title.toLowerCase().includes(searchLower) ||
      kw.toLowerCase().includes(searchLower) ||
      tplName.toLowerCase().includes(searchLower)
    );
  });

  const handleCopy = (prompt: GeneratedPrompt) => {
    navigator.clipboard.writeText(prompt.generated_markdown);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (prompt: GeneratedPrompt) => {
    const cleanTitle = (prompt.article_title || 'prompt')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .toLowerCase();
    const blob = new Blob([prompt.generated_markdown], { type: 'text/markdown;charset=utf-8' });
    saveFile(blob, `${cleanTitle}.md`);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus histori prompt ini dari database?')) {
      const result = await store.deleteGeneratedPrompt(id);
      if (!result.success && result.error) {
        alert(`Prompt dihapus secara lokal, namun gagal menghapus dari Supabase: ${result.error}`);
      }
    }
  };

  const handleSendToFormatter = (prompt: GeneratedPrompt) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('transfer_prompt_raw', prompt.generated_markdown);
      sessionStorage.setItem('transfer_prompt_title', prompt.article_title || 'SEO Prompt');
      window.location.href = '/formatter';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Histori & Arsip Prompt
            </h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              {prompts.length} Prompts Tersimpan
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Riwayat seluruh prompt SEO yang pernah di-generate, tersinkronisasi dengan database cloud Supabase.
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
            href="/prompt-builder"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Baru</span>
          </a>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari histori berdasarkan judul artikel, keyword, atau nomor template..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Prompts List */}
      {filteredPrompts.length > 0 ? (
        <div className="space-y-3">
          {filteredPrompts.map((p) => {
            const isCopied = copiedId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPromptPreview(p)}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-soft transition-all hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        Template #{p.template_number || '04'}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {p.template_name}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(p.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {p.article_title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        🎯 {p.primary_keyword}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleCopy(p)}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{isCopied ? 'Tersalin' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => handleDownload(p)}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      title="Download Markdown (.md)"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => handleSendToFormatter(p)}
                      className="rounded-lg border border-blue-200 bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-400"
                      title="Konversi ke JSON / YAML (Formatter)"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleDelete(p.id, e)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                      title="Hapus dari Histori"
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
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <History className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
            Belum Ada Histori Prompt Tersimpan
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Generate prompt SEO Anda di Prompt Studio untuk melihat arsipnya di sini.
          </p>
          <a
            href="/prompt-builder"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Buka Prompt Studio Sekarang</span>
          </a>
        </div>
      )}

      {/* Prompt Preview Modal */}
      {selectedPromptPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
              <div>
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Template #{selectedPromptPreview.template_number}
                </span>
                <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                  {selectedPromptPreview.article_title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedPromptPreview(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="rounded-xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-200 dark:border-slate-800">
                <pre className="whitespace-pre-wrap">{selectedPromptPreview.generated_markdown}</pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 p-4 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">
                Primary Keyword: <strong className="text-slate-700 dark:text-slate-300">{selectedPromptPreview.primary_keyword}</strong>
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(selectedPromptPreview)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Markdown</span>
                </button>
                <button
                  onClick={() => handleSendToFormatter(selectedPromptPreview)}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Send to Formatter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const PromptHistoryView: React.FC = () => {
  return (
    <ErrorBoundary fallbackTitle="Kendala Memuat Histori Prompt">
      <PromptHistoryViewInner />
    </ErrorBoundary>
  );
};
