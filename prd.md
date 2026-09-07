PRD — SEO CONTENT & PROMPT OPERATING SYSTEM

Version: 1.0
Tanggal: 3 September 2026
Status: Ready for Development
Framework: Astro + TypeScript
Database: Supabase PostgreSQL
Hosting: Vercel
Primary Purpose: SEO Content Planning, Prompt Building, Prompt Formatting & Export

1. PRODUCT OVERVIEW
1.1 Nama Produk
SEO Content & Prompt Operating System

Nama sementara:

SEO Prompt Studio

Alternatif branding:

SEO Content Studio
SEO Prompt Engine
SEO Content OS
SEO Master Builder
SEO Content Factory
2. VISION

Membangun platform yang mengubah:

Content Calendar → SEO Data → Prompt Template → Auto Fill → Generated Prompt → Markdown / JSON → Export

menjadi satu workflow terintegrasi.

Sistem ditujukan untuk membantu:

SEO specialist
Content writer
content strategist
digital marketer
agency
website owner
blogger
SEO freelancer

menghasilkan prompt SEO secara konsisten berdasarkan content calendar yang sudah direncanakan.

3. MASALAH YANG INGIN DISELESAIKAN

Workflow manual saat ini:

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

Masalah:

terlalu banyak copy-paste
rawan kesalahan
data tidak konsisten
template mudah berubah
sulit mengelola puluhan artikel
sulit membuat prompt secara bulk
sulit menyimpan histori
sulit melakukan revisi
sulit menggunakan data Excel sebagai database
4. SOLUTION

Aplikasi akan mengubah workflow menjadi:

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
5. PRODUCT GOALS
Primary Goals
Import content calendar dari Excel.
Membaca sheet tertentu secara otomatis.
Menyimpan data Excel ke Supabase.
Menampilkan content calendar dalam UI.
Memilih artikel dari calendar.
Memilih prompt template.
Mendeteksi field input template.
Mapping data calendar ke placeholder prompt.
Mengisi form secara otomatis.
Memungkinkan override manual.
Generate prompt tanpa mengubah struktur template.
Menyimpan generated prompt.
Convert prompt ke Markdown/JSON/YAML/TXT.
Download hasil.
Mendukung bulk generation.
Menyediakan histori.
6. NON-GOALS MVP

Untuk versi pertama jangan terlalu banyak memasukkan fitur.

Tidak wajib:

SEO rank tracker
Google Search Console integration
Ahrefs integration
Semrush integration
backlink monitoring
website crawler
automatic article publishing
WordPress publishing
social media posting
AI article generator penuh

Fokus:

Content Calendar → Prompt → Formatter → Export

7. TARGET USER
Persona 1 — SEO Specialist

Membutuhkan prompt artikel yang konsisten berdasarkan keyword dan search intent.

Persona 2 — Content Writer

Menerima prompt siap pakai tanpa harus mengolah data Excel.

Persona 3 — SEO Agency

Membuat puluhan/ratusan prompt untuk berbagai project.

Persona 4 — Website Owner

Tidak memahami prompt engineering tetapi memiliki content calendar.

8. INFORMATION ARCHITECTURE
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
9. DASHBOARD

Dashboard adalah halaman utama setelah login.

Components
Project Overview
Projects
3
Content
Total Content
90
Prompts
Generated Prompts
47
Templates
Active Templates
37
Content Status

Contoh:

Published       35
Draft           25
Ready           20
Generated       10
Recent Activity
03 Sep 2026
Generated Prompt
10 Kursi Kantor Ergonomis...

03 Sep 2026
Imported Calendar
90 content items

02 Sep 2026
Updated Template 04
10. PROJECT MANAGEMENT

User dapat membuat beberapa project.

Contoh:

Project
├── Perlengkapan Kantor
├── Kontraktor Bangunan
├── Seminar Kit
└── Website Travel

Setiap project memiliki data terpisah.

11. PROJECT STRUCTURE
Project
│
├── Project Information
├── Content Calendar
├── Prompt Templates
├── Generated Prompts
├── Formatter History
└── Import History
12. PROJECT INFORMATION

Field:

Project Name
Website URL
Business Name
Industry
Description
Primary Location
Language
Default Tone
Default CTA

Contoh:

Project Name:
Perlengkapan Kantor

Website:
example.com

Industry:
Office Furniture

Language:
Indonesia

Tone:
Professional
13. EXCEL IMPORTER

Ini merupakan salah satu fitur inti.

Supported File
.xlsx
.xls
.csv

