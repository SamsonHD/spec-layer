/**
 * exportFiles.ts — pure utilities for building and zipping export file records.
 *
 * Intentionally has no DOM or Figma dependencies so it can be unit-tested in
 * Node/Vitest without a browser environment.
 *
 * buildExportFiles: maps an array of { name, markdown } to a record of
 *   "<folder>/<kebab-name>.md" → markdown, with collision handling and a safe
 *   fallback for names that reduce to empty after kebab-casing.
 *
 * zipFiles: takes that record and produces a Uint8Array zip using fflate.
 */

import { zipSync, strToU8 } from 'fflate';
import { toKebab } from './ui/state';

// ---------------------------------------------------------------------------
// buildExportFiles
// ---------------------------------------------------------------------------

/**
 * Convert an array of components to a path → markdown record.
 *
 * - Names are kebab-cased via toKebab().
 * - If a name kebabs to empty, the fallback "component" is used.
 * - Collisions are resolved by appending -2, -3, … (first occurrence keeps no suffix).
 * - folder is prepended as "<folder>/" when non-empty.
 */
export function buildExportFiles(
  items: Array<{ name: string; markdown: string }>,
  folder: string,
): Record<string, string> {
  const result: Record<string, string> = {};
  // Track how many times a base slug has been seen (for collision handling).
  const seen = new Map<string, number>();

  for (const item of items) {
    let slug = toKebab(item.name).replace(/^-+|-+$/g, '');
    if (!slug) slug = 'component';

    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);

    // First occurrence keeps the bare slug; subsequent ones get -2, -3, …
    const suffix = count === 0 ? '' : `-${count + 1}`;
    const filename = slug + suffix + '.md';
    const path = folder ? `${folder}/${filename}` : filename;

    result[path] = item.markdown;
  }

  return result;
}

// ---------------------------------------------------------------------------
// zipFiles
// ---------------------------------------------------------------------------

/**
 * Compress a path → content record into a zip Uint8Array.
 * Uses fflate's synchronous zipSync; content strings are encoded with strToU8.
 */
export function zipFiles(files: Record<string, string>): Uint8Array {
  const input: Record<string, Uint8Array> = {};
  for (const [path, content] of Object.entries(files)) {
    input[path] = strToU8(content);
  }
  return zipSync(input, { level: 6 });
}
