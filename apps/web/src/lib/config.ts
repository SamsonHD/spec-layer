import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * Resolution of the content directory, in priority order:
 *   1. A contentDir value in .ds-config.json (a later phase reuses that file for API keys).
 *   2. The DS_CONTENT_DIR env var (.env.local or shell).
 *   3. The bundled sample content, so the app works out of the box.
 *
 * Read fresh on every call (not cached at module load).
 * There is no longer any UI to write .ds-config.json; the file is read-only from the app's
 * perspective. A future phase will use it for API keys and other settings.
 */

const CONFIG_PATH = path.join(process.cwd(), ".ds-config.json");
const DEFAULT_DIR = path.join(process.cwd(), "content", "components");

function expandPath(raw: string): string {
  const trimmed = raw.trim();
  const expanded = trimmed.startsWith("~") ? path.join(os.homedir(), trimmed.slice(1)) : trimmed;
  return path.isAbsolute(expanded) ? expanded : path.resolve(process.cwd(), expanded);
}

function readConfigDir(): string | null {
  try {
    const data = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8")) as { contentDir?: string };
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

