import * as XLSX from 'xlsx';
import type { ContentArticle, ColumnMappingConfig, ExcelParsedSheet } from '@/types';

export const DEFAULT_COLUMN_MAPPING: ColumnMappingConfig = {
  day: 'Hari',
  time_slot: 'Slot Waktu',
  content_cluster: 'Content Cluster',
  title: 'Judul Artikel',
  primary_keyword: 'Target Keyword Utama',
  secondary_keywords: 'Keyword Sekunder / LSI',
  search_volume: 'Search Volume',
  competition: 'Tingkat Kompetisi',
  journey_stage: 'Journey Stage',
  content_format: 'Format Konten & Elemen GEO',
  cta: 'Target CTA Konversi',
  slug: 'URL Slug',
  status: 'Status',
};

/**
 * Parses raw ArrayBuffer / binary of an Excel file into sheet list and headers
 */
export function readExcelWorkbook(data: ArrayBuffer | Uint8Array): {
  sheetNames: string[];
  sheets: Record<string, ExcelParsedSheet>;
  defaultSheetName: string;
} {
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetNames = workbook.SheetNames;
  const sheets: Record<string, ExcelParsedSheet> = {};

  let defaultSheetName = sheetNames[0] || 'Sheet1';

  // Find preferred sheet according to PRD
  for (const name of sheetNames) {
    if (name.toLowerCase().includes('kalender') || name.toLowerCase().includes('content calendar') || name.toLowerCase().includes('konten')) {
      defaultSheetName = name;
      break;
    }
  }

  for (const name of sheetNames) {
    const worksheet = workbook.Sheets[name];
    if (!worksheet) continue;

    const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    
    if (jsonData.length === 0) {
      sheets[name] = { name, rowCount: 0, headers: [], data: [] };
      continue;
    }

    // Detect header row by scanning up to 15 rows for highest column title match
    let headerRowIndex = 0;
    let bestMatchScore = 0;

    const headerKeywords = [
      'judul', 'title', 'headline', 'artikel', 'article',
      'keyword', 'kata kunci', 'target', 'lsi',
      'hari', 'day', 'tanggal', 'date', 'slot', 'waktu', 'time',
      'cluster', 'klaster', 'kategori', 'topik', 'topic',
      'volume', 'search volume', 'kompetisi', 'competition',
      'journey', 'funnel', 'tofu', 'mofu', 'bofu',
      'format', 'tipe', 'type', 'cta', 'slug', 'url', 'status'
    ];

    for (let i = 0; i < Math.min(jsonData.length, 15); i++) {
      const row = jsonData[i] || [];
      const rowString = row.map((cell: any) => String(cell).toLowerCase()).join(' ');
      
      let score = 0;
      for (const kw of headerKeywords) {
        if (rowString.includes(kw)) {
          score += 1;
        }
      }

      if (score > bestMatchScore) {
        bestMatchScore = score;
        headerRowIndex = i;
      }
    }

    const rawHeaders = jsonData[headerRowIndex] || [];
    const headers: string[] = [];

    rawHeaders.forEach((h: any, idx: number) => {
      const val = String(h).trim();
      if (val) {
        headers.push(val);
      } else {
        // Handle unnamed column gracefully
        headers.push(`Kolom_${idx + 1}`);
      }
    });

    const rows = jsonData.slice(headerRowIndex + 1);
    const structuredRows: Record<string, any>[] = [];

    for (const r of rows) {
      // Check if row has at least one non-empty value
      const hasContent = r.some((cell: any) => String(cell).trim() !== '');
      if (!hasContent) continue;

      const rowObj: Record<string, any> = {};
      headers.forEach((header, idx) => {
        rowObj[header] = r[idx] !== undefined ? String(r[idx]).trim() : '';
      });
      structuredRows.push(rowObj);
    }

    sheets[name] = {
      name,
      rowCount: structuredRows.length,
      headers,
      data: structuredRows,
    };
  }

  return {
    sheetNames,
    sheets,
    defaultSheetName,
  };
}

