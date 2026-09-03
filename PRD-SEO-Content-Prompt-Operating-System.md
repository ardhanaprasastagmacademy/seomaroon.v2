# PRD — SEO Content & Prompt Operating System

**Version:** 1.0
**Tanggal:** 3 September 2026
**Status:** Ready for Development
**Framework:** Astro + TypeScript
**Database:** Supabase PostgreSQL
**Hosting:** Vercel
**Primary Purpose:** SEO Content Planning, Prompt Building, Prompt Formatting & Export

---

## 1. Product Overview

### 1.1 Nama Produk

**SEO Content & Prompt Operating System**

Nama sementara: **SEO Prompt Studio**

Alternatif branding:
- SEO Content Studio
- SEO Prompt Engine
- SEO Content OS
- SEO Master Builder
- SEO Content Factory

---

## 2. Vision

Membangun platform yang mengubah:

```
Content Calendar → SEO Data → Prompt Template → Auto Fill → Generated Prompt → Markdown / JSON → Export
```

menjadi satu workflow terintegrasi.

Sistem ditujukan untuk membantu:
- SEO specialist
- Content writer
- Content strategist
- Digital marketer
- Agency
- Website owner
- Blogger
- SEO freelancer

menghasilkan prompt SEO secara konsisten berdasarkan content calendar yang sudah direncanakan.

---

## 3. Masalah yang Ingin Diselesaikan

### Workflow Manual Saat Ini

```
Excel Content Calendar
        ↓
Cari artikel
        ↓
Copy judul
        ↓
Copy keyword
        ↓
Copy supporting keyword
        ↓
Buka prompt template
        ↓
Isi placeholder
        ↓
Copy prompt
        ↓
Buka tool lain
        ↓
Paste prompt
        ↓
Convert Markdown / JSON
```

### Masalah

- Terlalu banyak copy-paste
- Rawan kesalahan
- Data tidak konsisten
- Template mudah berubah
- Sulit mengelola puluhan artikel
- Sulit membuat prompt secara bulk
- Sulit menyimpan histori
- Sulit melakukan revisi
- Sulit menggunakan data Excel sebagai database

---

## 4. Solution

Aplikasi akan mengubah workflow menjadi:

```
IMPORT EXCEL
     ↓
CONTENT CALENDAR
     ↓
SELECT ARTICLE
     ↓
SELECT SEO PROMPT TEMPLATE
     ↓
AUTO MAPPING
     ↓
AUTO FILL FORM
     ↓
OPTIONAL AI DERIVED FIELDS
     ↓
REVIEW
     ↓
GENERATE PROMPT
     ↓
PROMPT OBJECT
     ↓
FORMATTER
     ↓
┌────────┬────────┬────────┬───────┐
│ .MD    │ .JSON  │ .YAML  │ .TXT  │
└────────┴────────┴────────┴───────┘
     ↓
COPY / DOWNLOAD / SAVE
```

---

## 5. Product Goals

### Primary Goals

1. Import content calendar dari Excel.
2. Membaca sheet tertentu secara otomatis.
3. Menyimpan data Excel ke Supabase.
4. Menampilkan content calendar dalam UI.
5. Memilih artikel dari calendar.
6. Memilih prompt template.
7. Mendeteksi field input template.
8. Mapping data calendar ke placeholder prompt.
9. Mengisi form secara otomatis.
10. Memungkinkan override manual.
11. Generate prompt tanpa mengubah struktur template.
12. Menyimpan generated prompt.
13. Convert prompt ke Markdown/JSON/YAML/TXT.
14. Download hasil.
15. Mendukung bulk generation.
16. Menyediakan histori.

---

## 6. Non-Goals MVP

Untuk versi pertama jangan terlalu banyak memasukkan fitur.

**Tidak wajib:**
- SEO rank tracker
- Google Search Console integration
- Ahrefs integration
- Semrush integration
- Backlink monitoring
- Website crawler
- Automatic article publishing
- WordPress publishing
- Social media posting
- AI article generator penuh

**Fokus:**

```
Content Calendar → Prompt → Formatter → Export
```

---

## 7. Target User

| Persona | Deskripsi |
|---|---|
| **Persona 1 — SEO Specialist** | Membutuhkan prompt artikel yang konsisten berdasarkan keyword dan search intent. |
| **Persona 2 — Content Writer** | Menerima prompt siap pakai tanpa harus mengolah data Excel. |
| **Persona 3 — SEO Agency** | Membuat puluhan/ratusan prompt untuk berbagai project. |
| **Persona 4 — Website Owner** | Tidak memahami prompt engineering tetapi memiliki content calendar. |

