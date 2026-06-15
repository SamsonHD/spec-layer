/**
 * Tests for settings.ts — reads/writes API keys in .ds-config.json.
 *
 * A temp config file is wired via DS_CONFIG_PATH so tests never touch the
 * real .ds-config.json. Pattern mirrors sectionEditFile.test.ts / specUpload.test.ts.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { setKeys, getAnthropicKey, getFigmaToken, getKeyStatus } from "./settings";

let tmpDir: string;
let configPath: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ds-settings-test-"));
  configPath = path.join(tmpDir, ".ds-config.json");
  process.env.DS_CONFIG_PATH = configPath;
  // Remove any real env vars so env fallback tests are deterministic
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.FIGMA_TOKEN;
});

afterEach(() => {
  delete process.env.DS_CONFIG_PATH;
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.FIGMA_TOKEN;
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// setKeys / getAnthropicKey / getFigmaToken
// ---------------------------------------------------------------------------

describe("setKeys — persists and reads back", () => {
  it("setKeys persists anthropic key and getAnthropicKey reads it back", () => {
    setKeys({ anthropic: "sk-ant-test-123" });
    expect(getAnthropicKey()).toBe("sk-ant-test-123");
  });

  it("setKeys persists figma token and getFigmaToken reads it back", () => {
    setKeys({ figma: "figd-test-456" });
    expect(getFigmaToken()).toBe("figd-test-456");
  });

  it("setKeys with both keys persists both", () => {
    setKeys({ anthropic: "sk-ant-abc", figma: "figd-xyz" });
    expect(getAnthropicKey()).toBe("sk-ant-abc");
    expect(getFigmaToken()).toBe("figd-xyz");
  });

  it("writes the local config with owner-only permissions", () => {
    setKeys({ anthropic: "sk-ant-test" });
    expect(fs.statSync(configPath).mode & 0o777).toBe(0o600);
  });

  it("does not leave temporary config files behind", () => {
    setKeys({ figma: "figd-test" });
    expect(fs.readdirSync(tmpDir)).toEqual([".ds-config.json"]);
  });
});

describe("setKeys — does NOT clobber existing contentDir", () => {
  it("preserves contentDir when saving keys", () => {
    fs.writeFileSync(configPath, JSON.stringify({ contentDir: "/my/content" }), "utf-8");
    setKeys({ anthropic: "sk-ant-test" });
    const raw = JSON.parse(fs.readFileSync(configPath, "utf-8")) as Record<string, unknown>;
    expect(raw.contentDir).toBe("/my/content");
    expect(raw.anthropicKey).toBe("sk-ant-test");
  });

  it("preserves existing keys when setting only one new key", () => {
    setKeys({ anthropic: "sk-ant-first", figma: "figd-first" });
    setKeys({ figma: "figd-second" }); // only update figma
    expect(getAnthropicKey()).toBe("sk-ant-first"); // anthropic unchanged
    expect(getFigmaToken()).toBe("figd-second");
  });
});

describe("setKeys — empty string clears a key", () => {
  it("empty anthropic string removes the key", () => {
    setKeys({ anthropic: "sk-ant-test" });
    setKeys({ anthropic: "" });
    expect(getAnthropicKey()).toBeUndefined();
  });

  it("empty figma string removes the key", () => {
    setKeys({ figma: "figd-test" });
    setKeys({ figma: "" });
    expect(getFigmaToken()).toBeUndefined();
  });

  it("clearing one key does not clear the other", () => {
    setKeys({ anthropic: "sk-ant-keep", figma: "figd-keep" });
    setKeys({ anthropic: "" });
    expect(getAnthropicKey()).toBeUndefined();
    expect(getFigmaToken()).toBe("figd-keep");
  });
});

describe("env fallback when config absent", () => {
  it("getAnthropicKey falls back to ANTHROPIC_API_KEY env var", () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-from-env";
    expect(getAnthropicKey()).toBe("sk-ant-from-env");
  });

  it("getFigmaToken falls back to FIGMA_TOKEN env var", () => {
    process.env.FIGMA_TOKEN = "figd-from-env";
    expect(getFigmaToken()).toBe("figd-from-env");
  });

  it("config value takes precedence over env var", () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-env";
    setKeys({ anthropic: "sk-ant-config" });
    expect(getAnthropicKey()).toBe("sk-ant-config");
  });

  it("returns undefined when no config and no env", () => {
    expect(getAnthropicKey()).toBeUndefined();
    expect(getFigmaToken()).toBeUndefined();
  });
});

describe("getKeyStatus — booleans only, never raw keys", () => {
  it("returns false for both when nothing is set", () => {
    const status = getKeyStatus();
    expect(status.anthropic).toBe(false);
    expect(status.figma).toBe(false);
  });

  it("returns true for anthropic when config key is set", () => {
    setKeys({ anthropic: "sk-ant-test" });
    expect(getKeyStatus().anthropic).toBe(true);
    expect(getKeyStatus().figma).toBe(false);
  });

  it("returns true for figma when config key is set", () => {
    setKeys({ figma: "figd-test" });
    expect(getKeyStatus().figma).toBe(true);
    expect(getKeyStatus().anthropic).toBe(false);
  });

  it("returns true for anthropic when only env var is set", () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-env";
    expect(getKeyStatus().anthropic).toBe(true);
  });

  it("returns true for figma when only env var is set", () => {
    process.env.FIGMA_TOKEN = "figd-env";
    expect(getKeyStatus().figma).toBe(true);
  });

  it("getKeyStatus result does not contain raw key strings", () => {
    setKeys({ anthropic: "sk-ant-secret", figma: "figd-secret" });
    const status = getKeyStatus();
    // The result shape should only have boolean fields
    expect(typeof status.anthropic).toBe("boolean");
    expect(typeof status.figma).toBe("boolean");
    // No raw key properties
    const raw = status as Record<string, unknown>;
    expect(raw.anthropicKey).toBeUndefined();
    expect(raw.figmaToken).toBeUndefined();
    expect(raw.key).toBeUndefined();
  });
});
