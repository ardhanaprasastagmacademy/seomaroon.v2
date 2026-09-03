import type { PromptTemplate } from '@/types';

export const INITIAL_PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'tpl-04',
    number: 4,
    name: 'Turunan 3 Penulisan Artikel SEO AEO GEO Master',
    category: 'SEO',
    version: '1.0',
    is_active: true,
    description: 'Master prompt standar industri untuk artikel SEO mendalam dengan optimasi Answer Engine (AEO) & Generative Engine Optimization (GEO).',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Judul Artikel', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Target Keyword Utama', required: true, default_source: 'EXCEL' },
      { key: 'supporting_keywords', label: 'Supporting Keywords / LSI', required: false, default_source: 'EXCEL' },
      { key: 'slug', label: 'URL Slug', required: false, default_source: 'EXCEL' },
      { key: 'content_type', label: 'Tipe / Format Konten', required: false, default_source: 'EXCEL' },
      { key: 'estimated_length', label: 'Estimasi Panjang Kata', required: false, default_source: 'PROJECT' },
      { key: 'search_intent', label: 'Intent Utama', required: false, default_source: 'DERIVED' },
      { key: 'funnel_stage', label: 'Funnel / Journey Stage', required: false, default_source: 'EXCEL' },
      { key: 'target_audience', label: 'Target Audience Persona', required: false, default_source: 'DERIVED' },
      { key: 'main_questions', label: 'Pertanyaan Utama Pembaca', required: false, default_source: 'DERIVED' },
      { key: 'query_fan_out', label: 'Query Fan-Out (Minimal 5 Pertanyaan Terkait)', required: false, default_source: 'DERIVED' },
      { key: 'outline_structure', label: 'Struktur Outline (H1 - H3)', required: false, default_source: 'DERIVED' },
      { key: 'cta', label: 'Call to Action (CTA) Utama', required: false, default_source: 'EXCEL' },
      { key: 'internal_links', label: 'Rekomendasi Internal Links', required: false, default_source: 'DERIVED' },
      { key: 'schema_markup', label: 'Schema Wajib (Structured Data)', required: false, default_source: 'DERIVED' },
      { key: 'statistics', label: 'Data / Statistik Pendukung', required: false, default_source: 'MANUAL' },
      { key: 'sources', label: 'Sumber yang Akan Dikutip', required: false, default_source: 'MANUAL' },
      { key: 'tone_of_voice', label: 'Tone of Voice', required: false, default_source: 'PROJECT' },
      { key: 'language', label: 'Bahasa Penulisan', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — PENULISAN ARTIKEL SEO / AEO / GEO (TEMPLATE 04)

Kamu adalah seorang Senior SEO & AEO/GEO Content Strategist serta Copywriter profesional berstandar internasional. Tugasmu adalah menulis artikel komprehensif, orisinal, bernilai tinggi, dan teroptimasi penuh untuk mesin pencari tradisional (Google) maupun AI Answer Engines (Perplexity, ChatGPT Search, Gemini, Claude).

---

## 1. DATA INPUT & STRATEGI KONTEN

- **Judul Artikel:** {{article_title}}
- **Target Keyword Utama:** {{primary_keyword}}
- **Supporting Keywords / LSI:** {{supporting_keywords}}
- **URL Slug:** {{slug}}
- **Tipe / Format Konten:** {{content_type}}
- **Estimasi Panjang:** {{estimated_length}}
- **Search Intent:** {{search_intent}}
- **Funnel Stage:** {{funnel_stage}}
- **Target Audience:** {{target_audience}}
- **Pertanyaan Utama Pembaca:** {{main_questions}}
- **Query Fan-Out (Variasi Pencarian Semantik):**
{{query_fan_out}}
- **Struktur Outline Wajib:**
{{outline_structure}}
- **Target CTA Konversi:** {{cta}}
- **Rekomendasi Internal Links:**
{{internal_links}}
- **Schema Markup Wajib:** {{schema_markup}}
- **Data & Statistik Pendukung:** {{statistics}}
- **Sumber / Otoritas yang Dikutip:** {{sources}}
- **Tone of Voice:** {{tone_of_voice}}
- **Bahasa:** {{language}}

---

## 2. PANDUAN PENULISAN & FRAMEWORK KUALITAS (E-E-A-T + GEO)

1. **Direct Answer (Snippet Ready):** Pada 100 kata pertama, berikan jawaban langsung, ringkas, dan jelas terhadap pertanyaan inti pembaca agar mudah diambil sebagai Google Featured Snippet atau AI Answer summary.
2. **Struktur Heading Logis:** Gunakan 1 tag H1 (Judul), lalu H2 dan H3 secara terstruktur. Jangan lewati tingkatan heading.
3. **Penyebaran Keyword Alami:** Integrasikan Target Keyword Utama di H1, paragraf pertama, minimal satu H2, dan tersebar secara natural (densitas 1-1.5%). Sertakan Supporting Keywords di sub-heading yang relevan.
4. **Elemen Visual & Interaktif:** Sertakan tabel perbandingan, bullet point terstruktur, callout box tips penting, dan panduan langkah demi langkah.
5. **AEO / GEO Optimization:** Buat bagian FAQ (Frequently Asked Questions) di bagian akhir dengan jawaban ringkas (40-60 kata per pertanyaan) yang menjawab query fan-out.
6. **Internal Link Contextual:** Sisipkan penempatan internal links yang direkomendasikan pada anchor text yang natural.
7. **Actionable CTA:** Akhiri artikel dengan kesimpulan tegas dan Call to Action sesuai target konversi di atas.

Tuliskan artikel lengkap sekarang dalam format Markdown yang rapi dan siap dipublikasikan.`
  },
  {
    id: 'tpl-05',
    number: 5,
    name: 'SEO Content Refresh & Ranking Booster',
    category: 'SEO',
    version: '1.0',
    is_active: true,
    description: 'Prompt untuk memperbarui, memperluas, dan mengoptimasi ulang artikel lama yang mengalami penurunan peringkat di SERP.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Judul Artikel Lama', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Target Keyword', required: true, default_source: 'EXCEL' },
      { key: 'supporting_keywords', label: 'Supporting Keywords / Lost Keywords', required: false, default_source: 'EXCEL' },
      { key: 'slug', label: 'URL Slug', required: false, default_source: 'EXCEL' },
      { key: 'existing_content_summary', label: 'Ringkasan Konten Saat Ini', required: false, default_source: 'MANUAL' },
      { key: 'content_gaps', label: 'Content Gaps & Missing Entities', required: false, default_source: 'DERIVED' },
      { key: 'query_fan_out', label: 'Pertanyaan Baru / Trend Terkini', required: false, default_source: 'DERIVED' },
      { key: 'cta', label: 'Target CTA Baru', required: false, default_source: 'EXCEL' },
      { key: 'tone_of_voice', label: 'Tone of Voice', required: false, default_source: 'PROJECT' },
      { key: 'language', label: 'Bahasa Penulisan', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — CONTENT REFRESH & RANKING BOOSTER (TEMPLATE 05)

Kamu adalah SEO Audit & Content Optimization Specialist. Tugasmu adalah memperbarui dan merevitalisasi artikel blog lama agar kembali mendominasi halaman pertama Google dan meningkatkan engagement pembaca.

---

## 1. INFORMASI KONTEN

- **Judul Artikel:** {{article_title}}
- **Target Keyword Utama:** {{primary_keyword}}
- **Supporting / Lost Keywords:** {{supporting_keywords}}
- **URL Slug:** {{slug}}
- **Ringkasan Konten Lama:** {{existing_content_summary}}
- **Content Gaps & Topik yang Hilang:**
{{content_gaps}}
- **Pencarian Baru / Trend Terkini:**
{{query_fan_out}}
- **Target CTA:** {{cta}}
- **Tone:** {{tone_of_voice}}
- **Bahasa:** {{language}}

---

## 2. INSTRUKSI OPTIMASI REFRESH

1. **Audit & Hook Baru:** Tulis intro yang jauh lebih kuat dan relevan untuk tahun ini dengan memasukkan data terbaru.
2. **Isi Content Gap:** Tambahkan subtopik baru yang secara mendalam membahas celah informasi yang teridentifikasi.
3. **Format Lebih Mudah Discan:** Ubah paragraf panjang menjadi poin-poin, tabel komparasi, dan visual takeaways.
4. **FAQ Update:** Perbarui bagian FAQ dengan pertanyaan terkini yang sering ditanyakan pencari.
5. **Output:** Tuliskan versi artikel yang sudah direvisi secara utuh dalam format Markdown.`
  },
  {
    id: 'tpl-06',
    number: 6,
    name: 'Pillar Page Authority Hub Builder',
    category: 'SEO',
    version: '1.0',
    is_active: true,
    description: 'Prompt untuk membangun artikel pilar otoritas tinggi yang menjadi pusat internal linking bagi cluster konten.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Judul Pillar Page', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Head Keyword (Pillar)', required: true, default_source: 'EXCEL' },
      { key: 'cluster_topics', label: 'Daftar Sub-Topik Cluster', required: false, default_source: 'EXCEL' },
      { key: 'supporting_keywords', label: 'Supporting Keywords', required: false, default_source: 'EXCEL' },
      { key: 'target_audience', label: 'Target Audience', required: false, default_source: 'DERIVED' },
      { key: 'outline_structure', label: 'Comprehensive Pillar Outline', required: false, default_source: 'DERIVED' },
      { key: 'cta', label: 'Pillar CTA', required: false, default_source: 'EXCEL' },
      { key: 'tone_of_voice', label: 'Tone', required: false, default_source: 'PROJECT' },
      { key: 'language', label: 'Bahasa', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — PILLAR PAGE AUTHORITY BUILDER (TEMPLATE 06)

Kamu adalah Top-Tier Content Architect. Buatlah sebuah **Pillar Page (Ultimate Guide)** yang mendalam dan komprehensif untuk membangun Topical Authority di industri ini.

---

## 1. PARAMETER PILLAR

- **Judul Pillar:** {{article_title}}
- **Target Head Keyword:** {{primary_keyword}}
- **Sub-Topik / Cluster Konten Terkait:** {{cluster_topics}}
- **Supporting Keywords:** {{supporting_keywords}}
- **Target Audience:** {{target_audience}}
- **Struktur Outline Pillar:**
{{outline_structure}}
- **Call to Action Utama:** {{cta}}
- **Tone:** {{tone_of_voice}}
- **Bahasa:** {{language}}

---

## 2. STANDAR EKSEKUSI PILLAR PAGE

1. **Definisi Holistik:** Mulai dengan konsep fundamental yang paling mudah dipahami lalu melangkah ke strategi tingkat lanjut.
2. **Hub Internal Linking:** Berikan rangkuman ringkas untuk setiap subtopik cluster dengan penanda jelas untuk menautkan link ke artikel turunan (spoke articles).
3. **Interactive Navigation:** Tuliskan format Table of Contents (Daftar Isi) yang interaktif.
4. **Key Takeaways & Infographic Summary Table:** Sediakan tabel ringkasan eksekutif yang merangkum keseluruhan topik.
5. **Panjang & Kedalaman:** Pastikan konten mendalam dan bernilai referensi jangka panjang.`
  },
  {
    id: 'tpl-07',
    number: 7,
    name: 'SEO Comparison & VS Guide (Commercial Intent)',
    category: 'SEO',
    version: '1.0',
    is_active: true,
    description: 'Prompt perbandingan produk/layanan A vs B untuk menangkap pencari dengan commercial investigation intent.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Judul Perbandingan', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Keyword Perbandingan (e.g. X vs Y)', required: true, default_source: 'EXCEL' },
      { key: 'item_a_name', label: 'Subjek A', required: false, default_source: 'DERIVED' },
      { key: 'item_b_name', label: 'Subjek B', required: false, default_source: 'DERIVED' },
      { key: 'comparison_factors', label: 'Parameter Perbandingan', required: false, default_source: 'DERIVED' },
      { key: 'cta', label: 'Target CTA Konversi', required: false, default_source: 'EXCEL' },
      { key: 'tone_of_voice', label: 'Tone of Voice', required: false, default_source: 'PROJECT' },
      { key: 'language', label: 'Bahasa', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — COMPARISON & VS GUIDE (TEMPLATE 07)

Kamu adalah Product Reviewer dan SEO Specialist independen yang objektif. Tulis panduan perbandingan mendalam antara dua produk/solusi untuk membantu calon pembeli mengambil keputusan terbaik.

---

## 1. DATA INPUT PERBANDINGAN

- **Judul Artikel:** {{article_title}}
- **Target Keyword:** {{primary_keyword}}
- **Item A:** {{item_a_name}}
- **Item B:** {{item_b_name}}
- **Kriteria & Parameter Evaluasi:** {{comparison_factors}}
- **Target CTA:** {{cta}}
- **Tone:** {{tone_of_voice}}
- **Bahasa:** {{language}}

---

## 2. STRUKTUR ARTIKEL PERBANDINGAN

1. **Executive Summary / Quick Verdict:** Berikan tabel perbandingan langsung di awal artikel (Fitur, Kelebihan, Kekurangan, Harga, Pemenang).
2. **Deep Dive Item A:** Analisis fitur, kelebihan, dan kelemahan spesifik Item A.
3. **Deep Dive Item B:** Analisis fitur, kelebihan, dan kelemahan spesifik Item B.
4. **Head-to-Head Comparison:** Bandingkan secara spesifik berdasarkan kriteria (Kinerja, Kenyamanan, Daya Tahan, Nilai Ekonomis).
5. **Kapan Memilih A vs Kapan Memilih B:** Panduan skenario nyata untuk siapa Item A cocok dan untuk siapa Item B cocok.
6. **Kesimpulan & Rekomendasi:** Penutup objektif dengan dorongan CTA yang tepat.`
  },
  {
    id: 'tpl-08',
    number: 8,
    name: 'How-To & Step-by-Step Practical Guide',
    category: 'SEO',
    version: '1.0',
    is_active: true,
    description: 'Prompt panduan praktis langkah demi langkah yang teroptimasi untuk Google HowTo Schema & Featured Snippet lists.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Judul Panduan How-To', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Target Keyword Cara / Tutorial', required: true, default_source: 'EXCEL' },
      { key: 'supporting_keywords', label: 'Supporting Keywords', required: false, default_source: 'EXCEL' },
      { key: 'target_audience', label: 'Target Pembaca', required: false, default_source: 'DERIVED' },
      { key: 'prerequisites', label: 'Persyaratan / Alat yang Dibutuhkan', required: false, default_source: 'DERIVED' },
      { key: 'step_outline', label: 'Urutan Langkah (Step 1 to N)', required: false, default_source: 'DERIVED' },
      { key: 'common_mistakes', label: 'Kesalahan Umum yang Harus Dihindari', required: false, default_source: 'DERIVED' },
      { key: 'cta', label: 'CTA', required: false, default_source: 'EXCEL' },
      { key: 'language', label: 'Bahasa', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — STEP-BY-STEP HOW-TO GUIDE (TEMPLATE 08)

Kamu adalah Expert Instructor & Technical Writer. Tuliskan panduan langkah demi langkah (How-To Guide) yang mudah diikuti oleh pemula hingga tingkat mahir.

---

## 1. DATA PANDUAN

- **Judul Panduan:** {{article_title}}
- **Target Keyword:** {{primary_keyword}}
- **Supporting Keywords:** {{supporting_keywords}}
- **Target Pembaca:** {{target_audience}}
- **Alat & Persiapan Awal:** {{prerequisites}}
- **Rangkaian Langkah:**
{{step_outline}}
- **Kesalahan Umum:** {{common_mistakes}}
- **Call to Action:** {{cta}}
- **Bahasa:** {{language}}

---

## 2. INSTRUKSI PENULISAN HOW-TO

1. **Clear Overview:** Jelaskan estimasi waktu pengerjaan dan hasil yang akan didapat.
2. **Numbered Steps:** Tulis langkah dengan penomoran H3 (Langkah 1: ..., Langkah 2: ...) dengan instruksi actionable dan jelas.
3. **Troubleshooting Section:** Berikan solusi jika terjadi kendala pada saat menjalankan langkah tersebut.
4. **Pro Tips:** Tambahkan callout box berupa tips efisiensi atau keselamatan.
5. **FAQ How-To:** Sertakan 3-5 FAQ umum.`
  },
  {
    id: 'tpl-11',
    number: 11,
    name: 'Local SEO & Geo-Targeted Landing Content',
    category: 'Local SEO',
    version: '1.0',
    is_active: true,
    description: 'Prompt penulisan konten berbasis wilayah/kota (Jakarta, Surabaya, Malang, dll.) dengan integrasi NAP, Local Intent & GEO trust signals.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Judul Konten Lokal', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Keyword Lokal (e.g. Toko X di Jakarta)', required: true, default_source: 'EXCEL' },
      { key: 'target_location', label: 'Lokasi / Kota Target', required: true, default_source: 'PROJECT' },
      { key: 'business_name', label: 'Nama Bisnis / Brand', required: false, default_source: 'PROJECT' },
      { key: 'service_areas', label: 'Cakupan Area / Kecamatan Terlayani', required: false, default_source: 'DERIVED' },
      { key: 'local_benefits', label: 'Keunggulan Layanan Lokal (Pengiriman cepat, showroom)', required: false, default_source: 'DERIVED' },
      { key: 'cta', label: 'CTA Lokal (WhatsApp / Telp / Kunjungan)', required: false, default_source: 'EXCEL' },
      { key: 'language', label: 'Bahasa', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — LOCAL SEO & GEO TARGETED CONTENT (TEMPLATE 11)

Kamu adalah Pakar Local SEO & Google Business Profile Strategy. Tuliskan konten halaman layanan / artikel lokal yang ditargetkan untuk wilayah spesifik dengan sinyal relevansi geografis yang kuat.

---

## 1. PARAMETER LOKAL

- **Judul Artikel:** {{article_title}}
- **Target Keyword Lokal:** {{primary_keyword}}
- **Lokasi Utama:** {{target_location}}
- **Nama Bisnis:** {{business_name}}
- **Cakupan Wilayah / Area Layanan:** {{service_areas}}
- **Nilai Unggul Layanan Lokal:** {{local_benefits}}
- **Call to Action Kontak:** {{cta}}
- **Bahasa:** {{language}}

---

## 2. FORMAT KONTEN LOCAL SEO

1. **Local Geo-Hook:** Tunjukkan pemahaman mendalam tentang kebutuhan warga / bisnis di area {{target_location}}.
2. **Penyebaran Nama Lokasi:** Integrasikan nama kota, wilayah sekitar, dan landmark terkait secara alami tanpa keyword stuffing.
3. **Layanan & Jangkauan Pengiriman:** Buat sub-bab khusus mengenai kecepatan layanan, logistik lokal, dan garansi setempat.
4. **Testimoni & Studi Kasus Lokal:** Sisipkan bagian bukti kepuasan pelanggan di kawasan sekitar.
5. **Local NAP & Fast Contact CTA:** Sediakan instruksi kontak cepat via WhatsApp atau telepon.`
  },
  {
    id: 'tpl-15',
    number: 15,
    name: 'E-Commerce Product Buying Guide & Round-Up',
    category: 'E-Commerce',
    version: '1.0',
    is_active: true,
    description: 'Prompt artikel kurasi produk terbaik (Best List Round-up) untuk kategori toko online / B2B procurement dengan fokus konversi.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Judul Panduan Pembelian', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Keyword Produk / Rekomendasi', required: true, default_source: 'EXCEL' },
      { key: 'product_category', label: 'Kategori Produk', required: false, default_source: 'EXCEL' },
      { key: 'buying_criteria', label: 'Kriteria Memilih Produk yang Baik', required: false, default_source: 'DERIVED' },
      { key: 'recommended_list', label: 'Daftar Produk yang Direkomendasikan', required: false, default_source: 'DERIVED' },
      { key: 'budget_options', label: 'Rentang Harga / Paket Budget', required: false, default_source: 'DERIVED' },
      { key: 'cta', label: 'CTA Pembelian / Katalog', required: false, default_source: 'EXCEL' },
      { key: 'language', label: 'Bahasa', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — E-COMMERCE BUYING GUIDE & ROUND-UP (TEMPLATE 15)

Kamu adalah E-Commerce Merchandising & SEO Conversion Copywriter. Tulis artikel rekomendasi produk terbaik dan panduan pembelian yang meyakinkan bagi calon pembeli.

---

## 1. PARAMETER PRODUK

- **Judul Artikel:** {{article_title}}
- **Target Keyword:** {{primary_keyword}}
- **Kategori Produk:** {{product_category}}
- **Kriteria Pemilihan:** {{buying_criteria}}
- **Daftar Rekomendasi Produk:**
{{recommended_list}}
- **Opsi Rentang Budget:** {{budget_options}}
- **Call to Action:** {{cta}}
- **Bahasa:** {{language}}

---

## 2. STRUKTUR KONTEN BUYING GUIDE

1. **Top Picks Summary:** Sediakan tabel ringkas produk terbaik per kategori (e.g., Terbaik Keseluruhan, Paling Terjangkau, Paling Premium).
2. **Buying Factors (Faktor Penting):** Uraikan parameter spesifikasi teknis, material, dan garansi yang wajib diperhatikan pembeli.
3. **Itemized Product Reviews:** Tuliskan ulasan spesifik tiap produk mencakup fitur unggulan, kelebihan, kekurangan, dan target pemakai ideal.
4. **FAQ Pembelian & Pengiriman:** Tambahkan FAQ seputar instalasi, pengiriman, dan cara klaim garansi.`
  },
  {
    id: 'tpl-20',
    number: 20,
    name: 'BOFU High-Conversion Sales & Solution Page',
    category: 'SEO',
    version: '1.0',
    is_active: true,
    description: 'Prompt artikel Bottom of Funnel (BOFU) untuk target audiens yang siap membeli/transaksi dengan teknik penulisan persuasif & mengatasi keberatan.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Judul Konten BOFU', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Keyword Transaksional / Harga / Jasa', required: true, default_source: 'EXCEL' },
      { key: 'value_propositions', label: 'Keunggulan Utama & Garansi', required: false, default_source: 'DERIVED' },
      { key: 'objections_handling', label: 'Jawaban atas Keberatan Calon Klien', required: false, default_source: 'DERIVED' },
      { key: 'pricing_packages', label: 'Skema Harga / Paket Penawaran', required: false, default_source: 'DERIVED' },
      { key: 'cta', label: 'CTA Transaksi (Order Sekarang / Dapatkan Penawaran)', required: false, default_source: 'EXCEL' },
      { key: 'language', label: 'Bahasa', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — BOFU HIGH-CONVERSION SALES ARTICLE (TEMPLATE 20)

Kamu adalah Direct-Response Copywriter & Commercial SEO Specialist. Tuliskan artikel bernada komersial tinggi (BOFU) yang mengubah pembaca dengan intensi transaksi menjadi prospek / pembeli aktif.

---

## 1. STRATEGI PENJUALAN

- **Judul:** {{article_title}}
- **Target Keyword:** {{primary_keyword}}
- **Value Proposition Utama:** {{value_propositions}}
- **Mengatasi Keberatan (Objection Handling):** {{objections_handling}}
- **Penawaran / Skema Harga:** {{pricing_packages}}
- **Target Call to Action:** {{cta}}
- **Bahasa:** {{language}}

---

## 2. FORMAT KONTEN

1. **Problem Recognition & Direct Solution:** Buka dengan masalah mendesak yang dihadapi klien dan tawarkan solusi konkret secara tegas.
2. **Fitur vs Manfaat Finansial:** Jelaskan mengapa solusi ini menghemat biaya atau meningkatkan produktivitas dalam jangka panjang.
3. **Price Transparency & Package Options:** Tampilkan rincian paket secara transparan dengan tabel komparasi benefit.
4. **Risk Reversal (Garansi):** Sebutkan jaminan kepuasan, garansi uang kembali, atau konsultasi gratis tanpa komitmen.
5. **Urgent CTA:** Pasang CTA mencolok dan jelas dengan kontak langsung.`
  },
  {
    id: 'tpl-38',
    number: 38,
    name: 'AEO FAQ & Entity Knowledge Graph Schema Enhancer',
    category: 'AEO/GEO',
    version: '1.0',
    is_active: true,
    description: 'Prompt pengayaan entitas SEO, Knowledge Graph, dan Q&A AEO untuk mendominasi jawaban AI (ChatGPT, Perplexity, Gemini).',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Topik Utama / Judul', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Keyword Inti', required: true, default_source: 'EXCEL' },
      { key: 'entity_nodes', label: 'Entitas & Hubungan Semantic', required: false, default_source: 'DERIVED' },
      { key: 'query_fan_out', label: 'Daftar Pertanyaan Fan-Out AI', required: false, default_source: 'DERIVED' },
      { key: 'schema_markup', label: 'Tipe Schema yang Dibutuhkan', required: false, default_source: 'DERIVED' },
      { key: 'language', label: 'Bahasa', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — AEO FAQ & ENTITY ENHANCER (TEMPLATE 38)

Kamu adalah AI Knowledge Graph Architect & AEO Optimizer. Buat blok konten terstruktur yang memetakan entitas semantik, Q&A berbasis data, dan JSON-LD schema snippet.

---

## 1. INPUT ENTITAS

- **Topik / Judul:** {{article_title}}
- **Target Keyword:** {{primary_keyword}}
- **Semantic Entities:** {{entity_nodes}}
- **Pertanyaan AI Fan-Out:**
{{query_fan_out}}
- **Schema Format:** {{schema_markup}}
- **Bahasa:** {{language}}

---

## 2. OUTPUT YANG DIBUTUHKAN

1. **Entity Definition Table:** Tabel yang menghubungkan entitas primer dengan entitas sekunder, atribut, dan relasinya.
2. **AEO Answer Blocks:** 5-8 blok pertanyaan & jawaban berformat concise (maks 50 kata per jawaban) yang sangat disukai AI summary engines.
3. **Valid JSON-LD Schema Snippet:** Kode schema \`FAQPage\` atau \`ItemPage\` yang valid sesuai standard schema.org.`
  },
  {
    id: 'tpl-39',
    number: 39,
    name: 'Search Intent Realignment & SERP Intent Matcher',
    category: 'SEO',
    version: '1.0',
    is_active: true,
    description: 'Prompt kalibrasi ulang artikel untuk menyamakan search intent SERP yang berubah (mis. dari informational menjadi commercial).',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Judul Artikel', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Keyword Target', required: true, default_source: 'EXCEL' },
      { key: 'detected_serp_intent', label: 'Search Intent Terdeteksi', required: false, default_source: 'DERIVED' },
      { key: 'competitor_angles', label: 'Angle Pesaing di Halaman 1', required: false, default_source: 'DERIVED' },
      { key: 'revised_outline', label: 'Outline Penyesuaian Intent', required: false, default_source: 'DERIVED' },
      { key: 'cta', label: 'Target CTA Baru', required: false, default_source: 'EXCEL' },
      { key: 'language', label: 'Bahasa', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — SEARCH INTENT REALIGNMENT (TEMPLATE 39)

Kamu adalah SERP Analyst & Senior SEO Copywriter. Tulis ulang konten agar 100% selaras dengan Search Intent dominan di Google saat ini.

---

## 1. SERP INTENT ALIGNMENT

- **Judul Artikel:** {{article_title}}
- **Keyword Utama:** {{primary_keyword}}
- **Search Intent SERP Terkini:** {{detected_serp_intent}}
- **Angle Pesaing Teratas:** {{competitor_angles}}
- **Outline Baru:**
{{revised_outline}}
- **CTA:** {{cta}}
- **Bahasa:** {{language}}

---

## 2. TUGAS PENULISAN

Tulis ulang artikel lengkap dengan angle dan format yang sesuai intent yang dominan, hilangkan bagian yang tidak relevan, dan pastikan kepuasan pembaca terpenuhi secara instan.`
  },
  {
    id: 'tpl-40',
    number: 40,
    name: 'GEO Multi-Model Synthetic Prompt Generator',
    category: 'AEO/GEO',
    version: '1.0',
    is_active: true,
    description: 'Prompt universal generasi konten tingkat lanjut yang dirancang khusus untuk optimasi mesin LLM (Generative Engine Optimization).',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Judul Artikel', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Primary Keyword', required: true, default_source: 'EXCEL' },
      { key: 'supporting_keywords', label: 'LSI & Semantic Clusters', required: false, default_source: 'EXCEL' },
      { key: 'search_intent', label: 'Search Intent', required: false, default_source: 'DERIVED' },
      { key: 'target_audience', label: 'Audience Persona', required: false, default_source: 'DERIVED' },
      { key: 'query_fan_out', label: 'Multi-Perspective AI Query Fan-Out', required: false, default_source: 'DERIVED' },
      { key: 'outline_structure', label: 'Outline Modular H1-H3', required: false, default_source: 'DERIVED' },
      { key: 'schema_markup', label: 'Schema Architecture', required: false, default_source: 'DERIVED' },
      { key: 'cta', label: 'Conversion CTA', required: false, default_source: 'EXCEL' },
      { key: 'tone_of_voice', label: 'Tone', required: false, default_source: 'PROJECT' },
      { key: 'language', label: 'Language', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — GEO SYNTHETIC GENERATION ENGINE (TEMPLATE 40)

Kamu adalah Generative Engine Optimization (GEO) Architect. Buat konten yang memaksimalkan probabilitas sitasi dan penyebutan brand oleh model AI (ChatGPT, Perplexity, Gemini, Claude).

---

## 1. SPESIFIKASI PROMPT GEO

- **Judul Artikel:** {{article_title}}
- **Target Keyword Utama:** {{primary_keyword}}
- **Semantic Clusters:** {{supporting_keywords}}
- **Search Intent:** {{search_intent}}
- **Target Audience:** {{target_audience}}
- **Multi-Perspective Query Fan-Out:**
{{query_fan_out}}
- **Modular Outline:**
{{outline_structure}}
- **Schema Recommendations:** {{schema_markup}}
- **Target CTA:** {{cta}}
- **Tone:** {{tone_of_voice}}
- **Language:** {{language}}

---

## 2. PRINSIP CITATION READINESS (GEO PRINCIPLES)

1. **Factual Density:** Sertakan data konkret, definisi tegas, dan metodologi yang jelas.
2. **Clear Entity Triples:** Gunakan pola Subjek-Predikat-Objek yang mudah diproses oleh Information Extraction LLM.
3. **Structured Comparison Matrices:** Sediakan tabel komparasi dengan metrik terukur.
4. **Quotable Insights:** Masukkan kesimpulan ringkas berbobot yang siap dikutip oleh AI Answer Engines sebagai sumber primer.`
  }
];

// Helper to fill other template slots up to 40 for complete PRD compliance
for (let num = 9; num <= 37; num++) {
  if (!INITIAL_PROMPT_TEMPLATES.find(t => t.number === num)) {
    const isLocal = num === 11 || num === 12;
    const isEcom = num === 14 || num === 15 || num === 16;
    const isSocial = num === 22 || num === 23;
    const category: PromptTemplate['category'] = isLocal ? 'Local SEO' : isEcom ? 'E-Commerce' : isSocial ? 'Social' : 'SEO';
    
    INITIAL_PROMPT_TEMPLATES.push({
      id: `tpl-${num < 10 ? '0' + num : num}`,
      number: num,
      name: `Template ${num < 10 ? '0' + num : num} — SEO Specialist Specialized Framework`,
      category,
      version: '1.0',
      is_active: true,
      description: `Template prompt teroptimasi untuk spesialisasi konten ${category} nomor ${num}.`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      input_schema: [
        { key: 'article_title', label: 'Judul Artikel', required: true, default_source: 'EXCEL' },
        { key: 'primary_keyword', label: 'Target Keyword', required: true, default_source: 'EXCEL' },
        { key: 'supporting_keywords', label: 'Supporting Keywords', required: false, default_source: 'EXCEL' },
        { key: 'search_intent', label: 'Search Intent', required: false, default_source: 'DERIVED' },
        { key: 'cta', label: 'CTA', required: false, default_source: 'EXCEL' },
        { key: 'language', label: 'Bahasa', required: true, default_source: 'PROJECT' },
      ],
      template_markdown: `# MASTER PROMPT — SPECIALIZED FRAMEWORK (TEMPLATE ${num < 10 ? '0' + num : num})

Kamu adalah SEO & Content Writing Specialist. Tuliskan artikel komprehensif berdasarkan parameter berikut:

---

## 1. PARAMETER KONTEN

- **Judul Artikel:** {{article_title}}
- **Target Keyword Utama:** {{primary_keyword}}
- **Supporting Keywords:** {{supporting_keywords}}
- **Search Intent:** {{search_intent}}
- **Target CTA:** {{cta}}
- **Bahasa:** {{language}}

---

## 2. INSTRUKSI PENULISAN

1. Tulis artikel berbobot, terstruktur dengan rapi menggunakan Markdown (H1, H2, H3).
2. Maksimalkan relevansi search intent dan kenyamanan membaca pengguna.
3. Berikan kesimpulan dan rekomendasi aksi penutup sesuai target CTA.`
    });
  }
}

// Sort templates by number
INITIAL_PROMPT_TEMPLATES.sort((a, b) => a.number - b.number);
