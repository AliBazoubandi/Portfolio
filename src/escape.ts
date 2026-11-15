/**
 * Escapes a value for safe interpolation into HTML text nodes and
 * double-quoted attribute values. Used by every innerHTML renderer so
 * GitHub-derived or user-supplied strings can never inject markup.
 */
export function esc(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
