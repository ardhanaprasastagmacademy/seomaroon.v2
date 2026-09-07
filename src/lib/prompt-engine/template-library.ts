import type { PromptTemplate } from '@/types';

export const INITIAL_PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'tpl-01',
    number: 1,
    name: 'Master SEO/AEO/GEO Ultimate Pillar & Semantic Authority',
    category: 'SEO',
    version: '2.0',
    is_active: true,
    description: 'Master prompt all-in-one terlengkap untuk artikel pilar otoritas tinggi yang mendominasi peringkat #1 Google sekaligus di-sitasi akurat oleh AI Answer Engines (Perplexity, ChatGPT, Gemini, Claude). Menggabungkan Pillar Hub, Entity Knowledge Graph, dan GEO Citations.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Judul Artikel Pillar', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Target Keyword Utama', required: true, default_source: 'EXCEL' },
      { key: 'supporting_keywords', label: 'Supporting Keywords / LSI', required: false, default_source: 'EXCEL' },
      { key: 'slug', label: 'URL Slug', required: false, default_source: 'EXCEL' },
      { key: 'content_type', label: 'Tipe / Format Konten', required: false, default_source: 'EXCEL' },
      { key: 'estimated_length', label: 'Estimasi Panjang Kata', required: false, default_source: 'PROJECT' },
      { key: 'search_intent', label: 'Intent Utama', required: false, default_source: 'DERIVED' },
      { key: 'target_audience', label: 'Target Audience Persona', required: false, default_source: 'DERIVED' },
      { key: 'main_questions', label: 'Pertanyaan Utama Pembaca', required: false, default_source: 'DERIVED' },
      { key: 'query_fan_out', label: 'Query Fan-Out (Variasi Pencarian AI)', required: false, default_source: 'DERIVED' },
      { key: 'outline_structure', label: 'Struktur Outline Modular (H1 - H3)', required: false, default_source: 'DERIVED' },
      { key: 'cluster_topics', label: 'Topik Cluster & Internal Linking Hub', required: false, default_source: 'DERIVED' },
      { key: 'entity_nodes', label: 'Semantic Entities & Knowledge Graph', required: false, default_source: 'DERIVED' },
      { key: 'internal_links', label: 'Rekomendasi Internal Links', required: false, default_source: 'DERIVED' },
      { key: 'schema_markup', label: 'Schema Wajib (Structured Data)', required: false, default_source: 'DERIVED' },
      { key: 'cta', label: 'Call to Action (CTA) Utama', required: false, default_source: 'EXCEL' },
      { key: 'statistics', label: 'Data / Statistik Pendukung', required: false, default_source: 'MANUAL' },
      { key: 'sources', label: 'Sumber Otoritas yang Dikutip', required: false, default_source: 'MANUAL' },
      { key: 'tone_of_voice', label: 'Tone of Voice', required: false, default_source: 'PROJECT' },
      { key: 'language', label: 'Bahasa Penulisan', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — ULTIMATE SEO / AEO / GEO PILLAR & SEMANTIC AUTHORITY (TEMPLATE 01)

Kamu adalah seorang Principal SEO Strategist, AEO/GEO Architect, dan Subject Matter Expert berstandar global. Tugasmu adalah menyusun artikel pilar (Ultimate Authority Guide) yang komprehensif, orisinal, bernilai referensi tinggi, dan teroptimasi secara mutlak untuk mesin pencari konvensional (Google Search) maupun Generative Answer Engines (ChatGPT Search, Perplexity, Google AI Overviews, Claude, Gemini).

---

## 1. PARAMETER STRATEGIS & KONTEN

- **Judul Artikel:** {{article_title}}
- **Target Keyword Utama:** {{primary_keyword}}
- **Supporting Keywords / LSI:** {{supporting_keywords}}
- **URL Slug:** {{slug}}
- **Tipe / Format Konten:** {{content_type}}
- **Estimasi Panjang Kata:** {{estimated_length}}
- **Search Intent:** {{search_intent}}
- **Target Audience Persona:** {{target_audience}}
- **Pertanyaan Utama Pembaca:** {{main_questions}}
- **Semantic Entities & Relasi Knowledge Graph:** {{entity_nodes}}
- **Sub-Topik Cluster & Spoke Linking:** {{cluster_topics}}
- **Query Fan-Out (AI Multi-Perspective Questions):**
{{query_fan_out}}
- **Struktur Outline Wajib (H1 - H3):**
{{outline_structure}}
- **Target CTA Konversi:** {{cta}}
- **Rekomendasi Internal Links:**
{{internal_links}}
- **Rekomendasi Schema Markup:** {{schema_markup}}
- **Data & Statistik Pendukung:** {{statistics}}
- **Sumber Otoritas yang Dikutip:** {{sources}}
- **Tone of Voice:** {{tone_of_voice}}
- **Bahasa:** {{language}}

---

## 2. STANDAR EKSEKUSI KONTEN (E-E-A-T + GEO CITATION FRAMEWORK)

1. **Direct Answer (Featured Snippet Ready):** Pada 80-100 kata pertama setelah H1, berikan jawaban langsung, ringkas, dan jelas terhadap inti masalah atau pertanyaan pembaca tanpa pembukaan klise/basa-basi.
2. **Topical Hub & Interlinking Architecture:** Sajikan artikel ini sebagai pilar induk. Berikan hook alami yang mengarahkan pembaca ke artikel turunan (spoke articles) berdasarkan daftar cluster terkait.
3. **Entity Triples & Factual Density (GEO):** Gunakan pola Subjek-Predikat-Objek yang tegas saat menjelaskan konsep teknis agar mudah diproses oleh Information Extraction LLM untuk dijadikan referensi kutipan (source citation).
4. **Struktur Heading Ketat (Hierarchy):** Gunakan tepat 1 tag H1. Lanjutkan dengan H2 untuk topik utama dan H3 untuk rincian sub-topik. Sisipkan keyword utama di H1, intro, dan minimal satu H2 secara natural (densitas 1-1.5%).
5. **Elemen Visual & Scannability:** Sertakan minimal 1 tabel ringkasan perbandingan/matriks data, bullet list terstruktur, dan callout tips praktis untuk mempermudah pembaca memahami poin penting dalam hitungan detik.
6. **AEO Answer FAQ Blocks:** Pada bagian akhir artikel, sertakan bagian FAQ dengan 4-6 pertanyaan dari Query Fan-Out. Setiap jawaban dibuat padat (40-60 kata) dengan jawaban langsung di kalimat pertama.
7. **JSON-LD Schema Snippet:** Di baris terbawah artikel, cantumkan contoh kode JSON-LD yang valid untuk schema \`Article\` dan \`FAQPage\`.
8. **Actionable CTA:** Akhiri dengan kesimpulan berwawasan ke depan dan ajakan bertindak (CTA) yang selaras dengan target konversi di atas.

Tuliskan artikel lengkap sekarang dalam format Markdown yang rapi, profesional, dan siap dipublikasikan.`
  },
  {
    id: 'tpl-02',
    number: 2,
    name: 'Commercial Comparison, Best Round-Up & Buyer\'s Decision Engine',
    category: 'E-Commerce',
    version: '2.0',
    is_active: true,
    description: 'Prompt panduan pembelian komparatif (Comparison VS, Best Picks Round-up, Buying Guide) dengan commercial & transactional intent tinggi untuk mengonversi pencari menjadi pembeli melalui review objektif dan rekomendasi tegas.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Judul Panduan / Perbandingan', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Keyword Komparasi / Produk', required: true, default_source: 'EXCEL' },
      { key: 'supporting_keywords', label: 'Supporting Keywords / Brand LSI', required: false, default_source: 'EXCEL' },
      { key: 'product_category', label: 'Kategori Produk / Solusi', required: false, default_source: 'EXCEL' },
      { key: 'item_a_name', label: 'Produk / Opsi A', required: false, default_source: 'DERIVED' },
      { key: 'item_b_name', label: 'Produk / Opsi B', required: false, default_source: 'DERIVED' },
      { key: 'buying_criteria', label: 'Kriteria & Parameter Evaluasi', required: false, default_source: 'DERIVED' },
      { key: 'recommended_list', label: 'Daftar Produk / Opsi Rekomendasi', required: false, default_source: 'DERIVED' },
      { key: 'budget_options', label: 'Opsi Rentang Budget / Harga', required: false, default_source: 'DERIVED' },
      { key: 'objections_handling', label: 'Jawaban atas Keraguan Calon Pembeli', required: false, default_source: 'DERIVED' },
      { key: 'cta', label: 'Target CTA Transaksi / Katalog', required: false, default_source: 'EXCEL' },
      { key: 'tone_of_voice', label: 'Tone of Voice', required: false, default_source: 'PROJECT' },
      { key: 'language', label: 'Bahasa Penulisan', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — COMMERCIAL COMPARISON & BUYER'S DECISION ENGINE (TEMPLATE 02)

Kamu adalah seorang Senior Product Evaluator, Commercial Copywriter, dan SEO E-Commerce Specialist independen yang objektif dan kredibel. Tugasmu adalah menulis panduan pembelian dan komparasi produk/solusi yang mendalam, jujur, serta membantu calon pembeli mengambil keputusan transaksi terbaik tanpa keraguan.

---

## 1. PARAMETER EVALUASI & PRODUK

- **Judul Artikel:** {{article_title}}
- **Target Keyword Komersial:** {{primary_keyword}}
- **Supporting Keywords:** {{supporting_keywords}}
- **Kategori Produk / Solusi:** {{product_category}}
- **Subjek A (Jika Komparasi VS):** {{item_a_name}}
- **Subjek B (Jika Komparasi VS):** {{item_b_name}}
- **Kriteria & Parameter Evaluasi:** {{buying_criteria}}
- **Daftar Rekomendasi Produk / Pilihan:**
{{recommended_list}}
- **Opsi Rentang Budget:** {{budget_options}}
- **Jawaban Keraguan Pembeli (Objection Handling):** {{objections_handling}}
- **Target Call to Action:** {{cta}}
- **Tone of Voice:** {{tone_of_voice}}
- **Bahasa:** {{language}}

---

## 2. STRUKTUR & PANDUAN PENULISAN KOMPARATIF

1. **Executive Verdict & Quick Decision Table:** Di awal artikel, langsung sajikan tabel matriks komparasi cepat (Item, Skor Kualitas, Keunggulan Utama, Kisaran Harga, Pemenang / Rekomendasi Ideal) agar pembeli yang terburu-buru bisa segera mengambil keputusan.
2. **Framework Kriteria Pemilihan (Buying Criteria):** Uraikan 4-6 parameter kritis yang wajib dicek pembeli sebelum membeli (material, spesifikasi teknis, garansi, efisiensi operasional, dan purnajual).
3. **Itemized Deep-Dive Reviews:** Ulas setiap produk/opsi dengan struktur teratur:
   - *Overview Singkat & Target Pengguna Ideal*
   - *Kelebihan Utama (Pros)*
   - *Kekurangan / Batasan yang Perlu Diperhatikan (Cons)*
   - *Verdict Nilai Investasi (Value for Money)*
4. **Head-to-Head Battle Scenarios:** Tuliskan panduan skenario nyata:
   - "Pilih [Opsi A] jika Anda memprioritaskan..."
   - "Pilih [Opsi B] jika kebutuhan Anda adalah..."
5. **Objection Buster & Risk Reversal:** Bahas kekhawatiran umum calon pembeli (seperti daya tahan, keaslian, instalasi, dan jaminan garansi resmi) dengan jawaban meyakinkan.
6. **FAQ Pembelian & Logistik:** Sertakan 3-5 FAQ seputar cara pemesanan, pengiriman, dan klaim garansi.
7. **Actionable Commercial CTA:** Tutup dengan panduan langkah pembelian yang mudah diikuti sesuai CTA target.

Tuliskan artikel lengkap sekarang dalam format Markdown yang rapi, transparan, dan persuasif.`
  },
  {
    id: 'tpl-03',
    number: 3,
    name: 'Actionable Step-by-Step How-To & Problem-Solving Tutorial',
    category: 'SEO',
    version: '2.0',
    is_active: true,
    description: 'Prompt tutorial taktis dan panduan solusi langkah demi langkah (How-To) yang mudah dipraktikkan, teroptimasi untuk Google HowTo Schema, listicle featured snippets, troubleshooting anti-gagal, dan instruksi AI.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Judul Panduan How-To', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Target Keyword Tutorial / Cara', required: true, default_source: 'EXCEL' },
      { key: 'supporting_keywords', label: 'Supporting Keywords / LSI', required: false, default_source: 'EXCEL' },
      { key: 'target_audience', label: 'Target Pembaca & Tingkat Keahlian', required: false, default_source: 'DERIVED' },
      { key: 'prerequisites', label: 'Persyaratan & Alat yang Dibutuhkan', required: false, default_source: 'DERIVED' },
      { key: 'step_outline', label: 'Rangkaian Langkah Terstruktur', required: false, default_source: 'DERIVED' },
      { key: 'common_mistakes', label: 'Kesalahan Umum & Cara Menghindarinya', required: false, default_source: 'DERIVED' },
      { key: 'main_questions', label: 'Pertanyaan Penting (FAQ Tutorial)', required: false, default_source: 'DERIVED' },
      { key: 'cta', label: 'Call to Action Solusi Terkait', required: false, default_source: 'EXCEL' },
      { key: 'tone_of_voice', label: 'Tone of Voice', required: false, default_source: 'PROJECT' },
      { key: 'language', label: 'Bahasa Penulisan', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — ACTIONABLE HOW-TO & PROBLEM SOLVING GUIDE (TEMPLATE 03)

Kamu adalah seorang Technical Writer, Instructional Designer, dan Praktisi Lapangan yang berpengalaman. Tugasmu adalah menyusun panduan tutorial langkah demi langkah (How-To / Step-by-Step Guide) yang sangat jelas, bebas kebingungan, mudah dipraktikkan oleh pemula, serta terstruktur sempurna untuk Google HowTo Rich Snippets.

---

## 1. DATA PANDUAN & ALAT

- **Judul Panduan:** {{article_title}}
- **Target Keyword Tutorial:** {{primary_keyword}}
- **Supporting Keywords:** {{supporting_keywords}}
- **Target Pembaca:** {{target_audience}}
- **Prerequisites (Alat, Bahan, & Persiapan Awal):** {{prerequisites}}
- **Rangkaian Langkah Inti:**
{{step_outline}}
- **Kesalahan Fatal yang Sering Terjadi:** {{common_mistakes}}
- **Pertanyaan Sering Ditanyakan (FAQ):** {{main_questions}}
- **Target CTA:** {{cta}}
- **Tone of Voice:** {{tone_of_voice}}
- **Bahasa:** {{language}}

---

## 2. PROTOKOL PENULISAN TUTORIAL TAKTIS

1. **Quick Overview Card:** Buka artikel dengan ringkasan singkat:
   - **Tingkat Kesulitan:** (Pemula / Menengah / Lanjutan)
   - **Estimasi Waktu Pengerjaan:** (Mis. 15-30 Menit)
   - **Hasil Akhir yang Dijamin:** Penjelasan jelas hasil yang akan dicapai pembaca setelah menyelesaikan panduan ini.
2. **Daftar Kebutuhan & Persiapan (Prerequisites Checklist):** Cantumkan peralatan, dokumen, atau kondisi awal yang harus siap sebelum memulai, disajikan dalam bentuk checklist interaktif.
3. **Numbered Step-by-Step Actionable Execution:** Tuliskan setiap tahapan menggunakan format heading H3 bernomor tegas (\`### Langkah 1: [Nama Tindakan]\`, \`### Langkah 2: [Nama Tindakan]\`).
   - Gunakan kalimat instruktif aktif ("Pasang", "Periksa", "Unduh", "Sesuaikan").
   - Sisipkan callout box **[TIPS PRO]** untuk trik mempercepat pengerjaan.
   - Berikan tanda peringatan **[PERHATIAN]** pada titik rawan kesalahan.
4. **Troubleshooting & Penanganan Kendala:** Buat sub-bab khusus mengenai skenario kegagalan: *"Apa yang Harus Dilakukan Jika [X] Tidak Berfungsi?"* dengan 3-4 solusi praktis.
5. **Kesalahan Umum (Common Mistakes to Avoid):** Ulas kesalahan yang kerap dilakukan orang beserta cara pencegahannya.
6. **Rekomendasi HowTo Schema:** Berikan saran penandaan data terstruktur (HowTo Schema) agar memenuhi syarat tampil di Google Search Enhancements.
7. **Next Step & Supportive CTA:** Arahkan pembaca ke langkah lanjutan atau solusi produk/layanan terkait via CTA.

Tuliskan panduan lengkap sekarang dalam format Markdown yang teratur, presisi, dan mudah dieksekusi.`
  },
  {
    id: 'tpl-04',
    number: 4,
    name: 'SEO Content Refresh, Decay Revival & SERP Intent Realignment',
    category: 'SEO',
    version: '2.0',
    is_active: true,
    description: 'Prompt audit dan peremajaan konten lama yang mengalami penurunan peringkat (content decay), traffic drop, atau intent shift di SERP Google. Mengisi celah topik pesaing dan mengkalibrasi ulang angle.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Judul Artikel yang Direfresh', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Target Keyword Utama', required: true, default_source: 'EXCEL' },
      { key: 'supporting_keywords', label: 'Supporting Keywords / Lost Keywords', required: false, default_source: 'EXCEL' },
      { key: 'slug', label: 'URL Slug Lama', required: false, default_source: 'EXCEL' },
      { key: 'existing_content_summary', label: 'Ringkasan Konten Lama & Kelemahannya', required: false, default_source: 'MANUAL' },
      { key: 'detected_serp_intent', label: 'Search Intent SERP Terkini', required: false, default_source: 'DERIVED' },
      { key: 'competitor_angles', label: 'Angle Pesaing Teratas di Halaman 1', required: false, default_source: 'DERIVED' },
      { key: 'content_gaps', label: 'Content Gaps & Entitas yang Hilang', required: false, default_source: 'DERIVED' },
      { key: 'query_fan_out', label: 'Pencarian Baru / Trend Terkini', required: false, default_source: 'DERIVED' },
      { key: 'cta', label: 'Target CTA Baru', required: false, default_source: 'EXCEL' },
      { key: 'tone_of_voice', label: 'Tone of Voice', required: false, default_source: 'PROJECT' },
      { key: 'language', label: 'Bahasa Penulisan', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — CONTENT REFRESH, DECAY REVIVAL & INTENT REALIGNMENT (TEMPLATE 04)

Kamu adalah seorang SEO Content Auditor, SERP Re-Engineering Specialist, dan Algorithmic Recovery Expert. Tugasmu adalah merombak total, memperbarui, dan merevitalisasi artikel lama yang mengalami penurunan trafik (traffic decay) atau tergeser oleh pesaing, agar kembali menduduki peringkat #1 Google dan relevan dengan standar pencarian AI saat ini.

---

## 1. DIAGNOSIS ARTIKEL LAMA & SERP SHIFT

- **Judul Artikel:** {{article_title}}
- **Target Keyword:** {{primary_keyword}}
- **Supporting / Lost Keywords yang Perlu Direbut Kembali:** {{supporting_keywords}}
- **URL Slug:** {{slug}}
- **Kondisi Konten Lama:** {{existing_content_summary}}
- **Analisis Search Intent Terkini:** {{detected_serp_intent}}
- **Angle Unggulan Pesaing Halaman 1:** {{competitor_angles}}
- **Content Gaps & Entitas yang Wajib Ditambahkan:**
{{content_gaps}}
- **Trend & Pertanyaan Pencarian Terbaru:**
{{query_fan_out}}
- **Target CTA:** {{cta}}
- **Tone of Voice:** {{tone_of_voice}}
- **Bahasa:** {{language}}

---

## 2. INSTRUKSI AUDIT & RE-OPTIMASI

1. **Modernized Hook & Fresh Angle:** Buat paragraf pembuka baru yang jauh lebih kuat dengan referensi tahun terkini, menghapus data usang, dan langsung memposisikan konten sebagai panduan paling mutakhir.
2. **Intent Calibration (SERP Alignment):** Sesuaikan kembali format artikel agar 100% selaras dengan tipe hasil yang mendominasi halaman pertama Google saat ini (mis. jika SERP beralih dari sekadar teori ke panduan berbasis perbandingan atau studi kasus).
3. **Closing the Content Gap:** Sisipkan bagian dan sub-bab baru secara mendalam yang secara eksplisit membahas topik-topik yang sebelumnya hilang namun dibahas oleh kompetitor teratas.
4. **Scannability & Format Upgrade:** Ubah blok teks dinding (wall of text) menjadi:
   - Tabel komparasi ringkas
   - Key Takeaways callout box
   - Langkah berurutan yang mudah dipindai
5. **Fresh FAQ Section:** Buat ulang bagian FAQ dengan menjawab query-query baru yang muncul dari AI query fan-out.
6. **Output Final:** Tuliskan seluruh artikel hasil revisi secara lengkap dalam format Markdown, siap ganti (drop-in replacement) di CMS.

Tuliskan artikel hasil pembaruan komprehensif sekarang dalam format Markdown.`
  },
  {
    id: 'tpl-05',
    number: 5,
    name: 'Hyper-Local SEO & Geo-Targeted Commercial Landing Content',
    category: 'Local SEO',
    version: '2.0',
    is_active: true,
    description: 'Prompt khusus konten wilayah dan landing page berbasis lokasi (kota/area layanan) yang menggabungkan Local Intent, Local Trust Signals (NAP), jangkauan logistik, dan konversi cepat WhatsApp/kunjungan showroom.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Judul Konten Lokal', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Keyword Lokal (e.g. Toko X di Kota Y)', required: true, default_source: 'EXCEL' },
      { key: 'target_location', label: 'Lokasi / Kota Target', required: true, default_source: 'PROJECT' },
      { key: 'business_name', label: 'Nama Bisnis / Brand Resmi', required: false, default_source: 'PROJECT' },
      { key: 'service_areas', label: 'Cakupan Wilayah / Kecamatan Terlayani', required: false, default_source: 'DERIVED' },
      { key: 'local_benefits', label: 'Keunggulan Layanan Lokal & Kecepatan', required: false, default_source: 'DERIVED' },
      { key: 'value_propositions', label: 'Jaminan Garansi & Bukti Kepercayaan', required: false, default_source: 'DERIVED' },
      { key: 'cta', label: 'CTA Kontak Lokal (WhatsApp / Telp)', required: false, default_source: 'EXCEL' },
      { key: 'tone_of_voice', label: 'Tone of Voice', required: false, default_source: 'PROJECT' },
      { key: 'language', label: 'Bahasa Penulisan', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — HYPER-LOCAL SEO & GEO-TARGETED LANDING (TEMPLATE 05)

Kamu adalah seorang Local SEO Master, Google Business Profile Specialist, dan Hyper-Local Conversion Copywriter. Tugasmu adalah menulis artikel landing page / pilar lokal yang ditargetkan khusus untuk wilayah {{target_location}} dengan sinyal relevansi geografis (Local GEO) yang kuat, membangun otoritas terpercaya di mata warga lokal, dan mendorong konversi cepat.

---

## 1. PARAMETER LOKAL & BISNIS

- **Judul Artikel:** {{article_title}}
- **Target Keyword Lokal:** {{primary_keyword}}
- **Lokasi Utama Target:** {{target_location}}
- **Nama Bisnis:** {{business_name}}
- **Area & Kecamatan Terlayani:** {{service_areas}}
- **Keunggulan Layanan Lokal:** {{local_benefits}}
- **Garansi & Nilai Kepercayaan:** {{value_propositions}}
- **Call to Action Kontak Cepat:** {{cta}}
- **Tone of Voice:** {{tone_of_voice}}
- **Bahasa:** {{language}}

---

## 2. FORMAT & STRATEGI LOCAL SEO DOMINATION

1. **Local Geo-Hook:** Buka artikel dengan pemahaman mendalam terhadap kondisi dan kebutuhan nyata penduduk atau pebisnis di kawasan {{target_location}} (mis. kemacetan logistik, cuaca lokal, standar gedung, atau kebutuhan suplai mendesak).
2. **Natural Geographic Entity Integration:** Cantumkan nama distrik, kecamatan penting, jalan protokol, dan landmark terkenal di {{target_location}} secara alami tanpa pengulangan kata yang dipaksakan (hindari keyword stuffing).
3. **Logistik, Pengiriman, & Respon Cepat:** Uraikan secara spesifik bagaimana sistem pengiriman atau kunjungan teknisi bekerja di wilayah ini (estimasi tiba di hari yang sama, ongkos kirim hemat/gratis, dan ketersediaan armada lokal).
4. **Bukti Sosial & Pengalaman Portofolio Lokal:** Tuliskan bagian kredibilitas yang menceritakan pengalaman menangani proyek atau melayani pelanggan di kawasan sekitar {{target_location}}.
5. **Local Business NAP & Direct Contact:** Sajikan blok informasi kontak resmi (Nama Bisnis, Alamat Representatif, Jam Operasional, Layanan Konsultasi WhatsApp Cepat) yang selaras dengan Google Business Profile.
6. **Schema LocalBusiness Recommendation:** Cantumkan instruksi schema structured data \`LocalBusiness\` atau \`Service\` yang relevan.
7. **Local Direct Action CTA:** Berikan dorongan tindakan langsung dengan kemudahan konsultasi via WhatsApp / survei lokasi gratis.

Tuliskan artikel konten lokal lengkap sekarang dalam format Markdown yang persuasif dan sarat otoritas wilayah.`
  },
  {
    id: 'tpl-06',
    number: 6,
    name: 'BOFU High-Conversion Solution, Sales Closer & Lead Magnet',
    category: 'SEO',
    version: '2.0',
    is_active: true,
    description: 'Prompt artikel Bottom-of-the-Funnel (BOFU) komersial persuasif berteknik direct-response copywriting untuk mengonversi calon pembeli/klien di tahap akhir pertimbangan menjadi prospek aktif atau transaksi langsung.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input_schema: [
      { key: 'article_title', label: 'Judul Konten BOFU', required: true, default_source: 'EXCEL' },
      { key: 'primary_keyword', label: 'Keyword Transaksional / Jasa / Harga', required: true, default_source: 'EXCEL' },
      { key: 'supporting_keywords', label: 'Supporting Keywords Komersial', required: false, default_source: 'EXCEL' },
      { key: 'target_audience', label: 'Persona Pengambil Keputusan', required: false, default_source: 'DERIVED' },
      { key: 'value_propositions', label: 'Keunggulan Utama & ROI Finansial', required: false, default_source: 'DERIVED' },
      { key: 'objections_handling', label: 'Objection Handling (Mematahkan Keraguan)', required: false, default_source: 'DERIVED' },
      { key: 'pricing_packages', label: 'Skema Harga / Paket Penawaran', required: false, default_source: 'DERIVED' },
      { key: 'cta', label: 'Target CTA Transaksi / Order', required: false, default_source: 'EXCEL' },
      { key: 'tone_of_voice', label: 'Tone of Voice', required: false, default_source: 'PROJECT' },
      { key: 'language', label: 'Bahasa Penulisan', required: true, default_source: 'PROJECT' },
    ],
    template_markdown: `# MASTER PROMPT — BOFU HIGH-CONVERSION SALES CLOSER (TEMPLATE 06)

Kamu adalah seorang Direct-Response Copywriter elit, Commercial Strategist, dan pakar CRO (Conversion Rate Optimization). Tugasmu adalah menyusun artikel Bottom-of-Funnel (BOFU) yang sangat persuasif dan berbobot untuk mengonversi pembaca yang sudah berada di fase evaluasi akhir agar segera mengambil tindakan pembelian atau mengajukan penawaran tanpa ragu.

---

## 1. PARAMETER PENAWARAN & AUDIENS

- **Judul Artikel:** {{article_title}}
- **Target Keyword Transaksional:** {{primary_keyword}}
- **Supporting Keywords:** {{supporting_keywords}}
- **Target Audience:** {{target_audience}}
- **Value Proposition Utama & ROI:** {{value_propositions}}
- **Jawaban atas Keberatan Klien (Objection Handling):** {{objections_handling}}
- **Skema Harga / Pilihan Paket:** {{pricing_packages}}
- **Target CTA Utama:** {{cta}}
- **Tone of Voice:** {{tone_of_voice}}
- **Bahasa:** {{language}}

---

## 2. FORMULA PENULISAN PERSUASIF BOFU

1. **Problem Agitation & Cost of Inaction:** Buka dengan menyorot kerugian biaya, waktu, atau produktivitas yang timbul jika calon klien menunda menyelesaikan masalah ini atau memilih solusi murahan yang tidak andal.
2. **Solusi Definitif & Keunggulan Komparatif:** Jelaskan mengapa solusi ini adalah pilihan paling masuk akal secara finansial dan operasional. Fokus pada hasil nyata (ROI, daya tahan jangka panjang, efisiensi kerja) bukan sekadar daftar fitur teknis.
3. **Pilihan Paket & Transparansi Penawaran:** Sajikan perbandingan paket atau opsi pemesanan dalam tabel yang jelas, memudahkan pembeli memilih opsi yang paling cocok dengan anggaran mereka.
4. **Objection Buster Matrix:** Selesaikan 3 keraguan terbesar klien secara terang-terangan:
   - *"Apakah harganya sebanding?"*
   - *"Bagaimana jika kualitasnya tidak sesuai ekspektasi?"*
   - *"Seberapa cepat proses pengiriman & implementasinya?"*
5. **Risk Reversal (Jaminan Kepuasan):** Sertakan garansi resmi, uji coba, konsultasi gratis tanpa ikatan, atau proteksi pengembalian untuk menghilangkan risiko di pihak pembeli.
6. **Social Proof & Testimonial Context:** Sisipkan narasi ringkas tentang kepuasan klien serupa yang telah membuktikan hasilnya.
7. **Frictionless Urgent CTA:** Akhiri dengan instruksi pemesanan yang sangat mudah (hanya 2-3 langkah) disertai tombol/kontak langsung menuju WhatsApp atau form pemesanan resmi.

Tuliskan artikel penjualan BOFU lengkap sekarang dalam format Markdown yang elegan, profesional, dan bertenaga tinggi.`
  }
];

// Sort templates by number
INITIAL_PROMPT_TEMPLATES.sort((a, b) => a.number - b.number);
