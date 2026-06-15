/**
 * sendGuard — pure helper that decides whether a "Send to docs" action is
 * allowed based on the resolved Figma file key.
 *
 * figma.fileKey is the only automatic source of the file key. When it is
 * unavailable (unsaved/dev files) the effective key falls back to the user
 * override, or to the sentinel string "unknown" when neither is set. There is
 * no Figma API we can call to fabricate a share link without a real file key,
 * so manual paste is the only fallback.
 *
 * Keeping this logic in a pure function (no DOM, no fetch) makes it trivially
 * testable and easy to reuse if the UI grows new send paths.
 */

/** Sentinel value produced by effectiveFileKey when no file key is available. */
export const UNKNOWN_FILE_KEY = 'unknown';

export interface SendGuardResult {
  /** true  → proceed with the POST */
  allowed: boolean;
  /**
   * Human-readable reason why sending is blocked.
   * Only present when allowed === false.
   */
  reason?: string;
}

/**
 * Returns { allowed: true } when `fileKey` is a real (non-empty, non-sentinel)
 * key, and { allowed: false, reason: "..." } otherwise.
 */
export function canSendToDocs(fileKey: string | null | undefined): SendGuardResult {
  if (!fileKey || fileKey === UNKNOWN_FILE_KEY) {
    return {
      allowed: false,
      reason:
        'No Figma file detected — paste the file URL below so the preview can load.',
    };
  }
  return { allowed: true };
}
