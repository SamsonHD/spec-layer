"use client";

import { useState } from "react";

interface KeyStatus {
  anthropic: boolean;
  figma: boolean;
}

interface Props {
  contentDir: string;
  initialKeys: KeyStatus;
}

export default function SettingsForm({ contentDir, initialKeys }: Props) {
  const [keys, setKeys] = useState<KeyStatus>(initialKeys);
  const [anthropicInput, setAnthropicInput] = useState("");
  const [figmaInput, setFigmaInput] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    const body: { anthropic?: string; figma?: string } = {};
    // Only include fields the user touched (non-empty input = set key; "clear" token)
    // We always send both fields that are shown; blank = "leave unchanged" is NOT
    // the UX here — users explicitly clear via the clear button.
    // If an input has a value, we send it. If it's empty, we leave that key unchanged
    // (user didn't interact with this field on this save).
    if (anthropicInput !== "") body.anthropic = anthropicInput;
    if (figmaInput !== "") body.figma = figmaInput;

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { keys?: KeyStatus; error?: string };
      if (!res.ok || data.error) {
        setStatus({ type: "error", message: data.error ?? "Failed to save settings." });
      } else if (data.keys) {
        setKeys(data.keys);
        setAnthropicInput("");
        setFigmaInput("");
        setStatus({ type: "success", message: "Settings saved." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error — could not save settings." });
    } finally {
      setSaving(false);
    }
  }

  async function handleClear(field: "anthropic" | "figma") {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: "" }),
      });
      const data = (await res.json()) as { keys?: KeyStatus; error?: string };
      if (!res.ok || data.error) {
        setStatus({ type: "error", message: data.error ?? "Failed to clear key." });
      } else if (data.keys) {
        setKeys(data.keys);
        if (field === "anthropic") setAnthropicInput("");
        else setFigmaInput("");
        setStatus({ type: "success", message: "Key cleared." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error — could not clear key." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="settings-form" onSubmit={handleSave} noValidate>
      {/* Content directory — read-only informational */}
      <section className="settings-section">
        <h2 className="settings-section-title">Content directory</h2>
        <p className="settings-section-desc">
          The folder where component docs are stored. Change this via{" "}
          <code>contentDir</code> in <code>.ds-config.json</code> or the{" "}
          <code>DS_CONTENT_DIR</code> environment variable.
        </p>
        <div className="settings-field">
          <label className="settings-label" htmlFor="settings-content-dir">
            Current path
          </label>
          <input
            id="settings-content-dir"
            className="settings-input settings-input-readonly"
            type="text"
            value={contentDir}
            readOnly
            aria-readonly="true"
          />
        </div>
      </section>

      {/* API keys */}
      <section className="settings-section">
        <h2 className="settings-section-title">API keys</h2>
        <p className="settings-section-desc">
          Keys are stored locally in <code>.ds-config.json</code> (gitignored) and read
          server-side only. They are never sent to the browser in full.
        </p>

        {/* Anthropic */}
        <div className="settings-field">
          <label className="settings-label" htmlFor="settings-anthropic-key">
            Anthropic API key
          </label>
          {keys.anthropic && (
            <div className="settings-configured-row">
              <span className="settings-configured-badge">Configured &#10003;</span>
              <button
                type="button"
                className="settings-clear-btn"
                onClick={() => void handleClear("anthropic")}
                disabled={saving}
              >
                Clear
              </button>
            </div>
          )}
          <input
            id="settings-anthropic-key"
            className="settings-input"
            type="password"
            autoComplete="new-password"
            placeholder={keys.anthropic ? "Enter a new key to replace" : "sk-ant-..."}
            value={anthropicInput}
            onChange={(e) => setAnthropicInput(e.target.value)}
            aria-describedby="settings-anthropic-hint"
          />
          <p id="settings-anthropic-hint" className="settings-hint">
            Used for AI prose enrichment when importing or regenerating component specs.
          </p>
        </div>

        {/* Figma */}
        <div className="settings-field">
          <label className="settings-label" htmlFor="settings-figma-token">
            Figma personal access token
          </label>
          {keys.figma && (
            <div className="settings-configured-row">
              <span className="settings-configured-badge">Configured &#10003;</span>
              <button
                type="button"
                className="settings-clear-btn"
                onClick={() => void handleClear("figma")}
                disabled={saving}
              >
                Clear
              </button>
            </div>
          )}
          <input
            id="settings-figma-token"
            className="settings-input"
            type="password"
            autoComplete="new-password"
            placeholder={keys.figma ? "Enter a new token to replace" : "figd-..."}
            value={figmaInput}
            onChange={(e) => setFigmaInput(e.target.value)}
            aria-describedby="settings-figma-hint"
          />
          <p id="settings-figma-hint" className="settings-hint">
            Used to fetch live Figma component previews.
          </p>
        </div>
      </section>

      {status && (
        <div
          role="alert"
          className={`settings-alert ${status.type === "success" ? "settings-alert-success" : "settings-alert-error"}`}
        >
          {status.message}
        </div>
      )}

      <div className="settings-actions">
        <button
          type="submit"
          className="btn-primary"
          disabled={saving || (anthropicInput === "" && figmaInput === "")}
        >
          {saving ? "Saving…" : "Save keys"}
        </button>
      </div>
    </form>
  );
}
