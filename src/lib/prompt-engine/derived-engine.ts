import type { ContentArticle, Project } from '@/types';

export interface DerivedFieldsResult {
  search_intent?: string;
  query_fan_out?: string;
  target_audience?: string;
  main_questions?: string;
  outline_structure?: string;
  schema_markup?: string;
  internal_links?: string;
  content_gaps?: string;
  comparison_factors?: string;
  service_areas?: string;
  local_benefits?: string;
  buying_criteria?: string;
  budget_options?: string;
  value_propositions?: string;
  objections_handling?: string;
  entity_nodes?: string;
  item_a_name?: string;
  item_b_name?: string;
}

/**
 * Derives Search Intent based on Keyword tokens, Title, and Journey Stage
 */
export function deriveSearchIntent(keyword: string, title: string, journeyStage?: string): string {
  const text = `${keyword} ${title}`.toLowerCase();
  
  if (journeyStage === 'BOFU' || text.includes('harga') || text.includes('beli') || text.includes('jual') || text.includes('pesan') || text.includes('promo') || text.includes('supplier') || text.includes('distributor') || text.includes('jasa')) {
    return 'Transactional / Commercial High-Intent';
  }
  
  if (journeyStage === 'MOFU' || text.includes('rekomendasi') || text.includes('terbaik') || text.includes('review') || text.includes('vs') || text.includes('perbandingan') || text.includes('paket') || text.includes('merk')) {
    return 'Commercial Investigation';
  }
  
  if (text.includes('cara') || text.includes('panduan') || text.includes('tips') || text.includes('apa itu') || text.includes('kenapa') || text.includes('manfaat') || text.includes('pengertian') || journeyStage === 'TOFU') {
    return 'Informational';
  }
  
  return 'Informational / Commercial Investigation';
}

/**
 * Generates at least 5 semantic Query Fan-Out questions for AEO/GEO optimization
 */
export function generateQueryFanOut(keyword: string, title: string): string {
  const cleanKeyword = keyword || 'produk atau layanan ini';
  
  return [
    `1. Apa saja ${cleanKeyword} terbaik dan paling direkomendasikan saat ini?`,
    `2. Bagaimana cara memilih ${cleanKeyword} yang berkualitas sesuai kebutuhan?`,
    `3. Berapa estimasi kisaran harga atau biaya pengadaan ${cleanKeyword}?`,
    `4. Apa saja kelebihan, kekurangan, dan fitur wajib yang perlu diperhatikan pada ${cleanKeyword}?`,
    `5. Apa kesalahan umum yang sering terjadi saat membeli atau menggunakan ${cleanKeyword}?`,
    `6. Di mana supplier atau tempat penyedia ${cleanKeyword} terpercaya bergaransi resmi?`
  ].join('\n');
}

/**
 * Infers Target Audience based on Industry, Cluster, and Journey Stage
 */
export function deriveTargetAudience(article: Partial<ContentArticle>, project?: Partial<Project>): string {
  const industry = project?.industry || 'Bisnis & Perkantoran';
  const cluster = article.content_cluster || 'Umum';
  const journey = article.journey_stage || 'TOFU';

  if (journey === 'BOFU') {
    return `Pengambil keputusan (Decision Makers), Manajer Pengadaan/Procurement, HR & Facility Manager, atau Pemilik Bisnis (${industry}) yang membutuhkan solusi langsung, efisiensi anggaran, dan transaksi cepat.`;
  }
  
  if (journey === 'MOFU') {
    return `Profesional, Tim Operasional Kantor, atau Konsumen Cerdas yang sedang membandingkan merk, spesifikasi teknis, harga, dan keunggulan produk kategori ${cluster}.`;
  }

  return `Pekerja profesional, manajer operasional, pemilik usaha baru, atau individu yang mencari wawasan, edukasi panduan, dan tips seputar ${cluster} di industri ${industry}.`;
}