---

## 8. Information Architecture

```
SEO PROMPT STUDIO
│
├── Dashboard
│
├── Projects
│   └── Project Detail
│
├── Content Calendar
│
├── Prompt Builder
│
├── Prompt Templates
│
├── Prompt Formatter
│
├── Generated Prompts
│
├── Bulk Generator
│
└── Settings
```

---

## 9. Dashboard

Dashboard adalah halaman utama setelah login.

### Components

**Project Overview**
- Projects: 3
- Total Content: 90
- Generated Prompts: 47
- Active Templates: 37

**Content Status** (contoh)

| Status | Jumlah |
|---|---|
| Published | 35 |
| Draft | 25 |
| Ready | 20 |
| Generated | 10 |

**Recent Activity** (contoh)

- 03 Sep 2026 — Generated Prompt: "10 Kursi Kantor Ergonomis..."
- 03 Sep 2026 — Imported Calendar: 90 content items
- 02 Sep 2026 — Updated Template 04

---

## 10. Project Management

User dapat membuat beberapa project.

Contoh:
```
Project
├── Perlengkapan Kantor
├── Kontraktor Bangunan
├── Seminar Kit
└── Website Travel
```

Setiap project memiliki data terpisah.

---

## 11. Project Structure

```
Project
│
├── Project Information
├── Content Calendar
├── Prompt Templates
├── Generated Prompts
├── Formatter History
└── Import History
```

---

## 12. Project Information

**Field:**
- Project Name
- Website URL
- Business Name
- Industry
- Description
- Primary Location
- Language
- Default Tone
- Default CTA

**Contoh:**
- Project Name: Perlengkapan Kantor
- Website: example.com
- Industry: Office Furniture
- Language: Indonesia
- Tone: Professional

---

## 13. Excel Importer

Ini merupakan salah satu fitur inti.

**Supported File**
- .xlsx
- .xls
- .csv

**Prioritas MVP:** `.xlsx`

---

## 14. Excel Import Flow

```
Upload Excel
     ↓
Read Workbook
     ↓
Show Available Sheets
     ↓
Select Sheet
     ↓
Preview Data
     ↓
Column Detection
     ↓
Column Mapping
     ↓
Validation
     ↓
Import
     ↓
Supabase
```

---

## 15. Default Sheet

Sistem akan mencoba mendeteksi: **"Kalender Konten 30 Hari"**

Workbook saat ini memiliki sheet:
- Dashboard
- Keyword Mapping
- Kalender Konten 30 Hari
- Internal Link Architecture
- Template Brief Konten
- Kalender Sosial Media
- SOP & GEO Checklist
- Template Brief Konten (Kosong)

**Untuk MVP:** Fokus utama import ke **Kalender Konten 30 Hari**.

Struktur ini berasal dari workbook yang diupload.

---

## 16. Column Mapping

Kolom kalender:
- Hari
- Slot Waktu
- Content Cluster
- Judul Artikel (SEO/GEO Optimized)
- Target Keyword Utama
- Keyword Sekunder / LSI
- Search Volume
- Tingkat Kompetisi
- Journey Stage
- Format Konten & Elemen GEO
- Target CTA Konversi
- URL Slug
- Status

**Mapping sistem:**

| Excel | Database |
|---|---|
| Hari | `day` |
| Slot Waktu | `time_slot` |
| Content Cluster | `content_cluster` |
| Judul Artikel | `title` |
| Target Keyword Utama | `primary_keyword` |
| Keyword Sekunder / LSI | `secondary_keywords` |
| Search Volume | `search_volume` |
| Tingkat Kompetisi | `competition` |
| Journey Stage | `journey_stage` |
| Format Konten | `content_format` |
| Target CTA Konversi | `cta` |
| URL Slug | `slug` |
| Status | `status` |

---

## 17. Content Calendar UI

```
CONTENT CALENDAR

[Import Excel] [Add Content] [Bulk Generate]

Filter:
[All Days] [Cluster] [Journey] [Status]

Search:
[ Search article... ]

-------------------------------------------------------
Hari | Artikel | Keyword | Journey | CTA | Status
-------------------------------------------------------
01   | Kursi...| kursi...| TOFU    | WA  | Published
01   | Mesin...| mesin...| MOFU    | PDF | Published
01   | Paket...| paket...| BOFU    | Buy | Published
-------------------------------------------------------
```

