/**
 * Immutable Template Renderer
 * Adheres strictly to PRD Section 36:
 * - Direct string replacement without altering markdown structure, headings, or instructions.
 * - If a variable has no value (empty string, null, undefined), the {{placeholder}} is preserved intact.
 */
export function renderPromptMarkdown(
  templateMarkdown: string,
  variables: Record<string, any>
): string {
  if (!templateMarkdown) return '';

  return templateMarkdown.replace(/\{\{([a-zA-Z0-9_-]+)\}\}/g, (match, key) => {
    const trimmedKey = key.trim();
    const val = variables[trimmedKey];

    // If value is provided and non-empty, replace it
    if (val !== undefined && val !== null && String(val).trim() !== '') {
      return String(val);
    }

    // Preserve original placeholder if data is missing or empty
    return match;
  });
}
