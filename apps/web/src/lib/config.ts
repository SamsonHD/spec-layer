import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * Resolution of the content directory, in priority order:
 *   1. The folder chosen in-app (persisted to .ds-config.json) — set via the UI.
 *   2. The DS_CONTENT_DIR env var (.env.local or shell).
 *   3. The bundled sample content, so the app works out of the box.
 *
 * Read fresh on every call (not cached at module load) so picking a new folder
 * in the UI takes effect immediately, without a restart.
 */

const CONFIG_PATH = path.join(process.cwd(), ".ds-config.json");
const DEFAULT_DIR = path.join(process.cwd(), "content", "components");

export function expandPath(raw: string): string {
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

export type ContentDirSource = "ui" | "env" | "default";

export function getContentDir(): string {
  const fromConfig = readConfigDir();
  if (fromConfig) return fromConfig;
  const fromEnv = process.env.DS_CONTENT_DIR?.trim();
  if (fromEnv) return expandPath(fromEnv);
  return DEFAULT_DIR;
}

export function getContentDirSource(): ContentDirSource {
  if (readConfigDir()) return "ui";
  if (process.env.DS_CONTENT_DIR?.trim()) return "env";
  return "default";
}

export function isDefaultDir(): boolean {
  return getContentDirSource() === "default";
}

/** Persist the user's chosen folder. Throws if the path isn't a directory. */
export function setContentDir(dir: string): string {
  const resolved = expandPath(dir);
  const stat = fs.statSync(resolved); // throws if missing
  if (!stat.isDirectory()) throw new Error("Not a directory");
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ contentDir: resolved }, null, 2));
  return resolved;
}

/** Clear the chosen folder, reverting to env/default. */
export function clearContentDir(): void {
  try {
    fs.unlinkSync(CONFIG_PATH);
  } catch {
    // already gone
  }
}