---

## 18. Article Detail

Ketika user klik artikel:

> **10 Kursi Kantor Ergonomis Terbaik untuk Sakit Pinggang [2026]**

Tampilkan:

**SEO Information**
- Primary Keyword: `kursi ergonomis terbaik`
- Secondary Keywords: `kursi jaring ergonomis`, `harga kursi kerja sehat`
- Search Volume: `> 5,000`
- Competition: `Menengah`

**Content Strategy**
- Journey: `TOFU`
- Content Format: `Featured Snippet + Table`
- CTA: `Konsultasi Ergonomi via WA`

Data contoh tersebut berasal langsung dari calendar yang diupload.

---

## 19. Prompt Template Library

Template terdiri dari: `04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 38, 39`

Sistem harus dapat diperluas sampai: `40`

---

## 20. Template Category

**Filter:** Semua, SEO, News, YouTube, Social

Namun karena produk fokus SEO, default: **SEO**

---

## 21. Template Card

```
┌─────────────────────────────────────────┐
│ 04                                      │
│ Turunan 3 Penulisan Artikel SEO AEO... │
│                                         │
│ Category: SEO                           │
│ Version: 1.0                            │
│                                         │
│ [Use Template] [Preview]               │
└─────────────────────────────────────────┘
```

---

## 22. Template Search

Search berdasarkan: nomor, nama, kategori, keyword, deskripsi

**Contoh:**
- `"local"` → Template 11
- `"ecommerce"` → Template 15
- `"refresh"` → Template 05 / 39

---

## 23. Template Storage

Setiap template disimpan sebagai `template_markdown`.

Contoh:

```markdown
# MASTER PROMPT

## INPUT

Judul Artikel:
{{article_title}}

Target Keyword:
{{primary_keyword}}

...
```

Isi template harus dipertahankan 100%.

---

## 24. Placeholder Engine

Sistem otomatis mendeteksi placeholder.

Contoh:
```
{{article_title}}
{{primary_keyword}}
{{supporting_keywords}}
{{slug}}
{{search_intent}}
```

Engine menghasilkan:

```json
{
  "article_title": {
    "label": "Judul Artikel",
    "required": true
  }
}
```

---

## 25. Prompt Builder

```
Select Template
       ↓
Detect INPUT
       ↓
Load Article Data
       ↓
Auto Mapping
       ↓
Generate Form
```

---

## 26. Field Form

Field dasar:
- Judul Artikel
- Target Keyword
- Supporting Keywords
- URL Slug
- Tipe Konten
- Estimasi Panjang
- Intent Utama
- Funnel Stage
- Target Audience
- Pertanyaan Utama
- Query Fan-Out
- Outline H1-H3
- CTA Utama
- Internal Links Keluar
- Schema Wajib
- Data / Statistik
- Sumber yang Akan Dikutip
- Tone of Voice
- Bahasa

---

## 27. Field Source System

Setiap field memiliki source: `EXCEL`, `AI`, `PROJECT`, `MANUAL`, `DERIVED`

**Contoh:**

| Field | Source |
|---|---|
| Judul Artikel | EXCEL |
| Target Keyword | EXCEL |
| Search Intent | DERIVED |
| Target Audience | AI |
| Tone | PROJECT |

UI dapat memberikan badge: **AUTO** atau **MANUAL**

---

## 28. Auto Mapping

Mapping utama:
- Excel title → `{{article_title}}`
- Excel primary keyword → `{{primary_keyword}}`
- Excel secondary keywords → `{{supporting_keywords}}`
- Excel slug → `{{slug}}`
- Excel journey → `{{funnel_stage}}`
- Excel CTA → `{{cta}}`

---

## 29. Derived Data

Data yang belum ada di Excel dapat dihasilkan.

Contoh: `keyword + title + journey → Search Intent` → hasil: **Informational** atau **Commercial**

---

## 30. Query Fan-Out

Sistem dapat membuat minimal 5 pertanyaan.

Contoh:
1. Apa kursi ergonomis terbaik?
2. Bagaimana memilih kursi ergonomis?
3. Apa manfaat kursi ergonomis?
4. Berapa harga kursi ergonomis?
5. Kursi ergonomis cocok untuk siapa?

