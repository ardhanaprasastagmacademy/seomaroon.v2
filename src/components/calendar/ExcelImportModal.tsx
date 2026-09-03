import React, { useState, useRef } from 'react';
import { store } from '@/lib/storage/store';
import {
  readExcelWorkbook,
  autoDetectColumnMapping,
  processExcelRows,
  generateSampleExcelWorkbook,
  DEFAULT_COLUMN_MAPPING
} from '@/lib/excel/parser';
import type { ColumnMappingConfig, ExcelParsedSheet } from '@/types';
import { saveFile } from '@/lib/utils/download';
import confetti from 'canvas-confetti';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  ArrowRight,
  RefreshCw,
  Layers,
  X,
  FileCheck,
  Eye,
  Trash2
} from 'lucide-react';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (importedCount: number) => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [sheetsData, setSheetsData] = useState<Record<string, ExcelParsedSheet>>({});
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [columnMapping, setColumnMapping] = useState<ColumnMappingConfig>(DEFAULT_COLUMN_MAPPING);
  const [step, setStep] = useState<'UPLOAD' | 'SHEET_AND_MAPPING' | 'VALIDATION'>('UPLOAD');
  const [isDragging, setIsDragging] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [importMode, setImportMode] = useState<'REPLACE' | 'APPEND'>('REPLACE');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadSample = () => {
    const buffer = generateSampleExcelWorkbook();
    const blob = new Blob([buffer as any], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveFile(blob, 'Kalender-Konten-SEO-30-Hari-Sample.xlsx');
  };

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile) return;
    setIsLoading(true);
    setFile(selectedFile);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const parsed = readExcelWorkbook(buffer);

      if (parsed.sheetNames.length === 0) {
        alert('File Excel kosong atau tidak memiliki sheet yang dapat dibaca.');
        setIsLoading(false);
        return;
      }

      setSheetNames(parsed.sheetNames);
      setSheetsData(parsed.sheets);
      setSelectedSheet(parsed.defaultSheetName);

      const activeSheet = parsed.sheets[parsed.defaultSheetName];
      if (activeSheet) {
        const detectedMapping = autoDetectColumnMapping(activeSheet.headers);
        setColumnMapping(detectedMapping);
      }

      setStep('SHEET_AND_MAPPING');
    } catch (err) {
      console.error(err);
      alert('Gagal membaca file. Pastikan format file .xlsx, .xls, atau .csv valid.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSheetChange = (sheetName: string) => {
    setSelectedSheet(sheetName);
    const activeSheet = sheetsData[sheetName];
    if (activeSheet) {
      const detectedMapping = autoDetectColumnMapping(activeSheet.headers);
      setColumnMapping(detectedMapping);
    }
  };

  const handleProceedToValidation = () => {
    const activeSheet = sheetsData[selectedSheet];
    if (!activeSheet) return;

    const activeProject = store.getActiveProject();
    const result = processExcelRows(activeSheet.data, columnMapping, activeProject.id);
    setValidationResult(result);
    setStep('VALIDATION');
  };

  const handleFinalImport = () => {
    if (!validationResult || validationResult.articles.length === 0) return;

    const activeProject = store.getActiveProject();

    // If user selected REPLACE mode, clear existing articles for this project first
    if (importMode === 'REPLACE') {
      store.clearCalendar(activeProject.id);
    }

    // Add new articles from Excel to store
    store.addArticles(validationResult.articles);

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });

    if (onImportSuccess) {
      onImportSuccess(validationResult.articles.length);
    }
    
    onClose();
  };

  const currentSheet = sheetsData[selectedSheet];
  const headers = currentSheet?.headers || [];
  const previewRows = currentSheet?.data.slice(0, 4) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Import Content Calendar (.xlsx / .xls / .csv)
              </h2>
              <p className="text-xs text-slate-500">
                Pilih file Excel Anda, sesuaikan pemetaan kolom, dan masukkan ke database.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* STEP 1: UPLOAD */}
          {step === 'UPLOAD' && (
            <div className="space-y-6">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files[0]) handleFileChange(e.dataTransfer.files[0]);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
                  isDragging
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-slate-300 hover:border-blue-400 dark:border-slate-700 dark:hover:border-blue-600'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
                  }}
                />
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                  Tarik file Excel (.xlsx / .csv) Anda ke sini
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Atau klik untuk browse file dari komputer Anda
                </p>
                {isLoading && (
                  <p className="mt-3 text-xs font-semibold text-blue-600 animate-pulse">
                    Membaca struktur workbook...
                  </p>
                )}
              </div>

              {/* Sample Excel Download Box */}
              <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/40 dark:bg-blue-950/30">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-xs font-bold text-blue-900 dark:text-blue-200">
                      Butuh contoh format kalender Excel?
                    </p>
                    <p className="text-[11px] text-blue-700/80 dark:text-blue-300/70">
                      Download file sample Kalender Konten 30 Hari (90 Artikel) untuk panduan format.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadSample}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Sample</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SHEET SELECTION & COLUMN MAPPING & LIVE PREVIEW */}
          {step === 'SHEET_AND_MAPPING' && (
            <div className="space-y-6">
              {/* File Info */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-850">
                <div className="flex items-center gap-2.5">
                  <FileCheck className="h-5 w-5 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {file?.name || 'File Excel'}
                    </span>
                    <span className="ml-2 text-[10px] text-slate-400">
                      {file ? `${(file.size / 1024).toFixed(1)} KB` : ''}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setStep('UPLOAD')}
                  className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  Ganti File
                </button>
              </div>

              {/* Sheet Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pilih Sheet dari Workbook:
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sheetNames.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleSheetChange(name)}
                      className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                        selectedSheet === name
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>{name}</span>
                      <span className="text-[10px] opacity-80">
                        ({sheetsData[name]?.rowCount || 0} baris)
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview of Parsed Rows */}
              {previewRows.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Pratinjau Data Asli File Excel (4 Baris Pertama):
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {currentSheet?.rowCount || 0} total baris
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-850">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700">
                          {headers.slice(0, 6).map((h, i) => (
                            <th key={i} className="px-2.5 py-1.5 font-bold truncate max-w-[150px]">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
                        {previewRows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {headers.slice(0, 6).map((h, cIdx) => (
                              <td key={cIdx} className="px-2.5 py-1.5 text-slate-700 truncate max-w-[150px] dark:text-slate-300">
                                {row[h] || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Column Mapping Grid */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Pemetaan Kolom (Column Mapping):
                  </label>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    ✓ Otomatis terdeteksi dari header Excel
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-850/40 sm:grid-cols-2">
                  {/* Judul Artikel */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      Judul Artikel *
                    </label>
                    <select
                      value={columnMapping.title}
                      onChange={(e) => setColumnMapping({ ...columnMapping, title: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="">-- Pilih Kolom --</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>

                  {/* Target Keyword Utama */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      Target Keyword Utama *
                    </label>
                    <select
                      value={columnMapping.primary_keyword}
                      onChange={(e) => setColumnMapping({ ...columnMapping, primary_keyword: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="">-- Pilih Kolom --</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>

                  {/* Secondary Keyword */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Keyword Sekunder / LSI
                    </label>
                    <select
                      value={columnMapping.secondary_keywords}
                      onChange={(e) => setColumnMapping({ ...columnMapping, secondary_keywords: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="">-- (Opsional) --</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>

                  {/* Content Cluster */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Content Cluster / Kategori
                    </label>
                    <select
                      value={columnMapping.content_cluster}
                      onChange={(e) => setColumnMapping({ ...columnMapping, content_cluster: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="">-- (Opsional) --</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>

                  {/* Journey Stage */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Journey / Funnel (TOFU/MOFU/BOFU)
                    </label>
                    <select
                      value={columnMapping.journey_stage}
                      onChange={(e) => setColumnMapping({ ...columnMapping, journey_stage: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="">-- (Opsional) --</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>

                  {/* Target CTA */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Target CTA Konversi
                    </label>
                    <select
                      value={columnMapping.cta}
                      onChange={(e) => setColumnMapping({ ...columnMapping, cta: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="">-- (Opsional) --</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Import Mode Option */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-850">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Mode Penyimpanan:
                </label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-6">
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'REPLACE'}
                      onChange={() => setImportMode('REPLACE')}
                      className="text-blue-600"
                    />
                    <span className="font-semibold">Gantikan Kalender Saat Ini (Replace)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'APPEND'}
                      onChange={() => setImportMode('APPEND')}
                      className="text-blue-600"
                    />
                    <span>Tambahkan ke Kalender (Append)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW & VALIDATION (PRD Section 66) */}
          {step === 'VALIDATION' && validationResult && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-850">
                  <span className="block text-xl font-extrabold text-slate-900 dark:text-white">
                    {validationResult.stats.total}
                  </span>
                  <span className="text-[10px] text-slate-500">Total Baris</span>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900 dark:bg-emerald-950/40">
                  <span className="block text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {validationResult.stats.valid}
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300">Valid</span>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900 dark:bg-amber-950/40">
                  <span className="block text-xl font-extrabold text-amber-600 dark:text-amber-400">
                    {validationResult.stats.warning}
                  </span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-300">Warning</span>
                </div>

                <div className="rounded-xl border border-red-200 bg-red-50/60 p-3 dark:border-red-900 dark:bg-red-950/40">
                  <span className="block text-xl font-extrabold text-red-600 dark:text-red-400">
                    {validationResult.stats.error}
                  </span>
                  <span className="text-[10px] text-red-700 dark:text-red-300">Error</span>
                </div>
              </div>

              {/* Validation Summary */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                <p className="font-bold">
                  {importMode === 'REPLACE'
                    ? `Kalender lama akan digantikan dengan ${validationResult.articles.length} artikel baru dari sheet "${selectedSheet}".`
                    : `${validationResult.articles.length} artikel baru akan ditambahkan ke kalender project saat ini.`}
                </p>
              </div>

              {/* Validation Rows List */}
              <div className="max-h-56 space-y-2 overflow-y-auto rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                {validationResult.validationLogs.slice(0, 30).map((log: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-850/50"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {log.status === 'VALID' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                      {log.status === 'WARNING' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      {log.status === 'ERROR' && <XCircle className="h-4 w-4 text-red-500" />}
                      <span className="font-semibold text-slate-800 truncate dark:text-slate-200">{log.title}</span>
                    </div>

                    <span className="text-[10px] text-slate-400 flex-shrink-0">
                      Baris #{log.row}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 p-5 dark:border-slate-800">
          {step !== 'UPLOAD' ? (
            <button
              type="button"
              onClick={() => setStep(step === 'VALIDATION' ? 'SHEET_AND_MAPPING' : 'UPLOAD')}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Kembali
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Batal
            </button>

            {step === 'SHEET_AND_MAPPING' && (
              <button
                type="button"
                onClick={handleProceedToValidation}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                <span>Validasi Data</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            {step === 'VALIDATION' && (
              <button
                type="button"
                onClick={handleFinalImport}
                disabled={validationResult?.articles.length === 0}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Import {validationResult?.articles.length || 0} Content Items</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