/**
 * Generates structured H1-H3 Outline tailored to article title, keyword, and format
 */
export function generateOutlineStructure(article: Partial<ContentArticle>): string {
  const title = article.title || 'Panduan Lengkap';
  const keyword = article.primary_keyword || 'Topik Utama';
  const isListicle = title.match(/^\d+/);
  const isComparison = title.toLowerCase().includes('vs') || title.toLowerCase().includes('perbandingan');

  if (isComparison) {
    return `# ${title}

## 1. Ringkasan Cepat: Memahami Perbedaan Utama
- Snapshot perbandingan cepat untuk pengambilan keputusan instan.

## 2. Mengenal Karakteristik Masing-Masing Solusi
### 2.1 Analisis Mendalam: Opsi Pertama (Fitur & Keunggulan)
### 2.2 Analisis Mendalam: Opsi Kedua (Fitur & Keunggulan)

## 3. Komparasi Head-to-Head Berdasarkan Parameter Penting
### 3.1 Kualitas Material & Daya Tahan
### 3.2 Efisiensi Biaya & Value for Money
### 3.3 Kemudahan Penggunaan & Perawatan

## 4. Rekomendasi Skenario: Kapan Anda Harus Memilih Opsi A vs Opsi B?

## 5. Kesimpulan & Penawaran Terbaik

## 6. FAQ (Pertanyaan yang Sering Diajukan Seputar ${keyword})`;
  }

  if (isListicle) {
    return `# ${title}

## 1. Mengapa Memilih ${keyword} yang Tepat Sangat Krusial?
- Poin penting dampak pemilihan terhadap efisiensi dan kenyamanan kerja.

## 2. Kriteria Utama Evaluasi dan Standar Kualitas
- Parameter kenyamanan, sertifikasi, material, dan garansi resmi.

## 3. Rekomendasi Teratas ${keyword} Pilihan
### 3.1 Opsi Premium: Fitur Terlengkap dan Ergonomi Maksimal
### 3.2 Opsi Best Value: Keseimbangan Harga dan Performa
### 3.3 Opsi Budget Friendly: Pilihan Ekonomis Berkualitas Tinggi

## 4. Tabel Perbandingan Spesifikasi dan Rentang Harga

## 5. Panduan Praktis Perawatan dan Tips Penggunaan Jangka Panjang

## 6. Kesimpulan & Cara Mendapatkan Penawaran Khusus

## 7. FAQ Seputar ${keyword} (AEO & GEO Snippets)`;
  }

  return `# ${title}

## 1. Pendahuluan: Memahami Konsep Inti ${keyword}
- Definisi ringkas dan mengapa hal ini penting untuk kebutuhan modern.

## 2. Faktor Utama yang Wajib Dipertimbangkan
### 2.1 Aspek Standar Kualitas dan Keamanan
### 2.2 Efisiensi Finansial dan Nilai Investasi Jangka Panjang

## 3. Langkah Praktis dan Solusi Penerapan Terbaik
### 3.1 Tahap Perencanaan dan Penentuan Kebutuhan
### 3.2 Tahap Eksekusi dan Pemilihan Partner Terpercaya

## 4. Tips Ahli untuk Menghindari Kesalahan Umum

## 5. Kesimpulan dan Call to Action

## 6. FAQ Seputar ${keyword}`;
}

/**
 * Recommends valid Schema.org types based on Content Format & Article metadata
 */
export function recommendSchemas(article: Partial<ContentArticle>): string {
  const format = (article.content_format || '').toLowerCase();
  const journey = article.journey_stage || 'TOFU';
  const title = (article.title || '').toLowerCase();

  const schemas = ['Article', 'BreadcrumbList', 'Organization'];

  if (format.includes('faq') || title.includes('panduan') || title.includes('terbaik') || true) {
    schemas.push('FAQPage');
  }

  if (format.includes('how-to') || title.includes('cara') || title.includes('panduan')) {
    schemas.push('HowTo');
  }

  if (journey === 'BOFU' || format.includes('katalog') || title.includes('harga') || title.includes('paket')) {
    schemas.push('Product / Offer');
  }

  return schemas.join(', ');
}