User tetap dapat mengedit hasil tersebut.

---

## 31. Target Audience

AI/logic menghasilkan berdasarkan: `Industry + Keyword + Content Cluster + Journey Stage`

---

## 32. Outline Generator

Generate:
```
H1
H2
H2
  H3
  H3
H2
  H3
H2
FAQ
```

User dapat mengedit outline sebelum generate prompt.

---

## 33. Schema Recommendation

Rule-based recommendation.

Contoh: `Article`, `FAQ`, `BreadcrumbList`, `Organization`, `LocalBusiness`, `Product`, `Service`

Sistem tidak boleh memaksakan schema jika tidak sesuai konten.

---

## 34. Internal Link Engine

Jika data Internal Link Architecture nantinya di-import, sistem dapat mencari:

```
Current Article
       ↓
Related Cluster
       ↓
Relevant Articles
```

Output — Recommended Internal Links:
1. `/blog/kursi-kantor-ergonomis`
2. `/blog/meja-kantor-minimalis`
3. `/blog/tips-memilih-kursi-kantor`

Ini dapat menjadi fase berikutnya karena workbook juga memiliki sheet Internal Link Architecture.

---

## 35. Prompt Generation Engine

Setelah form lengkap:

```
Template + Input Data = Generated Prompt
```

Engine melakukan **string replacement**, bukan rewrite.

Contoh: `{{article_title}}` diganti dengan `10 Kursi Kantor Ergonomis Terbaik...`

---

## 36. Critical Requirement

> **Template harus immutable.**

Sistem **DILARANG**:
- Mengubah heading
- Mengubah urutan
- Mengubah instruksi
- Menghapus kalimat
- Merapikan Markdown secara otomatis
- Mengubah placeholder yang tidak memiliki data

Jika data kosong, `{{statistics}}` tetap `{{statistics}}` sesuai requirement.

---

## 37. Generated Prompt Preview

```
┌──────────────────────────────────────┐
│ Generated Markdown                   │
├──────────────────────────────────────┤
│ # MASTER PROMPT                      │
│                                      │
│ ## INPUT                             │
│                                      │
│ Judul Artikel:                       │
│ 10 Kursi Kantor Ergonomis...         │
│                                      │
│ Target Keyword:                      │
│ kursi ergonomis terbaik              │
│                                      │
│ ...                                  │
└──────────────────────────────────────┘

[Copy] [Download .md] [Send to Formatter]
```

---

## 38. Prompt Object

Setelah generate, sistem membuat object:

```json
{
  "template_id": "04",
  "project_id": "...",
  "content_id": "...",
  "variables": {},
  "markdown": "...",
  "created_at": "..."
}
```

Ini memungkinkan prompt langsung dikirim ke Formatter tanpa copy-paste.

---

## 39. Prompt Formatter

**Route:** `/formatter`

**Input:**
- Paste Markdown
- atau Upload `.md`
- atau Open Generated Prompt

---

## 40. Format Output (MVP)

- Markdown (`.md`)
- JSON (`.json`)
- TXT (`.txt`)
- YAML (`.yaml`)

---

## 41. JSON Mode

Sediakan dua mode:

**RAW**
```json
{
  "prompt": "# MASTER PROMPT..."
}
```

**STRUCTURED**
```json
{
  "metadata": {},
  "input": {},
  "instructions": [],
  "output": {},
  "constraints": []
}
```

---

## 42. Bulk Generator

Fitur sangat penting karena Excel berisi banyak artikel.

User dapat memilih:
```
☑ Hari 01
☑ Hari 02
☑ Hari 03
```
atau `☑ Semua`

kemudian pilih Template (mis. `04 - SEO Article`) dan klik **Generate 90 Prompts**.

---

## 43. Bulk Output

Sistem menghasilkan `SEO-Prompts.zip`:
```
├── 001-kursi-ergonomis.md
├── 002-penghancur-kertas.md
├── 003-paket-meja-kursi.md
├── ...
└── 090-....md
```

Alternatif: `seo-prompts.json`

---

## 44. History

Simpan: Generated Prompt, Template, Article, Version, Created At

User dapat: **View, Copy, Download, Regenerate, Delete**

---

## 45. Template Versioning

Ini sangat penting.

Template `04` versi `1.0` → berubah menjadi versi `1.1`.

Generated prompt lama tetap menggunakan template versi lama. **Jangan overwrite histori.**

---

## 46. Database Schema

