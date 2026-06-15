import fs from "node:fs";
import path from "node:path";

/**
 * Resolves the project's repository URL for the homepage link.
 *
 * Reads the `origin` remote from the nearest `.git/config` (walking up from
 * cwd), then normalizes it to a browsable https URL:
 *   git@github.com:owner/repo.git      -> https://github.com/owner/repo
 *   https://github.com/owner/repo.git  -> https://github.com/owner/repo
 *   ssh://git@host/owner/repo.git       -> https://host/owner/repo
 *
 * An explicit NEXT_PUBLIC_REPO_URL env var takes precedence. Returns null when
 * no remote can be found (e.g. a tarball checkout), so callers can hide the link.
 */
export function getRepoUrl(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_REPO_URL?.trim();
  if (fromEnv) return normalizeRemote(fromEnv);

  const raw = readOriginRemote();
  return raw ? normalizeRemote(raw) : null;
}

function readOriginRemote(): string | null {
  let dir = process.cwd();
  // Walk up until we find a .git directory or hit the filesystem root.
  for (;;) {
    const gitConfig = path.join(dir, ".git", "config");
    try {
      const text = fs.readFileSync(gitConfig, "utf-8");
      const url = parseOriginUrl(text);
      if (url) return url;
    } catch {
      /* not here; keep walking */
    }
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

/** Pulls the `url =` line out of the `[remote "origin"]` section. */
function parseOriginUrl(config: string): string | null {
  const lines = config.split("\n");
  let inOrigin = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("[")) {
      inOrigin = trimmed === '[remote "origin"]';
      continue;
    }
    if (inOrigin && trimmed.startsWith("url")) {
      const eq = trimmed.indexOf("=");
      if (eq !== -1) return trimmed.slice(eq + 1).trim();
    }
  }
  return null;
}

/** Converts any common git remote form into a browsable https URL. */
export function normalizeRemote(remote: string): string {
  let url = remote.trim().replace(/\.git$/, "");

  // scp-like syntax: git@host:owner/repo
  const scp = /^[^@]+@([^:]+):(.+)$/.exec(url);
  if (scp) return `https://${scp[1]}/${scp[2]}`;

  // ssh://git@host/owner/repo or git://host/owner/repo
  const ssh = /^(?:ssh|git):\/\/(?:[^@/]+@)?([^/]+)\/(.+)$/.exec(url);
  if (ssh) return `https://${ssh[1]}/${ssh[2]}`;

  // Already http(s) — strip any embedded credentials.
  url = url.replace(/^(https?:\/\/)[^@/]+@/, "$1");
  return url;
}
