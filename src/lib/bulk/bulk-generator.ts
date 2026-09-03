import JSZip from 'jszip';
import yaml from 'js-yaml';
import { saveFile } from '../utils/download';
import type { ContentArticle, Project, PromptTemplate, ExportFormat } from '@/types';
import { autoMapTemplateFields } from '../prompt-engine/placeholder-engine';
import { renderPromptMarkdown } from '../prompt-engine/renderer';
import { formatPrompt, parseMarkdownToStructuredJSON, getFormatFileInfo } from '../formatter/prompt-formatter';

export interface BulkGenerationProgress {
  current: number;
  total: number;
  percentage: number;
  currentTitle: string;
  isCompleted: boolean;
}

export interface BulkGeneratedItem {
  article: Partial<ContentArticle>;
  filename: string;
  content: string;
  format: ExportFormat;
  rawMarkdown: string;
  variables: Record<string, any>;
}

/**
 * Generates prompt string for a single article and template in requested format
 */
export function generateSinglePrompt(
  article: Partial<ContentArticle>,
  template: PromptTemplate,
  project?: Partial<Project>,
  format: ExportFormat = 'md'
): { filename: string; content: string; rawMarkdown: string; variables: Record<string, any> } {
  const { values } = autoMapTemplateFields(template.template_markdown, article, project);
  const rawMarkdown = renderPromptMarkdown(template.template_markdown, values);
  
  const formattedContent = formatPrompt(rawMarkdown, format, {
    template_number: template.number,
    template_name: template.name,
    template_version: template.version,
    primary_keyword: article.primary_keyword,
    article_title: article.title,
    input_data: values,
  });

  const cleanSlug = (article.slug || article.title || 'artikel')
    .replace(/^\/blog\//, '')
    .replace(/^\//, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/--+/g, '-')
    .toLowerCase();

  const fileInfo = getFormatFileInfo(format);
  const filename = `${cleanSlug}.${fileInfo.extension}`;

  return {
    filename,
    content: formattedContent,
    rawMarkdown,
    variables: values,
  };
}

/**
 * Executes bulk generation across articles with progress callbacks and returns items
 */
export async function executeBulkGeneration(
  articles: Partial<ContentArticle>[],
  template: PromptTemplate,
  project?: Partial<Project>,
  format: ExportFormat = 'md',
  onProgress?: (progress: BulkGenerationProgress) => void
): Promise<BulkGeneratedItem[]> {
  const items: BulkGeneratedItem[] = [];
  const total = articles.length;

  for (let i = 0; i < total; i++) {
    const article = articles[i];
    if (!article) continue;
    
    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        percentage: Math.round(((i + 1) / total) * 100),
        currentTitle: article.title || 'Artikel',
        isCompleted: false,
      });
    }

    const { filename, content, rawMarkdown, variables } = generateSinglePrompt(article, template, project, format);
    
    // Prefix index number for bulk ordering: 001-slug.format
    const prefix = String(i + 1).padStart(3, '0');
    const bulkFilename = `${prefix}-${filename}`;

    items.push({
      article,
      filename: bulkFilename,
      content,
      format,
      rawMarkdown,
      variables,
    });

    // Yield to UI thread
    if (total > 10) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  if (onProgress) {
    onProgress({
      current: total,
      total,
      percentage: 100,
      currentTitle: 'Selesai',
      isCompleted: true,
    });
  }

  return items;
}

/**
 * Creates and downloads a ZIP archive containing all bulk generated files in their selected format
 */
export async function downloadBulkAsZip(
  items: BulkGeneratedItem[],
  zipFilename: string = 'SEO-Prompts-Batch.zip'
): Promise<void> {
  const zip = new JSZip();

  items.forEach(item => {
    zip.file(item.filename, item.content);
  });

  // Include a summary manifest file inside the ZIP
  const manifest = {
    generated_at: new Date().toISOString(),
    total_files: items.length,
    format: items[0]?.format || 'md',
    files: items.map(item => ({
      filename: item.filename,
      title: item.article.title,
      keyword: item.article.primary_keyword,
      cluster: item.article.content_cluster,
      journey: item.article.journey_stage,
    })),
  };

  zip.file('_MANIFEST.json', JSON.stringify(manifest, null, 2));

  const blob = await zip.generateAsync({ type: 'blob' });
  saveFile(blob, zipFilename);
}

/**
 * Downloads a single concatenated Master file matching the EXACT chosen format (JSON, YAML, Markdown, TXT)
 */
export function downloadBulkMasterFile(
  items: BulkGeneratedItem[],
  format: ExportFormat = 'md',
  baseFilename: string = 'Master-SEO-Prompts'
): void {
  const fileInfo = getFormatFileInfo(format);
  const fullFilename = `${baseFilename}.${fileInfo.extension}`;

  if (format === 'json_structured' || format === 'json_raw') {
    // True JSON output: Parse all items into valid JSON array
    const jsonPayload = items.map((item, idx) => {
      try {
        return JSON.parse(item.content);
      } catch {
        return {
          index: idx + 1,
          title: item.article.title,
          keyword: item.article.primary_keyword,
          prompt: item.content,
        };
      }
    });

    const jsonString = JSON.stringify(jsonPayload, null, 2);
    const blob = new Blob([jsonString], { type: fileInfo.mimeType });
    saveFile(blob, fullFilename);
    return;
  }

  if (format === 'yaml') {
    // True YAML output: Convert structured items into YAML document
    const yamlPayload = items.map((item, idx) => {
      try {
        return yaml.load(item.content);
      } catch {
        return {
          index: idx + 1,
          title: item.article.title,
          keyword: item.article.primary_keyword,
          prompt: item.content,
        };
      }
    });

    const yamlString = yaml.dump(yamlPayload, { indent: 2, lineWidth: -1 });
    const blob = new Blob([yamlString], { type: fileInfo.mimeType });
    saveFile(blob, fullFilename);
    return;
  }

  // Default: Markdown (.md) or Plain Text (.txt)
  const header = `# Master SEO Content Prompts (${items.length} Articles)\n*Generated automatically by SEO Prompt Studio on ${new Date().toLocaleDateString('id-ID')}*\n\n---\n\n`;

  const body = items
    .map((item, idx) => {
      const art = item.article;
      return `## [${String(idx + 1).padStart(2, '0')}] ${art.title || 'Artikel'}\n- **Target Keyword:** \`${art.primary_keyword || '-'}\`\n- **Cluster:** ${art.content_cluster || '-'}\n- **Journey Stage:** ${art.journey_stage || 'TOFU'}\n- **CTA:** ${art.cta || '-'}\n\n\`\`\`markdown\n${item.rawMarkdown || item.content}\n\`\`\`\n\n---`;
    })
    .join('\n\n');

  const fullContent = header + body;
  const blob = new Blob([fullContent], { type: fileInfo.mimeType });
  saveFile(blob, fullFilename);
}