### `projects`
```
id UUID PK
user_id UUID
name TEXT
website_url TEXT
business_name TEXT
industry TEXT
description TEXT
default_language TEXT
default_tone TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

### `content_calendar`
```
id UUID PK
project_id UUID
day TEXT
time_slot TEXT
content_cluster TEXT
title TEXT
primary_keyword TEXT
secondary_keywords TEXT
search_volume TEXT
competition TEXT
journey_stage TEXT
content_format TEXT
cta TEXT
slug TEXT
status TEXT
source_import_id UUID
created_at TIMESTAMP
updated_at TIMESTAMP
```

### `prompt_templates`
```
id UUID PK
number INTEGER
name TEXT
category TEXT
description TEXT
template_markdown TEXT
input_schema JSONB
version TEXT
is_active BOOLEAN
created_at TIMESTAMP
updated_at TIMESTAMP
```

### `generated_prompts`
```
id UUID PK
project_id UUID
content_id UUID
template_id UUID
template_version TEXT
input_data JSONB
generated_markdown TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

### `imports`
```
id UUID PK
project_id UUID
filename TEXT
sheet_name TEXT
row_count INTEGER
status TEXT
error_log JSONB
created_at TIMESTAMP
```

### `exports`
```
id UUID PK
project_id UUID
generated_prompt_id UUID
format TEXT
filename TEXT
created_at TIMESTAMP
```

---

## 47. Supabase Security

Gunakan **Row Level Security (RLS)**.

Rule: `user_id = auth.uid()`

User hanya dapat:
- Melihat project miliknya
- Mengedit project miliknya
- Melihat content miliknya
- Melihat generated prompt miliknya

---

## 48. Authentication

**MVP:** Email + Password

Kemudian dapat dikembangkan: Google, GitHub, Magic Link

---

## 49. Storage

Supabase Storage: `/project/{project_id}/imports/`

Untuk: Excel asli, generated ZIP, exported files

---

## 50. Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Astro, TypeScript, Tailwind CSS |
| Backend | Astro Server, Supabase |
| Database | PostgreSQL |
| Excel | SheetJS |
| Validation | Zod |
| Markdown | remark / unified |

---

## 51. Kenapa Astro?

- Ringan
- Bagus untuk SEO
- TypeScript support
- Server endpoints
- Cocok untuk dashboard + static/public pages
- Bisa menggunakan interactive islands
- Deployment mudah ke Vercel

---

## 52. Kenapa Supabase?

Karena project membutuhkan **PostgreSQL + Auth + Storage + RLS + API** tanpa harus membangun backend authentication dari nol.

---

## 53. Frontend Architecture

```
src/
│
├── pages/
│   ├── index.astro
│   ├── dashboard/
│   ├── projects/
│   ├── calendar/
│   ├── prompt-builder/
│   ├── templates/
│   ├── formatter/
│   └── history/
│
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── calendar/
│   ├── prompt/
│   ├── formatter/
│   └── ui/
│
├── lib/
│   ├── supabase/
│   ├── excel/
│   ├── prompt-engine/
│   ├── formatter/
│   └── validation/
│
└── types/
```

---

## 54. Prompt Engine Architecture

```
Prompt Template
      ↓
Placeholder Detector
      ↓
Input Schema
      ↓
Data Mapper
      ↓
Validation
      ↓
Variable Resolver
      ↓
Template Renderer
      ↓
Generated Markdown
```

---

## 55. Variable Resolver

Prioritas data:

```
MANUAL OVERRIDE
      ↓
EXCEL / DATABASE
      ↓
PROJECT DEFAULT
      ↓
DERIVED
      ↓
PLACEHOLDER
```

Contoh: User mengubah Tone = `Professional`, walaupun default project `Friendly`, maka `Professional` yang digunakan.

---

## 56. Empty Field Rule

Jika field tidak tersedia, `{{field}}` tetap dipertahankan.

Contoh:
```
Sumber:
{{sources}}
```

Jangan otomatis menjadi `Sumber: Tidak tersedia` karena akan merusak template.

---

## 57. UI/UX Style

Desain: **Modern SaaS SEO Tool**

Karakter: clean, profesional, minimal, information dense, desktop-first, responsive, tidak terlalu banyak dekorasi

---

## 58. Color System