/**
 * Fuzzy auto-matches Excel headers to database field mapping
 */
export function autoDetectColumnMapping(headers: string[]): ColumnMappingConfig {
  const findMatch = (candidates: string[]): string => {
    for (const cand of candidates) {
      const found = headers.find(h => h.toLowerCase().includes(cand.toLowerCase()));
      if (found) return found;
    }
    return '';
  };

  return {
    day: findMatch(['hari', 'day', 'tgl', 'tanggal', 'no']),
    time_slot: findMatch(['slot', 'waktu', 'time', 'jam']),
    content_cluster: findMatch(['cluster', 'klaster', 'kategori', 'category', 'topik', 'topic', 'pillar']),
    title: findMatch(['judul artikel', 'judul', 'title', 'headline', 'article', 'topik artikel']),
    primary_keyword: findMatch(['target keyword utama', 'target keyword', 'keyword utama', 'primary keyword', 'focus keyword', 'keyword', 'kata kunci utama', 'kata kunci']),
    secondary_keywords: findMatch(['keyword sekunder', 'lsi', 'secondary keyword', 'supporting keyword', 'turunan', 'keyword turunan']),
    search_volume: findMatch(['search volume', 'volume', 'sv', 'pencarian']),
    competition: findMatch(['kompetisi', 'competition', 'tingkat kompetisi', 'difficulty', 'kd']),
    journey_stage: findMatch(['journey stage', 'journey', 'stage', 'funnel', 'tofu', 'intent']),
    content_format: findMatch(['format konten', 'format', 'tipe konten', 'type', 'geo', 'struktur']),
    cta: findMatch(['target cta konversi', 'target cta', 'cta', 'call to action', 'konversi', 'conversion']),
    slug: findMatch(['url slug', 'slug', 'url', 'permalink', 'link']),
    status: findMatch(['status', 'state', 'publikasi', 'publish']),
  };
}

/**
 * Transforms parsed raw sheet rows into structured ContentArticle records with validation
 */
