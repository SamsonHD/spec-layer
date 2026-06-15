import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * Resolution of the content directory, in priority order:
 *   1. A contentDir value in .ds-config.json.
 *   2. The DS_CONTENT_DIR env var (.env.local or shell).
 *   3. The app-local content directory.
 *
 * Read fresh on every call (not cached at module load).
 * Settings and content-directory selection share .ds-config.json.
 */

const DEFAULT_DIR = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  "content",
  "components",
);

/**
 * The single source of truth for the .ds-config.json location, shared with
 * settings.ts. Normally <cwd>/.ds-config.json; tests may override via
 * DS_CONFIG_PATH so config and settings always resolve to the same file.
 */
export function configPath(): string {
  return process.env.DS_CONFIG_PATH ?? path.join(
    /* turbopackIgnore: true */ process.cwd(),
    ".ds-config.json",
  );
}

function expandPath(raw: string): string {
  const trimmed = raw.trim();
  const expanded = trimmed.startsWith("~") ? path.join(os.homedir(), trimmed.slice(1)) : trimmed;
  return path.isAbsolute(expanded)
    ? expanded
    : path.resolve(/* turbopackIgnore: true */ process.cwd(), expanded);
}

function readConfigDir(): string | null {
  try {
    const data = JSON.parse(
      fs.readFileSync(/* turbopackIgnore: true */ configPath(), "utf-8"),
    ) as { contentDir?: string };
    if (data.contentDir && data.contentDir.trim()) return expandPath(data.contentDir);
  } catch {
    // no config file yet, or unreadable — fall through
  }
  return null;
}

export function getContentDir(): string {
  const fromConfig = readConfigDir();
  if (fromConfig) return fromConfig;
  const fromEnv = process.env.DS_CONTENT_DIR?.trim();
  if (fromEnv) return expandPath(fromEnv);
  return DEFAULT_DIR;
}