| Nama | Hex |
|---|---|
| Background | `#F8FAFC` |
| Surface | `#FFFFFF` |
| Primary | `#2563EB` |
| Text | `#0F172A` |
| Secondary | `#64748B` |
| Border | `#E2E8F0` |
| Success | `#16A34A` |
| Warning | `#F59E0B` |
| Danger | `#DC2626` |

Tidak perlu menggunakan terlalu banyak warna.

---

## 59. Layout

**Desktop:**
```
┌───────────────────────────────────────────────────┐
│ LOGO                         Search    User        │
├───────────────┬───────────────────────────────────┤
│               │                                   │
│ Dashboard     │                                   │
│ Projects      │          MAIN CONTENT             │
│ Calendar      │                                   │
│ Prompt        │                                   │
│ Templates     │                                   │
│ Formatter     │                                   │
│ History       │                                   │
│               │                                   │
└───────────────┴───────────────────────────────────┘
```

---

## 60. Prompt Builder UI

**3-column layout:**
```
┌──────────────┬────────────────────┬────────────────────┐
│ Template     │ Input Form         │ Markdown Preview   │
│              │                    │                    │
│ 04           │ Judul              │ # MASTER PROMPT    │
│ 05           │ Keyword            │                    │
│ 06           │ LSI                │ ## INPUT           │
│ ...          │ CTA                │                    │
│              │                    │                    │
└──────────────┴────────────────────┴────────────────────┘
```

Desktop sangat cocok.

**Mobile:** `Template → Input → Preview`

---

## 61. User Flow Utama

```
LOGIN
 ↓
DASHBOARD
 ↓
CREATE PROJECT
 ↓
IMPORT EXCEL
 ↓
SELECT SHEET
 ↓
IMPORT CALENDAR
 ↓
CONTENT CALENDAR
 ↓
SELECT ARTICLE
 ↓
PROMPT BUILDER
 ↓
SELECT TEMPLATE
 ↓
AUTO FILL
 ↓
REVIEW
 ↓
GENERATE
 ↓
PREVIEW
 ↓
SAVE
 ↓
COPY / DOWNLOAD
```

---

## 62. Secondary Flow

```
Generated Prompt
      ↓
Send to Formatter
      ↓
Detect Markdown
      ↓
Select JSON
      ↓
Generate
      ↓
Download JSON
```

---

## 63. Bulk Flow

```
Content Calendar
      ↓
Select Multiple
      ↓
Select Template
      ↓
Validate
      ↓
Generate
      ↓
Progress
      ↓
Completed
      ↓
ZIP
```

---

## 64. Error Handling

Jika Excel tidak memiliki sheet: `Sheet "Kalender Konten 30 Hari" tidak ditemukan.`

Jika kolom tidak ditemukan: `Target Keyword Utama belum terdeteksi.`

User diberikan opsi **Manual Mapping**.

---

## 65. Validation

Sebelum generate, Required Fields:
- ✓ Judul Artikel
- ✓ Target Keyword
- ✓ Template
- ✓ Bahasa

Jika kosong: Generate disabled. Field optional tetap boleh kosong.

---

## 66. Import Preview

Sebelum menyimpan:
```
Found 90 rows
Valid: 88
Warning: 2
Errors: 0
```

User harus mengkonfirmasi: **Import 90 Content Items**

---

## 67. Performance Requirement

- First Load < 2.5 sec untuk dashboard sederhana
- Table pagination
- Lazy loading
- Debounced search
- Jangan render 90+ artikel sekaligus jika tidak diperlukan
- Bulk generation menggunakan queue/progress

---

## 68. SEO Website Itu Sendiri

Karena produk ini fokus SEO, website publiknya juga harus SEO-friendly.

**Public pages:**
```
/
/features
/seo-prompt-builder
/content-calendar
/seo-tools
/templates
/blog
/pricing
```

Setiap halaman memiliki: title, meta description, canonical, OG tags, Twitter/X cards, sitemap, robots.txt, semantic HTML, structured data.

---

## 69. Public SEO Strategy

Target keyword contoh:
- SEO prompt generator
- SEO prompt builder
- prompt artikel SEO
- template prompt SEO
- SEO content planner
- SEO content calendar
- AI SEO prompt
- prompt artikel SEO AEO GEO

---

## 70. Accessibility

Minimal: keyboard navigation, visible focus, semantic labels, sufficient contrast, screen reader-friendly, tooltip tidak menjadi satu-satunya sumber informasi.

---

## 71. Backup & Data Safety