/**
 * Suggests Internal Links based on cluster and slug
 */
export function suggestInternalLinks(article: Partial<ContentArticle>): string {
  const cluster = article.content_cluster || 'Utama';
  const cleanCluster = cluster.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return [
    `1. /${cleanCluster}/panduan-lengkap (Pillar Hub Cluster ${cluster})`,
    `2. /katalog/${cleanCluster}-terbaru (Halaman Produk / Layanan Terkait)`,
    `3. /kontak?ref=${article.slug || 'artikel'} (Halaman Konsultasi & Pemesanan Langsung)`
  ].join('\n');
}

/**
 * Master generator combining all derived fields
 */
export function generateDerivedFields(
  article: Partial<ContentArticle>,
  project?: Partial<Project>
): DerivedFieldsResult {
  const keyword = article.primary_keyword || '';
  const title = article.title || '';
  const journey = article.journey_stage;

  const search_intent = deriveSearchIntent(keyword, title, journey);
  const query_fan_out = generateQueryFanOut(keyword, title);
  const target_audience = deriveTargetAudience(article, project);
  const main_questions = `Apa pertimbangan utama dalam memilih ${keyword} dan bagaimana mendapatkan solusi terbaik dengan harga kompetitif?`;
  const outline_structure = generateOutlineStructure(article);
  const schema_markup = recommendSchemas(article);
  const internal_links = suggestInternalLinks(article);

  // For VS / Comparison
  let item_a_name = 'Opsi Model A';
  let item_b_name = 'Opsi Model B';
  if (title.toLowerCase().includes(' vs ')) {
    const parts = title.split(/ vs /i);
    if (parts.length >= 2) {
      item_a_name = parts[0].trim();
      item_b_name = parts[1].split(' ')[0].trim();
    }
  }

  return {
    search_intent,
    query_fan_out,
    target_audience,
    main_questions,
    outline_structure,
    schema_markup,
    internal_links,
    content_gaps: `- Kurangnya data spesifikasi teknis dan perbandingan harga di pasaran.\n- Belum ada studi kasus implementasi nyata di kantor/perusahaan.\n- Belum ada penjelasan garansi dan after-sales support.`,
    comparison_factors: `1. Ergonomi & Kenyamanan\n2. Kualitas Bahan & Material\n3. Fitur Penyesuaian (Adjustability)\n4. Garansi Resmi & Durabilitas\n5. Harga & Nilai Investasi`,
    service_areas: `${project?.primary_location || 'Jabodetabek'} dan sekitarnya (Jakarta Pusat, Jakarta Selatan, Tangerang, Bekasi, Depok, Bogor)`,
    local_benefits: `Pengiriman cepat di hari yang sama, tim instalasi gratis ke lokasi, dan garansi tukar unit setempat.`,
    buying_criteria: `Material rangka kuat, sertifikasi ergonomi BIFMA/ISO, kemudahan servis, dan reputasi distributor resmi.`,
    budget_options: `Paket Hemat (Entry Level), Paket Best Seller (Mid Tier), dan Paket Executive (High-End).`,
    value_propositions: `Garansi resmi hingga 5 tahun, gratis konsultasi tata ruang, dan diskon volume khusus pengadaan B2B.`,
    objections_handling: `Menjawab keraguan mengenai biaya kirim, proses retur jika barang tidak pas, dan opsi termin pembayaran perusahaan (TOP 30 hari).`,
    entity_nodes: `${keyword} -> Entitas Terkait: Ergonomi Kerja, Standar K3, Produktivitas Kantor, Furniture B2B`,
    item_a_name,
    item_b_name,
  };
}
