// ---------------------------------------------------------------------------
// effectiveFileKey — the single precedence rule for the Figma file key.
//
// The main thread is the sole authority: the user-supplied override only
// fills in when figma.fileKey is missing (dev plugins / unsaved files). It
// never wins over a real file key.
// ---------------------------------------------------------------------------

export function effectiveFileKey(
  figmaFileKey: string | null | undefined,
  override: string | null,
): string {
  if (figmaFileKey) return figmaFileKey;
  return override ?? 'unknown';
}
