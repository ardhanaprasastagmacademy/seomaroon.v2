/**
 * Universal browser file download helper (replaces file-saver CommonJS export)
 */
export function saveFile(blob: Blob | string, filename: string) {
  if (typeof window === 'undefined') return;

  const url = typeof blob === 'string' ? blob : window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  if (typeof blob !== 'string') {
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  }
}
