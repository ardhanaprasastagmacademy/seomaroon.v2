import type { ContentArticle, Project, TemplateFieldSchema, FieldSource } from '@/types';
import { generateDerivedFields } from './derived-engine';

export const PLACEHOLDER_REGEX = /\{\{([a-zA-Z0-9_-]+)\}\}/g;

/**
 * Extracts all unique placeholder variable keys from raw markdown template string
 */
export function extractPlaceholders(templateMarkdown: string): string[] {
  const matches = templateMarkdown.matchAll(PLACEHOLDER_REGEX);
  const keys = new Set<string>();
  for (const match of matches) {
    if (match[1]) {
      keys.add(match[1].trim());
    }
  }
  return Array.from(keys);
}

/**
 * Humanizes variable keys into readable field labels
 */
export function humanizeKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Detects input schema dynamically from markdown if template schema is missing
 */
export function detectSchemaFromMarkdown(markdown: string): TemplateFieldSchema[] {
  const keys = extractPlaceholders(markdown);
  return keys.map(key => {
    const isRequired = ['article_title', 'primary_keyword', 'language'].includes(key);
    let defaultSource: FieldSource = 'MANUAL';

    if (['article_title', 'primary_keyword', 'supporting_keywords', 'slug', 'content_type', 'cta', 'funnel_stage'].includes(key)) {
      defaultSource = 'EXCEL';
    } else if (['tone_of_voice', 'language', 'business_name', 'target_location', 'estimated_length'].includes(key)) {
      defaultSource = 'PROJECT';
    } else if (['search_intent', 'query_fan_out', 'outline_structure', 'target_audience', 'schema_markup', 'internal_links', 'main_questions'].includes(key)) {
      defaultSource = 'DERIVED';
    }

    return {
      key,
      label: humanizeKey(key),
      required: isRequired,
      default_source: defaultSource,
      type: ['outline_structure', 'query_fan_out', 'internal_links', 'existing_content_summary'].includes(key) ? 'textarea' : 'text'
    };
  });
}

/**
 * Auto-maps article data, project defaults, and derived data into input form values
 */
export function autoMapTemplateFields(
  templateMarkdown: string,
  article?: Partial<ContentArticle>,
  project?: Partial<Project>,
  customOverrides?: Record<string, any>
): {
  values: Record<string, any>;
  sources: Record<string, FieldSource>;
} {
  const placeholders = extractPlaceholders(templateMarkdown);
  const values: Record<string, any> = {};
  const sources: Record<string, FieldSource> = {};

  // Pre-calculate derived fields if article info is available
  const derived = article ? generateDerivedFields(article, project) : {};

  for (const key of placeholders) {
    // Check manual override first
    if (customOverrides && customOverrides[key] !== undefined && customOverrides[key] !== '') {
      values[key] = customOverrides[key];
      sources[key] = 'MANUAL';
      continue;
    }

    // 1. Map directly from Excel Article fields
    if (article) {
      if (key === 'article_title' && article.title) {
        values[key] = article.title;
        sources[key] = 'EXCEL';
        continue;
      }
      if (key === 'primary_keyword' && article.primary_keyword) {
        values[key] = article.primary_keyword;
        sources[key] = 'EXCEL';
        continue;
      }
      if ((key === 'supporting_keywords' || key === 'secondary_keywords' || key === 'lsi_keywords') && article.secondary_keywords) {
        values[key] = article.secondary_keywords;
        sources[key] = 'EXCEL';
        continue;
      }
      if (key === 'slug' && article.slug) {
        values[key] = article.slug;
        sources[key] = 'EXCEL';
        continue;
      }
      if ((key === 'content_type' || key === 'content_format') && article.content_format) {
        values[key] = article.content_format;
        sources[key] = 'EXCEL';
        continue;
      }
      if ((key === 'cta' || key === 'conversion_cta') && article.cta) {
        values[key] = article.cta;
        sources[key] = 'EXCEL';
        continue;
      }
      if ((key === 'funnel_stage' || key === 'journey_stage') && article.journey_stage) {
        values[key] = article.journey_stage;
        sources[key] = 'EXCEL';
        continue;
      }
      if (key === 'content_cluster' && article.content_cluster) {
        values[key] = article.content_cluster;
        sources[key] = 'EXCEL';
        continue;
      }
    }

    // 2. Map from Project defaults
    if (project) {
      if ((key === 'tone_of_voice' || key === 'tone') && project.default_tone) {
        values[key] = project.default_tone;
        sources[key] = 'PROJECT';
        continue;
      }
      if (key === 'language' && project.default_language) {
        values[key] = project.default_language;
        sources[key] = 'PROJECT';
        continue;
      }
      if (key === 'business_name' && project.business_name) {
        values[key] = project.business_name;
        sources[key] = 'PROJECT';
        continue;
      }
      if (key === 'target_location' && project.primary_location) {
        values[key] = project.primary_location;
        sources[key] = 'PROJECT';
        continue;
      }
      if (key === 'estimated_length') {
        values[key] = '1.500 - 2.500 kata';
        sources[key] = 'PROJECT';
        continue;
      }
    }

    // 3. Map from Derived Heuristics
    if (derived && (derived as any)[key] !== undefined) {
      values[key] = (derived as any)[key];
      sources[key] = 'DERIVED';
      continue;
    }

    // Default empty placeholder
    values[key] = '';
    sources[key] = 'MANUAL';
  }

  return { values, sources };
}
