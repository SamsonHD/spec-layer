import fs from "node:fs";
import { configPath } from "./config";

/**
 * Reads/writes API keys into the same .ds-config.json that config.ts uses.
 *
 * The JSON shape is extended with optional `anthropicKey` and `figmaToken`
 * fields, e.g.:
 *   { "contentDir": "/...", "anthropicKey": "sk-ant-...", "figmaToken": "figd-..." }
 *
 * The config file path is normally <cwd>/.ds-config.json.  Tests may override
 * this by setting DS_CONFIG_PATH to a temp file path.
 *
 * Raw key values are NEVER returned to callers outside this module — only
 * boolean presence via getKeyStatus().
 */

interface DsConfig {
  contentDir?: string;
  anthropicKey?: string;
  figmaToken?: string;
}

function readConfig(): DsConfig {
  try {
    return JSON.parse(fs.readFileSync(configPath(), "utf-8")) as DsConfig;
  } catch {
    return {};
  }
}

function writeConfig(data: DsConfig): void {
  fs.writeFileSync(configPath(), JSON.stringify(data, null, 2) + "\n", "utf-8");
}

/**
 * Persists the provided keys into .ds-config.json without clobbering any
 * other fields (e.g. contentDir).
 *
 * - A non-empty string sets the key.
 * - An empty string removes the key (deletes the field).
 * - `undefined` leaves the existing value unchanged.
 */
export function setKeys(keys: { anthropic?: string; figma?: string }): void {
  const config = readConfig();

  if (keys.anthropic !== undefined) {
    if (keys.anthropic === "") {
      delete config.anthropicKey;
    } else {
      config.anthropicKey = keys.anthropic;
    }
  }

  if (keys.figma !== undefined) {
    if (keys.figma === "") {
      delete config.figmaToken;
    } else {
      config.figmaToken = keys.figma;
    }
  }

  writeConfig(config);
}

/** Returns the Anthropic key from config, falling back to ANTHROPIC_API_KEY env var. */
export function getAnthropicKey(): string | undefined {
  const config = readConfig();
  if (config.anthropicKey && config.anthropicKey.trim()) return config.anthropicKey;
  const fromEnv = process.env.ANTHROPIC_API_KEY?.trim();
  return fromEnv || undefined;
}

/** Returns the Figma token from config, falling back to FIGMA_TOKEN env var. */
export function getFigmaToken(): string | undefined {
  const config = readConfig();
  if (config.figmaToken && config.figmaToken.trim()) return config.figmaToken;
  const fromEnv = process.env.FIGMA_TOKEN?.trim();
  return fromEnv || undefined;
}

/**
 * Returns boolean presence flags for each key.
 * NEVER exposes raw key values — safe to send to the browser.
 */
export function getKeyStatus(): { anthropic: boolean; figma: boolean } {
  return {
    anthropic: Boolean(getAnthropicKey()),
    figma: Boolean(getFigmaToken()),
  };
}