Generated prompt tidak boleh hilang ketika browser refresh. Semua generated prompt disimpan ke database. Draft juga dapat disimpan (**Auto Save Draft**).

---

## 72. Draft System

User sedang mengisi Template 04, kemudian keluar. Saat kembali: **Resume Draft**.

Data: `draft_input JSONB`

---

## 73. Versioning Generated Prompt

Contoh:
- Prompt #1 → Template 04 v1.0
- Prompt #2 → Template 04 v1.1

Generated prompt lama tidak diubah.

---

## 74. Export Naming

Format: `{slug}.md`, `{slug}.json`, `{slug}.yaml`, `{slug}.txt`

Contoh: `10-kursi-kantor-ergonomis-terbaik.md`

---

## 75. File Naming Bulk

```
001-10-kursi-kantor-ergonomis-terbaik.md
002-rekomendasi-penghancur-kertas.md
003-paket-hemat-meja-kursi.md
```

---

## 76. Future Phase — AI SEO Assistant

Setelah MVP stabil, tambahkan AI SEO Assistant dengan kemampuan:
- Search intent analysis
- Query fan-out
- Content gap
- Outline
- Title suggestions
- Meta description
- FAQ
- Entity suggestions
- Schema recommendations
- Internal link recommendations

---

## 77. Future Phase — SEO Content Intelligence

Tambahkan:
- Keyword Opportunity Score
- Content Priority Score
- Search Intent Score
- Conversion Potential
- Topical Authority
- Content Gap

Dashboard contoh:
```
SEO Opportunity        ████████░░ 82%
Content Coverage       ███████░░░ 74%
Commercial Coverage    ████████░░ 80%
```

---

## 78. Future Phase — Google Integration

Kemudian dapat dikembangkan: Google Search Console, Google Analytics.

Untuk: clicks, impressions, CTR, average position, landing page performance.

**Tetapi jangan masuk MVP.**

---

## 79. Future Phase — AI Search

Karena prompt sudah memiliki AEO/GEO, nantinya dapat dibuat **AI Search Optimization** dengan: query fan-out, entity coverage, answerability, citation readiness, source quality, topical authority.

---

## 80. MVP Acceptance Criteria

Project dianggap berhasil apabila user dapat:

| Kode | Kriteria |
|---|---|
| AC-01 | Membuat project. |
| AC-02 | Upload `.xlsx`. |
| AC-03 | Melihat daftar sheet. |
| AC-04 | Memilih "Kalender Konten 30 Hari". |
| AC-05 | Melihat 90 artikel. |
| AC-06 | Memilih satu artikel. |
| AC-07 | Memilih Template 04–40. |
| AC-08 | Sistem mendeteksi placeholder. |
| AC-09 | Field yang tersedia otomatis terisi. |
| AC-10 | Field manual dapat diedit. |
| AC-11 | Template tidak berubah strukturnya. |
| AC-12 | Placeholder kosong tetap dipertahankan. |
| AC-13 | Generate Markdown berhasil. |
| AC-14 | Hasil dapat dicopy. |
| AC-15 | Hasil dapat didownload `.md`. |
| AC-16 | Hasil dapat dikirim ke Formatter. |
| AC-17 | Formatter dapat menghasilkan `.json`. |
| AC-18 | Formatter dapat menghasilkan `.txt`. |
| AC-19 | Generated prompt tersimpan. |
| AC-20 | User dapat membuka histori. |
| AC-21 | Bulk generation dapat menghasilkan ZIP. |

---

## 81. Development Phase

| Phase | Konten |
|---|---|
| **Phase 1 — Foundation** | Astro, Supabase, Auth, Database, Layout |
| **Phase 2 — Excel** | Upload, Sheet detection, Preview, Mapping, Import |
| **Phase 3 — Calendar** | Calendar table, Search, Filter, Article detail |
| **Phase 4 — Prompt Templates** | Template CRUD, Template library, Placeholder detection |
| **Phase 5 — Prompt Builder** | Auto mapping, Form, Manual override, Preview, Generation |
| **Phase 6 — Formatter** | Markdown, JSON, YAML, TXT |
| **Phase 7 — Export** | Copy, Download, ZIP |
| **Phase 8 — History** | Generated prompts, Versioning, Draft |
| **Phase 9 — AI** | Intent, Fan-out, Outline, Audience, Schema |

---

## 82. Prioritas Fitur

