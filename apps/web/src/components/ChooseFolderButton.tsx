"use client";

import { useState } from "react";
import FolderPicker from "./FolderPicker";

export default function ChooseFolderButton({ label = "Choose folder…" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        {label}
      </button>
      {open && <FolderPicker onClose={() => setOpen(false)} />}
    </>
  );
}