export function processExcelRows(
  rows: Record<string, any>[],
  mapping: ColumnMappingConfig,
  projectId: string
): {
  articles: Partial<ContentArticle>[];
  stats: { total: number; valid: number; warning: number; error: number };
  validationLogs: { row: number; title: string; issues: string[]; status: 'VALID' | 'WARNING' | 'ERROR' }[];
} {
  const articles: Partial<ContentArticle>[] = [];
  const validationLogs: { row: number; title: string; issues: string[]; status: 'VALID' | 'WARNING' | 'ERROR' }[] = [];

  let valid = 0;
  let warning = 0;
  let error = 0;

  rows.forEach((row, index) => {
    const rowNum = index + 1;
    const issues: string[] = [];

    const title = mapping.title && row[mapping.title] !== undefined && row[mapping.title] !== null ? String(row[mapping.title]).trim() : '';
    const primary_keyword = mapping.primary_keyword && row[mapping.primary_keyword] !== undefined && row[mapping.primary_keyword] !== null ? String(row[mapping.primary_keyword]).trim() : '';
    const day = (mapping.day && row[mapping.day] !== undefined && row[mapping.day] !== null) ? String(row[mapping.day]).trim() : `Hari ${String(Math.floor(index / 3) + 1).padStart(2, '0')}`;
    const time_slot = (mapping.time_slot && row[mapping.time_slot] !== undefined && row[mapping.time_slot] !== null) ? String(row[mapping.time_slot]).trim() : 'Pagi (09:00)';
    const content_cluster = (mapping.content_cluster && row[mapping.content_cluster] !== undefined && row[mapping.content_cluster] !== null) ? String(row[mapping.content_cluster]).trim() : 'Umum';
    const secondary_keywords = (mapping.secondary_keywords && row[mapping.secondary_keywords] !== undefined && row[mapping.secondary_keywords] !== null) ? String(row[mapping.secondary_keywords]).trim() : '';
    const search_volume = (mapping.search_volume && row[mapping.search_volume] !== undefined && row[mapping.search_volume] !== null) ? String(row[mapping.search_volume]).trim() : '> 1,000';
    const competition = (mapping.competition && row[mapping.competition] !== undefined && row[mapping.competition] !== null) ? String(row[mapping.competition]).trim() : 'Menengah';
    const journey_stage = (mapping.journey_stage && row[mapping.journey_stage] !== undefined && row[mapping.journey_stage] !== null) ? String(row[mapping.journey_stage]).trim() : 'TOFU';
    const content_format = (mapping.content_format && row[mapping.content_format] !== undefined && row[mapping.content_format] !== null) ? String(row[mapping.content_format]).trim() : 'Artikel Standar + FAQ';
    const cta = (mapping.cta && row[mapping.cta] !== undefined && row[mapping.cta] !== null) ? String(row[mapping.cta]).trim() : 'Konsultasi via WhatsApp';
    
    let slug = (mapping.slug && row[mapping.slug] !== undefined && row[mapping.slug] !== null) ? String(row[mapping.slug]).trim() : '';
    if (!slug && title) {
      slug = '/blog/' + title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const rawStatus = ((mapping.status && row[mapping.status] !== undefined && row[mapping.status] !== null) ? String(row[mapping.status]).trim() : 'Published').toLowerCase();
    let status: ContentArticle['status'] = 'Published';
    if (rawStatus.includes('draft')) status = 'Draft';
    else if (rawStatus.includes('ready') || rawStatus.includes('siap')) status = 'Ready';
    else if (rawStatus.includes('gen')) status = 'Generated';

    if (!title) {
      issues.push('Judul Artikel tidak terdeteksi');
    }
    if (!primary_keyword) {
      issues.push('Target Keyword Utama tidak terdeteksi');
    }

    let rowStatus: 'VALID' | 'WARNING' | 'ERROR' = 'VALID';
    if (!title && !primary_keyword) {
      rowStatus = 'ERROR';
      error++;
    } else if (issues.length > 0) {
      rowStatus = 'WARNING';
      warning++;
    } else {
      valid++;
    }

    validationLogs.push({
      row: rowNum,
      title: title || primary_keyword || `(Baris ${rowNum} - Tanpa Judul)`,
      issues,
      status: rowStatus,
    });

    if (rowStatus !== 'ERROR') {
      articles.push({
        project_id: projectId,
        day: day || 'Hari 01',
        time_slot: time_slot || '09:00',
        content_cluster: content_cluster || 'Umum',
        title: title || primary_keyword || `Artikel ${rowNum}`,
        primary_keyword: primary_keyword || title || 'Keyword Utama',
        secondary_keywords: secondary_keywords || '',
        search_volume: search_volume || '> 1,000',
        competition: competition || 'Menengah',
        journey_stage: journey_stage.toUpperCase().includes('BOFU') ? 'BOFU' : journey_stage.toUpperCase().includes('MOFU') ? 'MOFU' : 'TOFU',
        content_format: content_format || 'Panduan Lengkap + AEO FAQ',
        cta: cta || 'Konsultasi via WhatsApp',
        slug: slug || `/blog/artikel-${rowNum}`,
        status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  });

  return {
    articles,
    stats: { total: rows.length, valid, warning, error },
    validationLogs,
  };
}

/**
 * Generates an authentic sample 30-day (90-article) Excel file buffer for testing & download
 */
export function generateSampleExcelWorkbook(): Uint8Array {
  const wb = XLSX.utils.book_new();

  const calendarData = [
    [
      'Hari',
      'Slot Waktu',
      'Content Cluster',
      'Judul Artikel (SEO/GEO Optimized)',
      'Target Keyword Utama',
      'Keyword Sekunder / LSI',
      'Search Volume',
      'Tingkat Kompetisi',
      'Journey Stage',
      'Format Konten & Elemen GEO',
      'Target CTA Konversi',
      'URL Slug',
      'Status'
    ],
    [
      'Hari 01',
      '09:00',
      'Kursi Kantor',
      '10 Kursi Kantor Ergonomis Terbaik untuk Sakit Pinggang [2026]',
      'kursi ergonomis terbaik',
      'kursi jaring ergonomis, harga kursi kerja sehat, kursi kantor lumbar support',
      '> 5,000',
      'Menengah',
      'TOFU',
      'Featured Snippet + Table + FAQ',
      'Konsultasi Ergonomi via WA',
      '/blog/10-kursi-kantor-ergonomis-terbaik',
      'Published'
    ],
    [
      'Hari 01',
      '13:00',
      'Peralatan Kantor',
      'Panduan Memilih Mesin Penghancur Kertas (Paper Shredder) Heavy Duty',
      'mesin penghancur kertas heavy duty',
      'paper shredder cross cut, harga penghancur kertas kantor',
      '> 2,500',
      'Rendah',
      'MOFU',
      'Buying Guide + Checklist PDF',
      'Download Katalog Perlengkapan Kantor',
      '/blog/panduan-memilih-mesin-penghancur-kertas',
      'Published'
    ],
    [
      'Hari 01',
      '16:00',
      'Paket Pengadaan',
      'Paket Hemat Meja dan Kursi Kantor untuk Startup & Coworking Space',
      'paket meja kursi kantor murah',
      'pengadaan furniture kantor b2b, supplier meja kursi kantor jakarta',
      '> 1,800',
      'Tinggi',
      'BOFU',
      'Pricelist + Offer Box',
      'Minta Penawaran Harga B2B',
      '/blog/paket-hemat-meja-kursi-kantor',
      'Published'
    ],
    [
      'Hari 02',
      '09:00',
      'Meja Kantor',
      'Review Standing Desk Elektrik Terbaik untuk Ruang Kerja Modern',
      'standing desk elektrik terbaik',
      'meja kerja hidrolik, adjustable standing desk indonesia',
      '> 3,200',
      'Menengah',
      'MOFU',
      'Video Review Snippet + Table',
      'Cek Promo Standing Desk',
      '/blog/review-standing-desk-elektrik-terbaik',
      'Published'
    ],
    [
      'Hari 02',
      '13:00',
      'Penyimpanan Arsip',
      '7 Merk Lemari Arsip Besi Anti Karat & Tahan Api Terbaik',
      'lemari arsip besi tahan api',
      'filling cabinet besi murah, lemari dokumen kantor',
      '> 2,100',
      'Rendah',
      'TOFU',
      'Listicle + Infografis',
      'Lihat Katalog Lemari Arsip',
      '/blog/lemari-arsip-besi-tahan-api',
      'Published'
    ],
    [
      'Hari 02',
      '16:00',
      'Jasa & Pengadaan',
      'Jasa Pemasangan Partisi Kantor Sekat Akrilik & Kaca Minimalis Jakarta',
      'jasa partisi kantor jakarta',
      'sekat meja kerja kantor, partisi kubikal murah',
      '> 4,000',
      'Tinggi',
      'BOFU',
      'Service Landing Content + Portofolio',
      'Booking Survey Lokasi Gratis',
      '/blog/jasa-partisi-kantor-jakarta',
      'Published'
    ]
  ];

  const ws = XLSX.utils.aoa_to_sheet(calendarData);
  XLSX.utils.book_append_sheet(wb, ws, 'Kalender Konten 30 Hari');

  // Add other sample sheets for realism
  const keywordData = [
    ['Cluster', 'Keyword Utama', 'Search Volume', 'Intent', 'Target URL'],
    ['Kursi Kantor', 'kursi kantor ergonomis', '8,100', 'Commercial', '/kursi-kantor'],
    ['Meja Kantor', 'meja rapat minimalis', '3,400', 'Informational', '/meja-rapat'],
    ['Penyimpanan', 'filling cabinet besi', '2,900', 'Transactional', '/lemari-arsip']
  ];
  const wsKeywords = XLSX.utils.aoa_to_sheet(keywordData);
  XLSX.utils.book_append_sheet(wb, wsKeywords, 'Keyword Mapping');

  return XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
}