Prioritas MVP:

.xlsx

14. EXCEL IMPORT FLOW
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
15. DEFAULT SHEET

Sistem akan mencoba mendeteksi:

Kalender Konten 30 Hari

Workbook kamu saat ini memiliki sheet:

Dashboard
Keyword Mapping
Kalender Konten 30 Hari
Internal Link Architecture
Template Brief Konten
Kalender Sosial Media
SOP & GEO Checklist
Template Brief Konten (Kosong)

Untuk MVP:

Fokus utama import ke Kalender Konten 30 Hari.

Struktur ini berasal dari workbook yang kamu upload.

16. COLUMN MAPPING

Kolom kalender kamu:

Hari
Slot Waktu
Content Cluster
Judul Artikel (SEO/GEO Optimized)
Target Keyword Utama
Keyword Sekunder / LSI
Search Volume
Tingkat Kompetisi
Journey Stage
Format Konten & Elemen GEO
Target CTA Konversi
URL Slug
Status

Sistem melakukan mapping:

Excel	Database
Hari	day
Slot Waktu	time_slot
Content Cluster	content_cluster
Judul Artikel	title
Target Keyword Utama	primary_keyword
Keyword Sekunder / LSI	secondary_keywords
Search Volume	search_volume
Tingkat Kompetisi	competition
Journey Stage	journey_stage
Format Konten	content_format
Target CTA Konversi	cta
URL Slug	slug
Status	status
17. CONTENT CALENDAR UI

Tampilan utama:

CONTENT CALENDAR

[Import Excel] [Add Content] [Bulk Generate]

Filter:
[All Days]
[Cluster]
[Journey]
[Status]

Search:
[ Search article... ]

-------------------------------------------------------
Hari | Artikel | Keyword | Journey | CTA | Status
-------------------------------------------------------
01   | Kursi...| kursi...| TOFU    | WA  | Published
01   | Mesin...| mesin... | MOFU    | PDF | Published
01   | Paket...| paket... | BOFU    | Buy | Published
-------------------------------------------------------
18. ARTICLE DETAIL

Ketika user klik artikel:

10 Kursi Kantor Ergonomis Terbaik untuk Sakit Pinggang [2026]

tampilkan:

SEO Information
Primary Keyword
kursi ergonomis terbaik

Secondary Keywords
kursi jaring ergonomis
harga kursi kerja sehat

Search Volume
> 5,000

Competition
Menengah
Content Strategy
Journey
TOFU

Content Format
Featured Snippet + Table

CTA
Konsultasi Ergonomi via WA

Data contoh tersebut berasal langsung dari calendar yang kamu upload.

19. PROMPT TEMPLATE LIBRARY

Template terdiri dari:

04
05
06
07
08
09
10
11
12
13
14
15
16
17
18
19
20
21
22
23
38
39

dan sistem harus dapat diperluas sampai:

40
20. TEMPLATE CATEGORY

Filter:

Semua
SEO
News
YouTube
Social

Namun karena produk fokus SEO, default:

SEO

21. TEMPLATE CARD

Contoh:

┌─────────────────────────────────────────┐
│ 04                                      │
│ Turunan 3 Penulisan Artikel SEO AEO... │
│                                         │
│ Category: SEO                           │
│ Version: 1.0                            │
│                                         │
│ [Use Template] [Preview]               │
└─────────────────────────────────────────┘
22. TEMPLATE SEARCH

Search berdasarkan:

nomor
nama
kategori
keyword
deskripsi

Contoh:

"local"

→ Template 11.

"ecommerce"

→ Template 15.

"refresh"

→ Template 05 / 39.

23. TEMPLATE STORAGE

Setiap template disimpan sebagai:

template_markdown

Contoh:

# MASTER PROMPT

## INPUT

Judul Artikel:
{{article_title}}

Target Keyword:
{{primary_keyword}}

...

Isi template harus dipertahankan 100%.

24. PLACEHOLDER ENGINE

Sistem otomatis mendeteksi placeholder.

Contoh:

{{article_title}}
{{primary_keyword}}
{{supporting_keywords}}
{{slug}}
{{search_intent}}

Engine menghasilkan:

{
  "article_title": {
    "label": "Judul Artikel",
    "required": true
  }
}
25. PROMPT BUILDER

Flow:

Select Template
       ↓
Detect INPUT
       ↓
Load Article Data
       ↓
Auto Mapping
       ↓
Generate Form
26. FIELD FORM

Field dasar sesuai kebutuhan kamu:

