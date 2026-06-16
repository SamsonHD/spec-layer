"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { commands } from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";

// The editor touches `document`/`window` at render, so it can only run on the
// client. Next 16's App Router renders client components on the server too, so
// we defer the actual import with `ssr: false`.
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

// Trimmed toolbar: the formatting marks our specs actually use. The right-hand
// `codeEdit / codeLive / codePreview / fullscreen` group gives the user the
// edit-only-with-preview-toggle behavior without us managing preview state.
const toolbar = [
  commands.bold,
  commands.italic,
  commands.strikethrough,
  commands.divider,
  commands.title2,
  commands.title3,
  commands.divider,
  commands.unorderedListCommand,
  commands.orderedListCommand,
  commands.checkedListCommand,
  commands.divider,
  commands.link,
  commands.quote,
  commands.code,
  commands.codeBlock,
  commands.table,
];

const extraCommands = [
  commands.codeEdit,
  commands.codeLive,
  commands.codePreview,
  commands.divider,
  commands.fullscreen,
];

/** Read the app theme (set as `data-theme` on <html>) for the editor's color mode. */
function useColorMode(): "light" | "dark" {
  const [mode, setMode] = useState<"light" | "dark">("light");
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setMode(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return mode;
}

export default function MarkdownEditor({
  value,
  onChange,
  disabled = false,
  textareaId,
  ariaLabel,
}: {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  textareaId?: string;
  ariaLabel?: string;
}) {
  const colorMode = useColorMode();

  return (
    <div data-color-mode={colorMode} className="section-md-editor">
      <MDEditor
        value={value}
        onChange={(next) => onChange(next ?? "")}
        // Default to source editing; the toolbar toggle reveals the preview.
        preview="edit"
        commands={toolbar}
        extraCommands={extraCommands}
        height={320}
        textareaProps={{
          id: textareaId,
          disabled,
          "aria-label": ariaLabel,
        }}
      />
    </div>
  );
}
