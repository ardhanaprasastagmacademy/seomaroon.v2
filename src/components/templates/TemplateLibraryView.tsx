import React, { useState, useEffect } from 'react';
import { store } from '@/lib/storage/store';
import type { PromptTemplate } from '@/types';
import { extractPlaceholders, detectSchemaFromMarkdown } from '@/lib/prompt-engine/placeholder-engine';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import {
  Layers,
  Search,
  Plus,
  Sparkles,
  Copy,
  Check,
  Tag,
  ExternalLink,
  Code2,
  X,
  FileText,
  RefreshCw
} from 'lucide-react';

const TemplateLibraryViewInner: React.FC = () => {
  const [templates, setTemplates] = useState<PromptTemplate[]>(() => store.getTemplates());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedTemplatePreview, setSelectedTemplatePreview] = useState<PromptTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom Template Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customNumber, setCustomNumber] = useState(() => store.getTemplates().length + 1);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<PromptTemplate['category']>('SEO');
  const [customDescription, setCustomDescription] = useState('');
  const [customMarkdown, setCustomMarkdown] = useState('');

  useEffect(() => {
    const list = store.getTemplates();
    setTemplates(list);
    setCustomNumber(list.length + 1);

    const unsubscribe = store.subscribe(() => {
      const updated = store.getTemplates();
      setTemplates(updated);
      setCustomNumber(updated.length + 1);
    });
    return () => unsubscribe();
  }, []);

  const loadTemplates = async (fetchCloud = false) => {
    const list = store.getTemplates();
    setTemplates(list);
    setCustomNumber(list.length + 1);

    if (fetchCloud) {
      setIsLoading(true);
      await store.fetchTemplatesFromSupabase();
      const updated = store.getTemplates();
      setTemplates(updated);
      setCustomNumber(updated.length + 1);
      setIsLoading(false);
    }
  };

  const handleRefreshCloud = async () => {
    setIsLoading(true);
    await store.fetchTemplatesFromSupabase();
    const updated = store.getTemplates();
    setTemplates(updated);
    setCustomNumber(updated.length + 1);
    setIsLoading(false);
  };

  const filteredTemplates = templates.filter((tpl) => {
    if (!tpl) return false;
    const name = String(tpl.name || '');
    const num = String(tpl.number || '');
    const desc = String(tpl.description || '');
    const cat = String(tpl.category || '');

    const matchesSearch =
      !searchQuery ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      num.includes(searchQuery) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || cat === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateCustomTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customMarkdown.trim()) {
      alert('Nama dan Markdown Template wajib diisi.');
      return;
    }

    const schema = detectSchemaFromMarkdown(customMarkdown);

    store.createTemplate({
      name: customName.trim(),
      category: customCategory,
      description: customDescription.trim() || 'Custom user prompt template.',
      template_markdown: customMarkdown,
      input_schema: schema,
    });

    setIsModalOpen(false);
    setCustomName('');
    setCustomDescription('');
    setCustomMarkdown('');
  };

  const handleCopyMarkdown = (tpl: PromptTemplate) => {
    navigator.clipboard.writeText(tpl.template_markdown);
    setCopiedId(tpl.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Master Template Library
            </h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              {templates.length} Templates Aktif
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            40+ Master Template SEO, AEO (Perplexity/Copilot), dan GEO (AI Overviews) yang tersinkronisasi dengan database Supabase.
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
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Template Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari template berdasarkan nama, nomor (#01 - #40), atau fungsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'SEO', 'AEO', 'GEO', 'Commercial', 'Copywriting'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((tpl) => {
          const placeholders = extractPlaceholders(tpl.template_markdown);
          const isCopied = copiedId === tpl.id;

          return (
            <div
              key={tpl.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 font-mono text-xs font-extrabold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    #{String(tpl.number).padStart(2, '0')}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {tpl.category}
                  </span>
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900 line-clamp-1 dark:text-white">
                  {tpl.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1">
                  {placeholders.slice(0, 3).map((ph) => (
                    <span
                      key={ph.key}
                      className="rounded bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    >
                      {'{' + ph.key + '}'}
                    </span>
                  ))}
                  {placeholders.length > 3 && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                      +{placeholders.length - 3} lagi
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  onClick={() => setSelectedTemplatePreview(tpl)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  <Code2 className="h-3.5 w-3.5" />
                  <span>Lihat Schema</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyMarkdown(tpl)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                    title="Copy Markdown"
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <a
                    href={`/prompt-builder?templateId=${tpl.id}`}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Gunakan</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Preview Template */}
      {selectedTemplatePreview && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-t-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5 dark:border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 font-mono text-xs font-bold text-blue-700">
                  #{String(selectedTemplatePreview.number).padStart(2, '0')}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate sm:text-base">
                  {selectedTemplatePreview.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTemplatePreview(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Deskripsi Strategi
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {selectedTemplatePreview.description}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Template Markdown Source
                </span>
                <div className="rounded-xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs text-slate-200 dark:border-slate-800">
                  <pre className="whitespace-pre-wrap">{selectedTemplatePreview.template_markdown}</pre>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 p-4 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                Kategori: <strong className="text-slate-700 dark:text-slate-300">{selectedTemplatePreview.category}</strong>
              </span>
              <a
                href={`/prompt-builder?templateId=${selectedTemplatePreview.id}`}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 sm:py-2"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Gunakan di Prompt Studio</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Template Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:rounded-2xl sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Buat Template Prompt Kustom
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomTemplate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Nama Template *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Perplexity Citations Expert"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Kategori
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="SEO">SEO (Search Engine Optimization)</option>
                  <option value="AEO">AEO (Answer Engine Optimization)</option>
                  <option value="GEO">GEO (Generative Engine Optimization)</option>
                  <option value="Commercial">Commercial & Conversion</option>
                  <option value="Copywriting">Copywriting</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Template Markdown * (Gunakan format {'{placeholder}'})
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Tulis prompt dengan placeholder seperti {title}, {primary_keyword}, {target_audience}..."
                  value={customMarkdown}
                  onChange={(e) => setCustomMarkdown(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 font-mono text-xs leading-relaxed dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 sm:py-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white shadow-sm hover:bg-blue-700 sm:py-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Simpan Template</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const TemplateLibraryView: React.FC = () => {
  return (
    <ErrorBoundary fallbackTitle="Kendala Memuat Master Template">
      <TemplateLibraryViewInner />
    </ErrorBoundary>
  );
};