Judul Artikel
Target Keyword
Supporting Keywords
URL Slug
Tipe Konten
Estimasi Panjang
Intent Utama
Funnel Stage
Target Audience
Pertanyaan Utama
Query Fan-Out
Outline H1-H3
CTA Utama
Internal Links Keluar
Schema Wajib
Data / Statistik
Sumber yang Akan Dikutip
Tone of Voice
Bahasa
27. FIELD SOURCE SYSTEM

Setiap field memiliki source:

EXCEL
AI
PROJECT
MANUAL
DERIVED

Contoh:

Judul Artikel
SOURCE: EXCEL

Target Keyword
SOURCE: EXCEL

Search Intent
SOURCE: DERIVED

Target Audience
SOURCE: AI

Tone
SOURCE: PROJECT

UI dapat memberikan badge:

AUTO

atau

MANUAL

28. AUTO MAPPING

Mapping utama:

Excel title
→ {{article_title}}

Excel primary keyword
→ {{primary_keyword}}

Excel secondary keywords
→ {{supporting_keywords}}

Excel slug
→ {{slug}}

Excel journey
→ {{funnel_stage}}

Excel CTA
→ {{cta}}
29. DERIVED DATA

Data yang belum ada di Excel dapat dihasilkan.

Contoh:

Search Intent
keyword
+
title
+
journey

→

Informational

atau:

Commercial
30. QUERY FAN-OUT

Sistem dapat membuat minimal 5 pertanyaan.

Contoh:

1. Apa kursi ergonomis terbaik?
2. Bagaimana memilih kursi ergonomis?
3. Apa manfaat kursi ergonomis?
4. Berapa harga kursi ergonomis?
5. Kursi ergonomis cocok untuk siapa?

User tetap dapat mengedit hasil tersebut.

31. TARGET AUDIENCE

AI/logic menghasilkan berdasarkan:

Industry
+
Keyword
+
Content Cluster
+
Journey Stage
32. OUTLINE GENERATOR

Generate:

H1
H2
H2
  H3
  H3
H2
  H3
H2
FAQ

User dapat mengedit outline sebelum generate prompt.

33. SCHEMA RECOMMENDATION

Rule-based recommendation.

Contoh:

Article
FAQ
BreadcrumbList
Organization
LocalBusiness
Product
Service

Sistem tidak boleh memaksakan schema jika tidak sesuai konten.

34. INTERNAL LINK ENGINE

Jika data Internal Link Architecture nantinya di-import, sistem dapat mencari:

Current Article
       ↓
Related Cluster
       ↓
Relevant Articles

Output:

Recommended Internal Links

1. /blog/kursi-kantor-ergonomis
2. /blog/meja-kantor-minimalis
3. /blog/tips-memilih-kursi-kantor

Ini dapat menjadi fase berikutnya karena workbook kamu juga memiliki sheet Internal Link Architecture.

35. PROMPT GENERATION ENGINE

Setelah form lengkap:

Template
+
Input Data
=
Generated Prompt

Engine melakukan string replacement, bukan rewrite.

Contoh:

{{article_title}}

diganti dengan:

10 Kursi Kantor Ergonomis Terbaik...
36. CRITICAL REQUIREMENT
Template harus immutable.

Sistem DILARANG:

mengubah heading
mengubah urutan
mengubah instruksi
menghapus kalimat
merapikan Markdown secara otomatis
mengubah placeholder yang tidak memiliki data

Jika data kosong:

{{statistics}}

tetap:

{{statistics}}

sesuai requirement kamu.

37. GENERATED PROMPT PREVIEW

UI:

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
38. PROMPT OBJECT

Setelah generate, sistem membuat object:

{
  "template_id": "04",
  "project_id": "...",
  "content_id": "...",
  "variables": {},
  "markdown": "...",
  "created_at": "..."
}

Ini memungkinkan prompt langsung dikirim ke Formatter tanpa copy-paste.

39. PROMPT FORMATTER

Route:

/formatter

Input:

Paste Markdown

atau:

Upload .md

atau:

Open Generated Prompt
40. FORMAT OUTPUT

MVP:

Markdown
.md
JSON
.json
TXT
.txt
YAML
.yaml
41. JSON MODE

Sediakan dua mode.

RAW
{
  "prompt": "# MASTER PROMPT..."
}
STRUCTURED
{
  "metadata": {},
  "input": {},
  "instructions": [],
  "output": {},
  "constraints": []
}
42. BULK GENERATOR

Ini fitur yang sangat penting karena Excel kamu berisi banyak artikel.

