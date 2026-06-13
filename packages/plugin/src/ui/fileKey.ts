/**
 * Accept either a full Figma URL ("https://www.figma.com/design/{key}/...") or
 * a bare 22-ish character file key. Returns the canonical key or null.
 */
export function parseFigmaFileKey(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const urlMatch = trimmed.match(/figma\.com\/(?:file|design|proto)\/([A-Za-z0-9]+)/);
  if (urlMatch) return urlMatch[1];
  if (/^[A-Za-z0-9]{10,}$/.test(trimmed)) return trimmed;
  return null;
}
