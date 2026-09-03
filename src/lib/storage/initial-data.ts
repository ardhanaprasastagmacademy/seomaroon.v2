import type { Project, ContentArticle } from '@/types';
import { INITIAL_PROMPT_TEMPLATES } from '../prompt-engine/template-library';

export const INITIAL_PROJECT: Project = {
  id: 'prj-default-01',
  name: 'Perlengkapan Kantor B2B Jakarta',
  website_url: 'https://perlengkapankantor.co.id',
  business_name: 'PT Mahakarya Mitra Perkantoran',
  industry: 'Office Furniture & Commercial Supplies',
  description: 'Distributor resmi perlengkapan & furniture kantor B2B terkemuka dengan pengadaan langsung ke seluruh Indonesia.',
  primary_location: 'Jakarta & Jabodetabek',
  default_language: 'Bahasa Indonesia (Formal & Informatif)',
  default_tone: 'Profesional, Otoritatif, Ramah, dan Berorientasi Solusi Bisnis',
  default_cta: 'Konsultasi Kebutuhan & Dapatkan Penawaran Harga B2B via WhatsApp (0812-3456-7890)',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// 90 comprehensive articles representing a full 30-Day SEO Content Calendar
const CLUSTERS = [
  'Kursi Kantor Ergonomis',
  'Meja Kantor & Standing Desk',
  'Penyimpanan & Lemari Arsip',
  'Peralatan & Paper Shredder',
  'Partisi & Sekat Akrilik',
  'Brankas Kantor Digital',
  'Paket Pengadaan B2B',
  'ATK & Kebutuhan Kearsipan'
];

const RAW_ARTICLES: Array<{
  day: string;
  time_slot: string;
  cluster: string;
  title: string;
  keyword: string;
  lsi: string;
  sv: string;
  competition: string;
  journey: 'TOFU' | 'MOFU' | 'BOFU';
  format: string;
  cta: string;
  slug: string;
  status: 'Published' | 'Draft' | 'Ready' | 'Generated';
}> = [
  {
    day: 'Hari 01',
    time_slot: '09:00',
    cluster: 'Kursi Kantor Ergonomis',
    title: '10 Kursi Kantor Ergonomis Terbaik untuk Sakit Pinggang [2026]',
    keyword: 'kursi ergonomis terbaik',
    lsi: 'kursi jaring ergonomis, harga kursi kerja sehat, kursi lumbar support terbaik',
    sv: '> 5,000',
    competition: 'Menengah',
    journey: 'TOFU',
    format: 'Featured Snippet + Table + AEO FAQ',
    cta: 'Konsultasi Kursi Ergonomi via WhatsApp',
    slug: '/blog/10-kursi-kantor-ergonomis-terbaik',
    status: 'Published',
  },
  {
    day: 'Hari 01',
    time_slot: '13:00',
    cluster: 'Peralatan & Paper Shredder',
    title: 'Panduan Memilih Mesin Penghancur Kertas (Paper Shredder) Heavy Duty',
    keyword: 'mesin penghancur kertas heavy duty',
    lsi: 'paper shredder cross cut, harga penghancur kertas kantor',
    sv: '> 2,500',
    competition: 'Rendah',
    journey: 'MOFU',
    format: 'Buying Guide + Checklist PDF',
    cta: 'Download Brosur Katalog Peralatan Kantor',
    slug: '/blog/panduan-memilih-mesin-penghancur-kertas',
    status: 'Published',
  },
  {
    day: 'Hari 01',
    time_slot: '16:00',
    cluster: 'Paket Pengadaan B2B',
    title: 'Paket Hemat Meja dan Kursi Kantor untuk Startup & Coworking Space',
    keyword: 'paket meja kursi kantor murah',
    lsi: 'pengadaan furniture kantor b2b, supplier meja kursi kantor jakarta',
    sv: '> 1,800',
    competition: 'Tinggi',
    journey: 'BOFU',
    format: 'Pricelist + Offer Box',
    cta: 'Minta Penawaran Harga B2B Khusus',
    slug: '/blog/paket-hemat-meja-kursi-kantor',
    status: 'Published',
  },
  {
    day: 'Hari 02',
    time_slot: '09:00',
    cluster: 'Meja Kantor & Standing Desk',
    title: 'Review Standing Desk Elektrik Terbaik untuk Ruang Kerja Modern',
    keyword: 'standing desk elektrik terbaik',
    lsi: 'meja kerja hidrolik, adjustable standing desk indonesia',
    sv: '> 3,200',
    competition: 'Menengah',
    journey: 'MOFU',
    format: 'Review + Spesifikasi + Video Snippet',
    cta: 'Cek Promo Standing Desk Hari Ini',
    slug: '/blog/review-standing-desk-elektrik-terbaik',
    status: 'Published',
  },
  {
    day: 'Hari 02',
    time_slot: '13:00',
    cluster: 'Penyimpanan & Lemari Arsip',
    title: '7 Merk Lemari Arsip Besi Anti Karat & Tahan Api Terbaik',
    keyword: 'lemari arsip besi tahan api',
    lsi: 'filling cabinet besi murah, lemari dokumen kantor anti rayap',
    sv: '> 2,100',
    competition: 'Rendah',
    journey: 'TOFU',
    format: 'Listicle + Infografis Perbandingan',
    cta: 'Lihat Katalog Lengkap Lemari Arsip',
    slug: '/blog/lemari-arsip-besi-tahan-api',
    status: 'Published',
  },
  {
    day: 'Hari 02',
    time_slot: '16:00',
    cluster: 'Partisi & Sekat Akrilik',
    title: 'Jasa Pemasangan Partisi Kantor Sekat Akrilik & Kaca Minimalis Jakarta',
    keyword: 'jasa partisi kantor jakarta',
    lsi: 'sekat meja kerja kantor, partisi kubikal murah terpasang',
    sv: '> 4,000',
    competition: 'Tinggi',
    journey: 'BOFU',
    format: 'Landing Page Service + Portofolio',
    cta: 'Booking Jadwal Survey Lokasi Gratis',
    slug: '/blog/jasa-partisi-kantor-jakarta',
    status: 'Published',
  },
  {
    day: 'Hari 03',
    time_slot: '09:00',
    cluster: 'Kursi Kantor Ergonomis',
    title: 'Kursi Manager vs Kursi Direktur: Apa Saja Perbedaan dan Rekomendasinya?',
    keyword: 'perbedaan kursi manager dan direktur',
    lsi: 'kursi direktur mewah kulit, kursi kerja manager ergonomis',
    sv: '> 1,500',
    competition: 'Rendah',
    journey: 'MOFU',
    format: 'VS Comparison Table + Guide',
    cta: 'Pilih Koleksi Kursi Eksekutif Kami',
    slug: '/blog/perbedaan-kursi-manager-dan-direktur',
    status: 'Ready',
  },
  {
    day: 'Hari 03',
    time_slot: '13:00',
    cluster: 'Brankas Kantor Digital',
    title: 'Daftar Harga Brankas Kantor Digital Tahan Bongkar & Sertifikasi Internasional',
    keyword: 'harga brankas kantor digital',
    lsi: 'brankas uang kantor terbaik, safe box digital tahan api',
    sv: '> 2,800',
    competition: 'Menengah',
    journey: 'BOFU',
    format: 'Pricelist + Product Breakdown',
    cta: 'Dapatkan Diskon Pengadaan Brankas',
    slug: '/blog/harga-brankas-kantor-digital',
    status: 'Ready',
  },
  {
    day: 'Hari 03',
    time_slot: '16:00',
    cluster: 'ATK & Kebutuhan Kearsipan',
    title: 'Kertas HVS PaperOne vs Sinar Dunia (SiDU): Mana yang Lebih Hemat untuk Kantor?',
    keyword: 'kertas hvs paperone vs sidu',
    lsi: 'kertas f4 70gr grosir, kertas a4 80gr murah kantor',
    sv: '> 3,900',
    competition: 'Rendah',
    journey: 'TOFU',
    format: 'Comparison Analysis + Test Cetak',
    cta: 'Pesan Kertas Grosir Volume Besar',
    slug: '/blog/kertas-hvs-paperone-vs-sinar-dunia',
    status: 'Draft',
  }
];

// Generate full 90 articles across 30 days
export const INITIAL_CONTENT_CALENDAR: ContentArticle[] = [];

for (let d = 1; d <= 30; d++) {
  const dayStr = `Hari ${String(d).padStart(2, '0')}`;
  
  for (let slot = 1; slot <= 3; slot++) {
    const idx = (d - 1) * 3 + (slot - 1);
    const existingRaw = RAW_ARTICLES[idx % RAW_ARTICLES.length];
    const time = slot === 1 ? '09:00' : slot === 2 ? '13:00' : '16:00';
    const cluster = CLUSTERS[(d + slot) % CLUSTERS.length] || 'Kursi Kantor Ergonomis';
    const journey: 'TOFU' | 'MOFU' | 'BOFU' = slot === 1 ? 'TOFU' : slot === 2 ? 'MOFU' : 'BOFU';
    
    let title = existingRaw?.title || `Panduan Strategis ${cluster} Edisi Hari ${d} Slot ${slot}`;
    let keyword = existingRaw?.keyword || `${cluster.toLowerCase()} edisi ${d}`;
    let slug = `/blog/${keyword.replace(/[^a-zA-Z0-9]/g, '-').replace(/--+/g, '-')}`;

    if (idx >= RAW_ARTICLES.length) {
      if (journey === 'TOFU') {
        title = `Tips & Cara Memilih ${cluster} Sesuai Standar Kesehatan Kerja Modern [Hari ${d}]`;
        keyword = `tips memilih ${cluster.toLowerCase()} kantor`;
      } else if (journey === 'MOFU') {
        title = `5 Rekomendasi Merk ${cluster} Paling Awet & Berkualitas Tinggi [Hari ${d}]`;
        keyword = `rekomendasi ${cluster.toLowerCase()} terbaik`;
      } else {
        title = `Supplier & Distributor Resmi ${cluster} B2B Termurah di Jakarta [Hari ${d}]`;
        keyword = `supplier ${cluster.toLowerCase()} b2b jakarta`;
      }
      slug = `/blog/${keyword.replace(/[^a-zA-Z0-9]/g, '-').replace(/--+/g, '-')}`;
    }

    INITIAL_CONTENT_CALENDAR.push({
      id: `art-${String(idx + 1).padStart(3, '0')}`,
      project_id: INITIAL_PROJECT.id,
      day: dayStr,
      time_slot: time,
      content_cluster: cluster,
      title: title,
      primary_keyword: keyword,
      secondary_keywords: `${keyword} murah, spesifikasi ${cluster.toLowerCase()}, distributor ${cluster.toLowerCase()} indonesia`,
      search_volume: slot === 1 ? '> 4,500' : slot === 2 ? '> 2,800' : '> 1,900',
      competition: slot === 1 ? 'Menengah' : slot === 2 ? 'Rendah' : 'Tinggi',
      journey_stage: journey,
      content_format: slot === 1 ? 'Featured Snippet + Table + FAQ' : slot === 2 ? 'Buying Guide + Checklist' : 'Commercial Landing + WA CTA',
      cta: slot === 3 ? 'Minta Penawaran Harga B2B (Respon 15 Menit)' : 'Konsultasi Gratis Tata Ruang & Furniture via WhatsApp',
      slug,
      status: idx < 15 ? 'Published' : idx < 30 ? 'Ready' : idx < 50 ? 'Generated' : 'Draft',
      created_at: new Date(Date.now() - (30 - d) * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
}

export { INITIAL_PROMPT_TEMPLATES };
