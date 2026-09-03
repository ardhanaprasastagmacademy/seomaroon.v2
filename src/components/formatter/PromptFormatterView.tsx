import React, { useState, useEffect, useMemo } from 'react';
import { store } from '@/lib/storage/store';
import type { ExportFormat, PromptObject } from '@/types';
import { formatPrompt, getFormatFileInfo } from '@/lib/formatter/prompt-formatter';
import { saveFile } from '@/lib/utils/download';
import confetti from 'canvas-confetti';
import {
  FileCode,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Check,
  FileText,
  Code2,
  Sparkles,
  ArrowRight,
  Terminal
} from 'lucide-react';

export const PromptFormatterView: React.FC = () => {
  const [inputMarkdown, setInputMarkdown] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json_structured');
  const [promptMetadata, setPromptMetadata] = useState<Record<string, any>>({});
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // 1. Check if transferred from Prompt Builder via SessionStorage
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('active_formatter_prompt');
      if (stored) {
        try {
          const parsed: PromptObject = JSON.parse(stored);
          setInputMarkdown(parsed.markdown || '');
          setPromptMetadata({
            template_number: parsed.template_number || 4,
            template_name: parsed.article_title || 'SEO Prompt',
            primary_keyword: parsed.variables?.primary_keyword,
            article_title: parsed.article_title,
            input_data: parsed.variables,
          });
          sessionStorage.removeItem('active_formatter_prompt');
          return;
        } catch (e) {
          console.error(e);
        }
      }

      // 2. Check if passed via query param ?genId=...
      const urlParams = new URLSearchParams(window.location.search);
      const genId = urlParams.get('genId');
      if (genId) {
        const genList = store.getGeneratedPrompts();
        const found = genList.find(g => g.id === genId);
        if (found) {
          setInputMarkdown(found.generated_markdown);
          setPromptMetadata({
            template_number: found.template_number,
            template_name: found.template_name,
            primary_keyword: found.primary_keyword,
            article_title: found.article_title,
            input_data: found.input_data,
          });
          return;
        }
      }

      // Default sample markdown if empty
      if (!inputMarkdown) {
        const templates = store.getTemplates();
        const tpl04 = templates.find(t => t.number === 4) || templates[0];
        if (tpl04) {
          setInputMarkdown(tpl04.template_markdown);
        }
      }
    }
  }, []);

  // Formatted output text
  const formattedOutput = useMemo(() => {
    return formatPrompt(inputMarkdown, selectedFormat, promptMetadata);
  }, [inputMarkdown, selectedFormat, promptMetadata]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputMarkdown(content || '');
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedOutput);
    setIsCopied(true);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.85 } });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const fileInfo = getFormatFileInfo(selectedFormat);
    const cleanTitle = (promptMetadata.article_title || 'prompt')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .toLowerCase();

    const blob = new Blob([formattedOutput], { type: fileInfo.mimeType });
    saveFile(blob, `${cleanTitle}.${fileInfo.extension}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Prompt Formatter & Converter
            </h1>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
              Multi-Format Engine
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Ubah prompt Markdown ke JSON Structured, JSON Raw, YAML, atau TXT tanpa kehilangan konteks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <Upload className="h-4 w-4 text-blue-600" />
            <span>Upload File .md</span>
            <input
              type="file"
              accept=".md,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {/* Format Selector Tabs (PRD Section 40 & 41) */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        {[
          { id: 'json_structured', label: 'JSON Structured (Recommended)', desc: 'Parsed into metadata, input, instructions, output' },
          { id: 'json_raw', label: 'JSON Raw', desc: '{"prompt": "..."}' },
          { id: 'yaml', label: 'YAML (.yaml)', desc: 'Clean key-value YAML structure' },
          { id: 'md', label: 'Markdown (.md)', desc: 'Native raw markdown text' },
          { id: 'txt', label: 'Plain Text (.txt)', desc: 'Raw text output' },
        ].map((fmt) => (
          <button
            key={fmt.id}
            onClick={() => setSelectedFormat(fmt.id as ExportFormat)}
            className={`flex-1 min-w-[160px] rounded-xl p-3 text-left transition-all ${
              selectedFormat === fmt.id
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <p className="text-xs font-bold">{fmt.label}</p>
            <p className={`mt-0.5 text-[10px] ${selectedFormat === fmt.id ? 'text-blue-100' : 'text-slate-400'}`}>
              {fmt.desc}
            </p>
          </button>
        ))}
      </div>

      {/* 2-Column Split: Input Markdown vs Output Formatted Code */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input Column */}
        <div className="flex h-[calc(100vh-300px)] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Input Markdown Prompt
              </h3>
            </div>
            <button
              onClick={() => setInputMarkdown('')}
              className="text-[10px] font-semibold text-slate-400 hover:text-red-500"
            >
              Clear Input
            </button>
          </div>

          <textarea
            value={inputMarkdown}
            onChange={(e) => setInputMarkdown(e.target.value)}
            placeholder="Paste prompt markdown Anda di sini..."
            className="mt-3 flex-1 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        {/* Output Column */}
        <div className="flex h-[calc(100vh-300px)] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Formatted Output ({selectedFormat.toUpperCase()})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{isCopied ? 'Tersalin!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="mt-3 flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs text-slate-200 dark:border-slate-800">
            <pre className="whitespace-pre-wrap select-all">{formattedOutput}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
