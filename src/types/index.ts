export type JourneyStage = 'TOFU' | 'MOFU' | 'BOFU' | string;
export type ContentStatus = 'Published' | 'Draft' | 'Ready' | 'Generated';
export type FieldSource = 'EXCEL' | 'PROJECT' | 'AI' | 'DERIVED' | 'MANUAL';
export type TemplateCategory = 'SEO' | 'AEO/GEO' | 'E-Commerce' | 'Local SEO' | 'Social' | 'News' | 'Other';
export type ExportFormat = 'md' | 'json_raw' | 'json_structured' | 'yaml' | 'txt';

export interface Project {
  id: string;
  name: string;
  website_url?: string;
  business_name?: string;
  industry?: string;
  description?: string;
  primary_location?: string;
  default_language: string;
  default_tone: string;
  default_cta: string;
  created_at: string;
  updated_at: string;
}

export interface ContentArticle {
  id: string;
  project_id: string;
  day: string;
  time_slot?: string;
  content_cluster: string;
  title: string;
  primary_keyword: string;
  secondary_keywords?: string;
  search_volume?: string;
  competition?: string;
  journey_stage: JourneyStage;
  content_format?: string;
  cta?: string;
  slug: string;
  status: ContentStatus;
  source_import_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateFieldSchema {
  key: string;
  label: string;
  placeholder?: string;
  default_source?: FieldSource;
  required?: boolean;
  type?: 'text' | 'textarea' | 'select' | 'list';
  options?: string[];
  description?: string;
}

export interface PromptTemplate {
  id: string;
  number: number;
  name: string;
  category: TemplateCategory;
  description: string;
  template_markdown: string;
  input_schema?: TemplateFieldSchema[];
  version: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GeneratedPrompt {
  id: string;
  project_id: string;
  content_id?: string;
  template_id: string;
  template_number: number;
  template_name: string;
  template_version: string;
  article_title: string;
  primary_keyword: string;
  input_data: Record<string, any>;
  field_sources?: Record<string, FieldSource>;
  generated_markdown: string;
  created_at: string;
  updated_at: string;
}

export interface PromptDraft {
  project_id: string;
  content_id?: string;
  template_id: string;
  input_values: Record<string, any>;
  field_sources: Record<string, FieldSource>;
  updated_at: string;
}

export interface ImportRecord {
  id: string;
  project_id: string;
  filename: string;
  sheet_name: string;
  row_count: number;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  error_log?: any;
  created_at: string;
}

export interface PromptObject {
  template_id: string;
  template_number?: number;
  project_id: string;
  content_id?: string;
  article_title?: string;
  variables: Record<string, any>;
  markdown: string;
  created_at: string;
}

export interface StructuredPromptJSON {
  metadata: {
    template_number: number;
    template_name: string;
    version: string;
    target_keyword: string;
    article_title: string;
    generated_at: string;
    generated_by: string;
  };
  input: Record<string, any>;
  instructions: string[];
  output: {
    format: string;
    language: string;
    target_audience: string;
    tone: string;
  };
  constraints: string[];
  full_prompt?: string;
}

export interface ExcelParsedSheet {
  name: string;
  rowCount: number;
  headers: string[];
  data: Record<string, any>[];
}

export interface ColumnMappingConfig {
  day: string;
  time_slot: string;
  content_cluster: string;
  title: string;
  primary_keyword: string;
  secondary_keywords: string;
  search_volume: string;
  competition: string;
  journey_stage: string;
  content_format: string;
  cta: string;
  slug: string;
  status: string;
}
