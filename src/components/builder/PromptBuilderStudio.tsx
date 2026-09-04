import React, { useState, useEffect, useMemo } from 'react';
import { store } from '@/lib/storage/store';
import type { ContentArticle, Project, PromptTemplate, FieldSource } from '@/types';
import { autoMapTemplateFields, extractPlaceholders, humanizeKey } from '@/lib/prompt-engine/placeholder-engine';
import { renderPromptMarkdown } from '@/lib/prompt-engine/renderer';
import { generateDerivedFields } from '@/lib/prompt-engine/derived-engine';
import { saveFile } from '@/lib/utils/download';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Layers,
  FileCode,
  Copy,
  Download,
  Save,
  Send,
  RefreshCw,
  Check,
  Search,
  Sliders,
  Bot,
  Database,
  User,
  Wand2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Info,
  HelpCircle,
  FileText
} from 'lucide-react';

const PromptBuilderStudioInner: React.FC<{ initialArticleId?: string }> = ({ initialArticleId }) => {
  const [project, setProject] = useState<Project | null>(() => store.getActiveProject());
  const [calendar, setCalendar] = useState<ContentArticle[]>(() => {
    const p = store.getActiveProject();
    return store.getCalendar(p?.id);
  });
  const [templates, setTemplates] = useState<PromptTemplate[]>(() => store.getTemplates());
  
  // Selected Article & Template
  const [selectedArticleId, setSelectedArticleId] = useState<string>(() => {
    if (initialArticleId) return initialArticleId;
    const p = store.getActiveProject();
    const curCal = store.getCalendar(p?.id);
    return curCal[0]?.id || '';
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-04');
  
  // Search & Filter for Left Column Templates
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategory, setTemplateCategory] = useState('ALL');

  // Form State & Source Tracking
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [fieldSources, setFieldSources] = useState<Record<string, FieldSource>>({});
  
  // UI states
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'TEMPLATE' | 'FORM' | 'PREVIEW'>('FORM');

  useEffect(() => {
    loadInitialData();
    const unsubscribe = store.subscribe(() => {
      loadInitialData();
    });
    return () => unsubscribe();
  }, []);

  const loadInitialData = () => {
    const curProject = store.getActiveProject();
    const curCalendar = store.getCalendar(curProject?.id);
    const curTemplates = store.getTemplates();

    setProject(curProject);
    setCalendar(curCalendar);
    setTemplates(curTemplates);

    // Initial article ID from prop or URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const artIdFromUrl = urlParams.get('articleId') || initialArticleId;
      if (artIdFromUrl && curCalendar.some(a => a.id === artIdFromUrl)) {
        setSelectedArticleId(artIdFromUrl);
      } else if (curCalendar.length > 0) {
        setSelectedArticleId(curCalendar[0]!.id);
      } else {
        setSelectedArticleId('');
      }

      const tplIdFromUrl = urlParams.get('templateId');
      if (tplIdFromUrl && curTemplates.some(t => t.id === tplIdFromUrl)) {
        setSelectedTemplateId(tplIdFromUrl);
      }
    }
  };

  const selectedArticle = useMemo(() => {
    return calendar.find(a => a.id === selectedArticleId) || calendar[0];
  }, [calendar, selectedArticleId]);

  const selectedTemplate = useMemo(() => {
    return templates.find(t => t.id === selectedTemplateId) || templates[0];
  }, [templates, selectedTemplateId]);

  // Sync Form Values when Article, Template, or Project changes (with Draft support)
  useEffect(() => {
    if (!selectedTemplate) return;

    // Check if a saved draft exists
    const draft = project ? store.getDraft(project.id, selectedTemplate.id, selectedArticle?.id) : undefined;
    
    if (draft && draft.input_values && Object.keys(draft.input_values).length > 0) {
      setFormValues(draft.input_values);
      setFieldSources(draft.field_sources || {});
    } else {
      // Auto-map from Excel + Project + Derived
      const { values, sources } = autoMapTemplateFields(
        selectedTemplate.template_markdown,
        selectedArticle,
        project || undefined
      );
      setFormValues(values);
      setFieldSources(sources);
    }
  }, [selectedArticle, selectedTemplate, project]);

  // Real-time Immutable Markdown Render (PRD Section 35 & 36)
  const renderedMarkdown = useMemo(() => {
    if (!selectedTemplate) return '';
    return renderPromptMarkdown(selectedTemplate.template_markdown, formValues);
  }, [selectedTemplate, formValues]);

  // Derived calculations for preview metrics
  const wordCount = useMemo(() => {
    return renderedMarkdown.trim() ? renderedMarkdown.trim().split(/\s+/).length : 0;
  }, [renderedMarkdown]);

  const estimatedTokens = useMemo(() => {
    return Math.round(wordCount * 1.35);
  }, [wordCount]);

  // Filter templates list
  const filteredTemplates = templates.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.number.toString().includes(templateSearch) ||
      t.description.toLowerCase().includes(templateSearch.toLowerCase());
    const matchesCategory = templateCategory === 'ALL' || t.category === templateCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle manual field change
  const handleFieldChange = (key: string, value: any) => {
    const newValues = { ...formValues, [key]: value };
    const newSources = { ...fieldSources, [key]: 'MANUAL' as FieldSource };
    setFormValues(newValues);
    setFieldSources(newSources);

    // Auto-save draft (PRD Section 71 & 72)
    if (project && selectedTemplate) {
      store.saveDraft({
        project_id: project.id,
        content_id: selectedArticle?.id,
        template_id: selectedTemplate.id,
        input_values: newValues,
        field_sources: newSources,
        updated_at: new Date().toISOString(),
      });
    }
  };

  // AI Field Regenerator Helper
  const handleRegenerateDerivedField = (key: string) => {
    if (!selectedArticle) return;
    const derived = generateDerivedFields(selectedArticle, project || undefined);
    if ((derived as any)[key] !== undefined) {
      handleFieldChange(key, (derived as any)[key]);
    }
  };

  // 1-Click Copy
  const handleCopy = () => {
    navigator.clipboard.writeText(renderedMarkdown);
    setIsCopied(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.85 } });
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 1-Click Download .md
  const handleDownload = () => {
    const cleanSlug = (selectedArticle?.slug || selectedArticle?.title || 'prompt')
      .replace(/^\/blog\//, '')
      .replace(/^\//, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .toLowerCase();

    const blob = new Blob([renderedMarkdown], { type: 'text/markdown;charset=utf-8' });
    saveFile(blob, `${cleanSlug}.md`);
  };

  // Save to DB History
  const handleSaveToDB = () => {
    if (!project || !selectedTemplate) return;

    store.saveGeneratedPrompt({
      project_id: project.id,
      content_id: selectedArticle?.id,
      template_id: selectedTemplate.id,
      template_number: selectedTemplate.number,
      template_name: selectedTemplate.name,
      template_version: selectedTemplate.version,
      article_title: selectedArticle?.title || formValues.article_title || 'Generated Prompt',
      primary_keyword: selectedArticle?.primary_keyword || formValues.primary_keyword || '',
      input_data: formValues,
      field_sources: fieldSources,
      generated_markdown: renderedMarkdown,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Send to Formatter with 1-Click Prompt Object
  const handleSendToFormatter = () => {
    const promptObject = {
      template_id: selectedTemplate?.id,
      template_number: selectedTemplate?.number,
      template_name: selectedTemplate?.name,
      template_version: selectedTemplate?.version,
      project_id: project?.id,
      content_id: selectedArticle?.id,
      article_title: selectedArticle?.title || formValues.article_title,
      primary_keyword: selectedArticle?.primary_keyword || formValues.primary_keyword,
      variables: formValues,
      markdown: renderedMarkdown,
      created_at: new Date().toISOString(),
    };

    sessionStorage.setItem('active_formatter_prompt', JSON.stringify(promptObject));
    window.location.href = '/formatter?from=builder';
  };

  const getSourceBadge = (source?: FieldSource) => {
    switch (source) {
      case 'EXCEL':
        return <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">EXCEL</span>;
      case 'PROJECT':
        return <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">PROJECT</span>;
      case 'AI':
      case 'DERIVED':
        return <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[9px] font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-300">AI / DERIVED</span>;
      default:
        return <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">MANUAL</span>;
    }
  };

  const schemaFields = selectedTemplate?.input_schema || [];
  const placeholderKeys = extractPlaceholders(selectedTemplate?.template_markdown || '');

  return (
    <div className="space-y-4">
      {/* Top Header Bar & Article Selector */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              Prompt Builder Studio
            </h1>
            <p className="text-[11px] text-slate-500">
              3-Kolom Studio: Template &rarr; Auto-Mapping Form &rarr; Immutable Markdown Preview
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Pilih Artikel:</span>
          <select
            value={selectedArticleId}
            onChange={(e) => setSelectedArticleId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-600 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:max-w-sm"
          >
            {calendar.length > 0 ? (
              calendar.map((art) => (
                <option key={art.id} value={art.id}>
                  {art.day} &bull; {art.title} ({art.primary_keyword})
                </option>
              ))
            ) : (
              <option value="">(Belum ada artikel di project ini - Form Manual)</option>
            )}
          </select>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex rounded-xl border border-slate-200 bg-white p-1 text-xs font-semibold dark:border-slate-800 dark:bg-slate-900 xl:hidden">
        <button
          onClick={() => setActiveMobileTab('TEMPLATE')}
          className={`flex-1 rounded-lg py-2 transition-all ${
            activeMobileTab === 'TEMPLATE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          1. Template ({selectedTemplate?.number})
        </button>
        <button
          onClick={() => setActiveMobileTab('FORM')}
          className={`flex-1 rounded-lg py-2 transition-all ${
            activeMobileTab === 'FORM' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          2. Input Form ({Object.keys(formValues).length})
        </button>
        <button
          onClick={() => setActiveMobileTab('PREVIEW')}
          className={`flex-1 rounded-lg py-2 transition-all ${
            activeMobileTab === 'PREVIEW' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          3. Live Preview
        </button>
      </div>

      {/* 3-COLUMN DESKTOP STUDIO (PRD Section 60) */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* ================= COLUMN 1: TEMPLATE SELECTOR (3 cols) ================= */}
        <div className={`space-y-4 xl:col-span-3 ${activeMobileTab !== 'TEMPLATE' ? 'hidden xl:block' : 'block'}`}>
          <div className="flex min-h-[60vh] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900 xl:h-[calc(100vh-210px)]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Template Library</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">{filteredTemplates.length} Ready</span>
            </div>

            {/* Template Search & Category Filter */}
            <div className="mt-3 space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari no / nama template..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {['ALL', 'SEO', 'AEO/GEO', 'Local SEO', 'E-Commerce'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTemplateCategory(cat)}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold transition-all ${
                      templateCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Cards List */}
            <div className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
              {filteredTemplates.map((tpl) => {
                const isSelected = tpl.id === selectedTemplate?.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-1 ring-blue-600 dark:border-blue-500 dark:bg-blue-950/40'
                        : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-850/40 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`flex h-5 w-6 items-center justify-center rounded text-[10px] font-black ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {tpl.number < 10 ? '0' + tpl.number : tpl.number}
                      </span>
                      <span className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {tpl.category}
                      </span>
                    </div>

                    <h4 className="mt-2 text-xs font-bold text-slate-900 line-clamp-2 dark:text-white">
                      {tpl.name}
                    </h4>
                    <p className="mt-1 text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= COLUMN 2: INPUT FORM & AI ASSISTANTS (5 cols) ================= */}
        <div className={`space-y-4 xl:col-span-5 ${activeMobileTab !== 'FORM' ? 'hidden xl:block' : 'block'}`}>
          <div className="flex min-h-[60vh] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 xl:h-[calc(100vh-210px)]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Form Input & Auto-Mapping
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span>Template #{selectedTemplate?.number}</span>
                <span>&bull;</span>
                <span className="font-semibold text-emerald-600">Auto-Synced</span>
              </div>
            </div>

            {/* Dynamic Fields Form */}
            <div className="mt-3 flex-1 space-y-4 overflow-y-auto pr-2">
              {placeholderKeys.map((key) => {
                const value = formValues[key] || '';
                const source = fieldSources[key] || 'MANUAL';
                const label = humanizeKey(key);
                const isTextarea = ['outline_structure', 'query_fan_out', 'internal_links', 'existing_content_summary', 'objections_handling', 'value_propositions'].includes(key);

                return (
                  <div key={key} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-850/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                          {label}
                        </label>
                        {getSourceBadge(source)}
                      </div>

                      {/* AI Re-generate Button if it's an AI-capable field */}
                      {['search_intent', 'query_fan_out', 'outline_structure', 'schema_markup', 'target_audience', 'internal_links'].includes(key) && (
                        <button
                          type="button"
                          onClick={() => handleRegenerateDerivedField(key)}
                          className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          <Wand2 className="h-3 w-3" />
                          <span>Generate AI</span>
                        </button>
                      )}
                    </div>

                    {isTextarea ? (
                      <textarea
                        rows={key === 'outline_structure' ? 5 : 3}
                        value={value}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        placeholder={`Masukkan ${label}...`}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        placeholder={`Masukkan ${label}...`}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= COLUMN 3: LIVE MARKDOWN PREVIEW (4 cols) ================= */}
        <div className={`space-y-4 xl:col-span-4 ${activeMobileTab !== 'PREVIEW' ? 'hidden xl:block' : 'block'}`}>
          <div className="flex min-h-[60vh] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900 xl:h-[calc(100vh-210px)]">
            {/* Header & Metrics */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Live Markdown Preview</h3>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <span>{wordCount} kata</span>
                <span>&bull;</span>
                <span>~{estimatedTokens} tokens</span>
              </div>
            </div>

            {/* Markdown Preview Content Area (PRD Section 37) */}
            <div className="mt-3 flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-slate-950 p-4 font-mono text-[11px] text-slate-200 leading-relaxed dark:border-slate-800">
              <pre className="whitespace-pre-wrap select-all">{renderedMarkdown}</pre>
            </div>

            {/* Actions Bar (PRD Section 37 & 38) */}
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-800 transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{isCopied ? 'Tersalin!' : 'Copy Prompt'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-800 transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Download className="h-3.5 w-3.5 text-blue-600" />
                  <span>Download .md</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSaveToDB}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2 text-xs font-bold text-white shadow-sm hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  {isSaved ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Save className="h-3.5 w-3.5" />}
                  <span>{isSaved ? 'Tersimpan!' : 'Simpan ke DB'}</span>
                </button>

                <button
                  onClick={handleSendToFormatter}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send to Formatter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PromptBuilderStudio: React.FC<{ initialArticleId?: string }> = (props) => {
  return (
    <ErrorBoundary fallbackTitle="Kendala Memuat Prompt Studio">
      <PromptBuilderStudioInner {...props} />
    </ErrorBoundary>
  );
};