User dapat memilih:

☑ Hari 01
☑ Hari 02
☑ Hari 03

atau:

☑ Semua

kemudian:

Template:
[04 - SEO Article]

Klik:

Generate 90 Prompts

43. BULK OUTPUT

Sistem menghasilkan:

SEO-Prompts.zip

├── 001-kursi-ergonomis.md
├── 002-penghancur-kertas.md
├── 003-paket-meja-kursi.md
├── ...
└── 090-....md

Alternatif:

seo-prompts.json
44. HISTORY

Simpan:

Generated Prompt
Template
Article
Version
Created At

User dapat:

View
Copy
Download
Regenerate
Delete
45. TEMPLATE VERSIONING

Ini sangat penting.

Template:

04
Version 1.0

kemudian berubah:

04
Version 1.1

Generated prompt lama tetap menggunakan template versi lama.

Jangan overwrite histori.

46. DATABASE SCHEMA
projects
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
content_calendar
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
prompt_templates
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
generated_prompts
id UUID PK
project_id UUID
content_id UUID
template_id UUID
template_version TEXT
input_data JSONB
generated_markdown TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
imports
id UUID PK
project_id UUID
filename TEXT
sheet_name TEXT
row_count INTEGER
status TEXT
error_log JSONB
created_at TIMESTAMP
exports
id UUID PK
project_id UUID
generated_prompt_id UUID
format TEXT
filename TEXT
created_at TIMESTAMP
47. SUPABASE SECURITY

Gunakan:

Row Level Security

Rule:

user_id = auth.uid()

User hanya dapat:

melihat project miliknya
mengedit project miliknya
melihat content miliknya
melihat generated prompt miliknya
48. AUTHENTICATION

MVP:

Email
Password

Kemudian dapat dikembangkan:

Google
GitHub
Magic Link
49. STORAGE

Supabase Storage:

/project/{project_id}/imports/

Untuk:

Excel asli
generated ZIP
exported files
50. TECH STACK
Frontend
Astro
TypeScript
Tailwind CSS
Backend
Astro Server
Supabase
Database
PostgreSQL
Excel
SheetJS
Validation
Zod
Markdown
remark / unified
51. KENAPA ASTRO?

Astro digunakan sebagai framework utama karena:

ringan
bagus untuk SEO
TypeScript support
server endpoints
cocok untuk dashboard + static/public pages
bisa menggunakan interactive islands
deployment mudah ke Vercel
52. KENAPA SUPABASE?

Karena project membutuhkan:

PostgreSQL
+
Auth
+
Storage
+
RLS
+
API

tanpa harus membangun backend authentication dari nol.

53. FRONTEND ARCHITECTURE
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
54. PROMPT ENGINE ARCHITECTURE
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
55. VARIABLE RESOLVER

Prioritas data:

MANUAL OVERRIDE
      ↓
EXCEL / DATABASE
      ↓
PROJECT DEFAULT
      ↓
DERIVED
      ↓
PLACEHOLDER

Contoh:

User mengubah:

Tone = Professional

walaupun default project:

Friendly

maka:

Professional

yang digunakan.

56. EMPTY FIELD RULE

Jika field tidak tersedia:

{{field}}

tetap dipertahankan.

Contoh:

Sumber:
{{sources}}

Jangan otomatis menjadi:

Sumber:
Tidak tersedia

karena akan merusak template.

57. UI/UX STYLE

Saya menyarankan desain:

Modern SaaS SEO Tool

Karakter:

clean
profesional
minimal
information dense
desktop-first
responsive
tidak terlalu banyak dekorasi
58. COLOR SYSTEM

Rekomendasi:

Background:
#F8FAFC

Surface:
#FFFFFF

Primary:
#2563EB

Text:
#0F172A

Secondary:
#64748B

Border:
#E2E8F0

Success:
#16A34A

Warning:
#F59E0B

Danger:
#DC2626

Tidak perlu menggunakan terlalu banyak warna.

59. LAYOUT

Desktop:

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
60. PROMPT BUILDER UI

Saya menyarankan 3-column layout:

┌──────────────┬────────────────────┬────────────────────┐
│ Template     │ Input Form         │ Markdown Preview   │
│              │                    │                    │
│ 04           │ Judul              │ # MASTER PROMPT    │
│ 05           │ Keyword            │                    │
│ 06           │ LSI                │ ## INPUT           │
│ ...          │ CTA                │                    │
│              │                    │                    │
└──────────────┴────────────────────┴────────────────────┘