| Fitur | Prioritas |
|---|---|
| Authentication | P0 |
| Project | P0 |
| Excel Import | P0 |
| Calendar | P0 |
| Template 04–40 | P0 |
| Auto Mapping | P0 |
| Prompt Builder | P0 |
| Markdown Generation | P0 |
| Copy | P0 |
| Download | P0 |
| Formatter | P0 |
| JSON | P0 |
| History | P1 |
| Bulk Generate | P1 |
| ZIP | P1 |
| AI Derived Fields | P1 |
| Internal Link Engine | P2 |
| GSC | P3 |
| AI Search Analytics | P3 |

---

## 83. Konsep Teknis Terpenting

> **Excel bukan database utama.**

- Excel = **IMPORT SOURCE**
- Supabase = **SOURCE OF TRUTH**

Sehingga alurnya:
```
Excel
 ↓
Parser
 ↓
Supabase
 ↓
Application
```

**Bukan:**
```
Excel
 ↓
setiap kali aplikasi dibuka
 ↓
parse lagi
```

Ini akan jauh lebih scalable.

---

## 84. Arsitektur Final

```
                         USER
                           │
                           ▼
                    ┌─────────────┐
                    │    ASTRO    │
                    │  Frontend   │
                    └──────┬──────┘
                           │
                ┌──────────┼──────────┐
                ▼          ▼          ▼
            Calendar    Builder    Formatter
                │          │          │
                └──────────┼──────────┘
                           ▼
                    ASTRO SERVER
                           │
             ┌─────────────┼──────────────┐
             ▼             ▼              ▼
          Supabase      Excel Parser     AI API
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
      Auth   DB   Storage
             │
             ▼
       Prompt Engine
             │
             ▼
      Generated Prompt
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
      MD    JSON   YAML
```

---

## 85. End-to-End Contoh

User memilih:

> **10 Kursi Kantor Ergonomis Terbaik untuk Sakit Pinggang [2026]**

**Data dari Excel:**
- Keyword: `kursi ergonomis terbaik`
- Supporting: `kursi jaring ergonomis`, `harga kursi kerja sehat`
- Volume: `> 5,000`
- Competition: `Menengah`
- Journey: `TOFU`
- CTA: `Konsultasi Ergonomi via WA`
- Slug: `/blog/10-kursi-kantor-ergonomis-terbaik`

**Kemudian:**
```
Template 04
       ↓
Auto Mapping
       ↓
Form terisi
       ↓
AI/Derived Fields
       ↓
Review
       ↓
Generate
```

**Output:** `generated_prompt.md`

Kemudian klik **Send to Formatter** — Formatter menerima Prompt Object yang sama.

User memilih **JSON** → Output: `generated_prompt.json`

Jadi tidak ada copy-paste sama sekali jika user menggunakan workflow terintegrasi.

---

## 86. Kesimpulan Produk

Filosofi produk:

> **"One Content Calendar → One Source of Truth → Many SEO Prompts → Many Output Formats."**

Bukan: Excel reader + prompt generator + converter yang berdiri sendiri.

Tetapi satu sistem:

```
             SEO CONTENT OS
                   │
          ┌────────┴────────┐
          ↓                 ↓
   CONTENT CALENDAR    PROMPT LIBRARY
          │                 │
          └────────┬────────┘
                   ↓
             PROMPT BUILDER
                   │
                   ↓
             PROMPT OBJECT
                   │
          ┌────────┼─────────┐
          ↓        ↓         ↓
         .MD      .JSON     .YAML
          │        │         │
          └────────┼─────────┘
                   ↓
                EXPORT
```

Untuk MVP, sangat disarankan jangan langsung memasukkan semua fitur SEO seperti GSC, rank tracker, competitor analysis, dan AI research. Bangun dulu inti yang paling unik dari project ini: **Excel Content Calendar → Auto Mapping → Template 04–40 → Prompt Generator → Formatter → Export**. Setelah pipeline ini stabil, fitur SEO intelligence bisa ditambahkan di atasnya tanpa perlu mengubah fondasi database.

Dan karena workbook sudah memiliki bukan hanya kalender tetapi juga Keyword Mapping, Internal Link Architecture, Template Brief Konten, Kalender Sosial Media, dan SOP & GEO Checklist, struktur database sebaiknya dari awal dibuat cukup fleksibel untuk mengakomodasi sheet-sheet tersebut pada Phase 2, bukan hanya mengunci aplikasi pada satu sheet kalender.
