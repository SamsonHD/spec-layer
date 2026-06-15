import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import type { CacheStore } from "@spec-layer/extractor";
import { getContentDir } from "@/lib/config";

/**
 * Filesystem-backed implementation of the extractor's CacheStore interface:
 *   get(key): Promise<string | null>
 *   set(key, value): Promise<void>
 *
 * Used so prose (LLM) calls are cached by content_hash — draftProse keys its
 * cache via `proseCacheKey(spec)` (a versioned `prose:<version>:<content_hash>`),
 * so identical extractions never re-hit the API until the prompt version changes.
 *
 * Cache dir resolution: a sibling `.spec-cache` next to the resolved content
 * dir, falling back to the OS tmpdir if that location isn't writable.
 */

function resolveCacheDir(): string {
  const preferred = path.join(getContentDir(), "..", ".spec-cache");
  try {
    fs.mkdirSync(preferred, { recursive: true });
    return preferred;
  } catch {
    const fallback = path.join(os.tmpdir(), "spec-layer-cache");
    fs.mkdirSync(fallback, { recursive: true });
    return fallback;
  }
}

/** Map an arbitrary cache key to a safe, collision-resistant filename. */
function keyToFile(dir: string, key: string): string {
  const digest = crypto.createHash("sha256").update(key).digest("hex");
  return path.join(dir, `${digest}.json`);
}

export function createSpecCache(): CacheStore {
  // Resolve (and create) the cache dir once per store instead of on every op.
  const dir = resolveCacheDir();
  return {
    async get(key: string): Promise<string | null> {
      try {
        return await fs.promises.readFile(keyToFile(dir, key), "utf-8");
      } catch {
        return null;
      }
    },
    async set(key: string, value: string): Promise<void> {
      await fs.promises.writeFile(keyToFile(dir, key), value, "utf-8");
    },
  };
}