Desktop sangat cocok.

Mobile:

Template
↓
Input
↓
Preview
61. USER FLOW UTAMA
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
62. SECONDARY FLOW
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
63. BULK FLOW
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
64. ERROR HANDLING

Jika Excel tidak memiliki sheet:

Sheet "Kalender Konten 30 Hari"
tidak ditemukan.

Jika kolom tidak ditemukan:

Target Keyword Utama
belum terdeteksi.

User diberikan:

Manual Mapping

65. VALIDATION

Sebelum generate:

Required Fields

✓ Judul Artikel
✓ Target Keyword
✓ Template
✓ Bahasa

Jika kosong:

Generate disabled.

Field optional tetap boleh kosong.

66. IMPORT PREVIEW

Sebelum menyimpan:

Found 90 rows

Valid:
88

Warning:
2

Errors:
0

User harus mengkonfirmasi:

Import 90 Content Items

67. PERFORMANCE REQUIREMENT

Target:

First Load < 2.5 sec untuk dashboard sederhana
Table pagination
Lazy loading
Debounced search
Jangan render 90+ artikel sekaligus jika tidak diperlukan
Bulk generation menggunakan queue/progress
68. SEO WEBSITE ITU SENDIRI

Karena produk ini fokus SEO, website publiknya juga harus SEO-friendly.

Public pages:

/
 /features
 /seo-prompt-builder
 /content-calendar
 /seo-tools
 /templates
 /blog
 /pricing

Setiap halaman memiliki:

title
meta description
canonical
OG tags
Twitter/X cards
sitemap
robots.txt
semantic HTML
structured data
69. PUBLIC SEO STRATEGY

Target keyword contoh:

SEO prompt generator
SEO prompt builder
prompt artikel SEO
template prompt SEO
SEO content planner
SEO content calendar
AI SEO prompt
prompt artikel SEO AEO GEO
70. ACCESSIBILITY

Minimal:

keyboard navigation
visible focus
semantic labels
sufficient contrast
screen reader-friendly
tooltip tidak menjadi satu-satunya sumber informasi
71. BACKUP & DATA SAFETY

Generated prompt tidak boleh hilang ketika browser refresh.

Semua generated prompt disimpan ke database.

Draft juga dapat disimpan:

Auto Save Draft
72. DRAFT SYSTEM

User sedang mengisi:

Template 04

kemudian keluar.

Saat kembali:

Resume Draft

Data:

draft_input JSONB
73. VERSIONING GENERATED PROMPT

Contoh:

Prompt #1
Template 04 v1.0

Prompt #2
Template 04 v1.1

Generated prompt lama tidak diubah.

74. EXPORT NAMING

Format:

{slug}.md
{slug}.json
{slug}.yaml
{slug}.txt

Contoh:

10-kursi-kantor-ergonomis-terbaik.md
75. FILE NAMING BULK
001-10-kursi-kantor-ergonomis-terbaik.md
002-rekomendasi-penghancur-kertas.md
003-paket-hemat-meja-kursi.md
76. FUTURE PHASE — AI SEO ASSISTANT

Setelah MVP stabil, tambahkan:

AI SEO Assistant

Kemampuan:

Search intent analysis
Query fan-out
content gap
outline
title suggestions
meta description
FAQ
entity suggestions
schema recommendations
internal link recommendations
77. FUTURE PHASE — SEO CONTENT INTELLIGENCE

Tambahkan:

Keyword Opportunity Score
Content Priority Score
Search Intent Score
Conversion Potential
Topical Authority
Content Gap

Dashboard:

SEO Opportunity
████████░░ 82%

Content Coverage
███████░░░ 74%

Commercial Coverage
████████░░ 80%
78. FUTURE PHASE — GOOGLE INTEGRATION

Kemudian dapat dikembangkan:

Google Search Console
Google Analytics

Untuk:

clicks
impressions
CTR
average position
landing page performance

Tetapi jangan masuk MVP.

79. FUTURE PHASE — AI SEARCH

Karena prompt kamu sudah memiliki AEO/GEO, nantinya dapat dibuat:

AI Search Optimization

dengan:

query fan-out
entity coverage
answerability
citation readiness
source quality
topical authority
80. MVP ACCEPTANCE CRITERIA

Project dianggap berhasil apabila user dapat:

AC-01

Membuat project.

AC-02

Upload .xlsx.

AC-03

Melihat daftar sheet.

AC-04

Memilih:

Kalender Konten 30 Hari

AC-05

Melihat 90 artikel.

AC-06

