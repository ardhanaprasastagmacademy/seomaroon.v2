import yaml from 'js-yaml';
import type { ExportFormat, StructuredPromptJSON } from '@/types';

/**
 * Parses markdown prompt into a structured JSON representation
 */
export function parseMarkdownToStructuredJSON(
  markdown: string,
  extraMetadata?: Record<string, any>
): StructuredPromptJSON {
  const lines = markdown.split('\n');
  const metadata: any = {
    template_number: extraMetadata?.template_number || 4,
    template_name: extraMetadata?.template_name || 'SEO Prompt',
    version: extraMetadata?.template_version || '1.0',
    target_keyword: extraMetadata?.primary_keyword || '',
    article_title: extraMetadata?.article_title || '',
    generated_at: new Date().toISOString(),
    generated_by: 'SEO Content & Prompt OS',
  };

  const input: Record<string, any> = { ...extraMetadata?.input_data };
  const instructions: string[] = [];
  const constraints: string[] = [];
  const output: any = {
    format: 'Markdown',
    language: input.language || 'Bahasa Indonesia',
    target_audience: input.target_audience || 'General Readers / Decision Makers',
    tone: input.tone_of_voice || 'Professional & Informative',
  };

  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      metadata.template_name = trimmed.replace('# ', '').trim();
    } else if (trimmed.startsWith('## ')) {
      currentSection = trimmed.replace('## ', '').toLowerCase();
    } else if (trimmed.startsWith('- **') && trimmed.includes(':**')) {
      const match = trimmed.match(/- \*\*([^*]+):\*\*\s*(.*)/);
      if (match && match[1] && match[2]) {
        const key = match[1].toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        if (!input[key]) {
          input[key] = match[2];
        }
      }
    } else if (trimmed.match(/^\d+\.\s+\*\*/)) {
      if (currentSection.includes('panduan') || currentSection.includes('instruksi') || currentSection.includes('framework')) {
        instructions.push(trimmed);
      }
    } else if (trimmed.startsWith('- ') && currentSection.includes('panduan')) {
      instructions.push(trimmed.replace('- ', ''));
    }
  }

  // Fallback defaults if parsing missed anything
  if (instructions.length === 0) {
    instructions.push(
      'Gunakan format Direct Answer pada 100 kata pertama untuk Google Featured Snippet.',
      'Terapkan struktur heading teratur (H1, H2, H3).',
      'Integrasikan Target Keyword Utama secara natural (densitas 1-1.5%).',
      'Sediakan tabel perbandingan dan takeaways ringkas.',
      'Sertakan bagian FAQ komprehensif di akhir artikel.'
    );
  }

  constraints.push(
    'Dilarang melakukan keyword stuffing.',
    'Pertahankan fakta dan data yang akurat (E-E-A-T standards).',
    'Gunakan gaya bahasa profesional dan mudah dipahami.'
  );

  return {
    metadata,
    input,
    instructions,
    output,
    constraints,
    full_prompt: markdown,
  };
}

/**
 * Master Formatter converting markdown to target format string
 */
export function formatPrompt(
  markdown: string,
  format: ExportFormat,
  metadata?: Record<string, any>
): string {
  if (!markdown) return '';

  switch (format) {
    case 'md':
      return markdown;

    case 'json_raw':
      return JSON.stringify({ prompt: markdown }, null, 2);

    case 'json_structured': {
      const structured = parseMarkdownToStructuredJSON(markdown, metadata);
      return JSON.stringify(structured, null, 2);
    }

    case 'yaml': {
      const structured = parseMarkdownToStructuredJSON(markdown, metadata);
      return yaml.dump(structured, { indent: 2, lineWidth: -1 });
    }

    case 'txt':
      return markdown;

    default:
      return markdown;
  }
}

/**
 * Returns appropriate MIME type and extension for download
 */
export function getFormatFileInfo(format: ExportFormat): { extension: string; mimeType: string } {
  switch (format) {
    case 'md':
      return { extension: 'md', mimeType: 'text/markdown;charset=utf-8' };
    case 'json_raw':
    case 'json_structured':
      return { extension: 'json', mimeType: 'application/json;charset=utf-8' };
    case 'yaml':
      return { extension: 'yaml', mimeType: 'text/yaml;charset=utf-8' };
    case 'txt':
      return { extension: 'txt', mimeType: 'text/plain;charset=utf-8' };
  }
}