Memilih satu artikel.

AC-07

Memilih Template 04–40.

AC-08

Sistem mendeteksi placeholder.

AC-09

Field yang tersedia otomatis terisi.

AC-10

Field manual dapat diedit.

AC-11

Template tidak berubah strukturnya.

AC-12

Placeholder kosong tetap dipertahankan.

AC-13

Generate Markdown berhasil.

AC-14

Hasil dapat dicopy.

AC-15

Hasil dapat didownload .md.

AC-16

Hasil dapat dikirim ke Formatter.

AC-17

Formatter dapat menghasilkan .json.

AC-18

Formatter dapat menghasilkan .txt.

AC-19

Generated prompt tersimpan.

AC-20

User dapat membuka histori.

AC-21

Bulk generation dapat menghasilkan ZIP.

81. DEVELOPMENT PHASE
Phase 1 — Foundation
Astro
Supabase
Auth
Database
Layout
Phase 2 — Excel
Upload
Sheet detection
Preview
Mapping
Import
Phase 3 — Calendar
Calendar table
Search
Filter
Article detail
Phase 4 — Prompt Templates
Template CRUD
Template library
Placeholder detection
Phase 5 — Prompt Builder
Auto mapping
Form
Manual override
Preview
Generation
Phase 6 — Formatter
Markdown
JSON
YAML
TXT
Phase 7 — Export
Copy
Download
ZIP
Phase 8 — History
Generated prompts
Versioning
Draft
Phase 9 — AI
Intent
Fan-out
Outline
Audience
Schema
82. PRIORITAS FITUR
Fitur	Prioritas
Authentication	P0
Project	P0
Excel Import	P0
Calendar	P0
Template 04–40	P0
Auto Mapping	P0
Prompt Builder	P0
Markdown Generation	P0
Copy	P0
Download	P0
Formatter	P0
JSON	P0
History	P1
Bulk Generate	P1
ZIP	P1
AI Derived Fields	P1
Internal Link Engine	P2
GSC	P3
AI Search Analytics	P3
83. KONSEP TEKNIS TERPENTING

Saya ingin menekankan satu keputusan arsitektur:

Excel bukan database utama.

Excel:

IMPORT SOURCE

Supabase:

SOURCE OF TRUTH

Sehingga:

Excel
 ↓
Parser
 ↓
Supabase
 ↓
Application

Bukan:

Excel
 ↓
setiap kali aplikasi dibuka
 ↓
parse lagi

Ini akan jauh lebih scalable.

84. ARSITEKTUR FINAL
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
85. END-TO-END CONTOH

User memilih:

10 Kursi Kantor Ergonomis Terbaik untuk Sakit Pinggang [2026]

Data dari Excel:

Keyword:
kursi ergonomis terbaik

Supporting:
kursi jaring ergonomis
harga kursi kerja sehat

Volume:
> 5,000

Competition:
Menengah

Journey:
TOFU

CTA:
Konsultasi Ergonomi via WA

Slug:
/blog/10-kursi-kantor-ergonomis-terbaik

Kemudian:

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

Output:

generated_prompt.md

Kemudian klik:

Send to Formatter

Formatter menerima Prompt Object yang sama.

User memilih:

JSON

Output:

generated_prompt.json

Jadi tidak ada copy-paste sama sekali jika user menggunakan workflow terintegrasi.

86. KESIMPULAN PRODUK

Saya akan membangun produk ini dengan filosofi:

"One Content Calendar → One Source of Truth → Many SEO Prompts → Many Output Formats."

Bukan:

Excel reader + prompt generator + converter yang berdiri sendiri.

Tetapi satu sistem:

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

Untuk MVP, saya sangat menyarankan jangan langsung memasukkan semua fitur SEO seperti GSC, rank tracker, competitor analysis, dan AI research. Bangun dulu inti yang paling unik dari project kamu: Excel Content Calendar → Auto Mapping → Template 04–40 → Prompt Generator → Formatter → Export. Setelah pipeline ini stabil, fitur SEO intelligence bisa ditambahkan di atasnya tanpa perlu mengubah fondasi database.

Dan karena workbook kamu sudah memiliki bukan hanya kalender tetapi juga Keyword Mapping, Internal Link Architecture, Template Brief Konten, Kalender Sosial Media, dan SOP & GEO Checklist, struktur database sebaiknya dari awal dibuat cukup fleksibel untuk mengakomodasi sheet-sheet tersebut pada Phase 2, bukan hanya mengunci aplikasi pada satu sheet kalender.