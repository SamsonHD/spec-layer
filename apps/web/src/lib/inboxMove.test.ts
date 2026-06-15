import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearInboxSpecs,
  InboxMoveError,
  moveInboxSpec,
  moveInboxSpecAs,
  normalizeInboxFolder,
  saveAllInboxSpecs,
} from "./inboxMove";

let dir: string;
let externalDirs: string[];

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "inbox-move-"));
  externalDirs = [];
  process.env.DS_CONTENT_DIR = dir;
  fs.mkdirSync(path.join(dir, "_inbox"), { recursive: true });
});

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(dir, { recursive: true, force: true });
  for (const externalDir of externalDirs) {
    fs.rmSync(externalDir, { recursive: true, force: true });
  }
});

function markdownPath(slug: string[]): string {
  return path.join(dir, ...slug) + ".md";
}

function sidecarPath(slug: string[]): string {
  return path.join(dir, ".spec-data", ...slug) + ".json";
}

function writeInbox(name: string, sidecar = false): void {
  fs.writeFileSync(markdownPath(["_inbox", name]), `# ${name}\n`, "utf-8");
  if (sidecar) {
    const filePath = sidecarPath(["_inbox", name]);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify({ name }), "utf-8");
  }
}

function makeExternalDir(): string {
  const externalDir = fs.mkdtempSync(path.join(os.tmpdir(), "inbox-move-external-"));
  externalDirs.push(externalDir);
  return externalDir;
}

function expectStatus(run: () => unknown, status: InboxMoveError["status"]): void {
  try {
    run();
    throw new Error("Expected InboxMoveError");
  } catch (error) {
    expect(error).toBeInstanceOf(InboxMoveError);
    expect((error as InboxMoveError).status).toBe(status);
  }
}

describe("normalizeInboxFolder", () => {
  it("defaults undefined and blank folders to components", () => {
    expect(normalizeInboxFolder(undefined)).toBe("components");
    expect(normalizeInboxFolder("   ")).toBe("components");
  });

  it("normalizes a visible folder name with the shared slugifier", () => {
    expect(normalizeInboxFolder("Form Controls")).toBe("form-controls");
  });

  it.each([{ value: null }, { value: 42 }, { value: {} }, { value: [] }])(
    "rejects non-string folder input %#",
    ({ value }) => {
      expectStatus(() => normalizeInboxFolder(value), 400);
    },
  );

  it.each(["forms/inputs", "forms\\inputs", "../outside", "forms..archive"])(
    "rejects traversal characters in %s",
    (value) => {
      expectStatus(() => normalizeInboxFolder(value), 400);
    },
  );

  it("rejects a folder name that slugifies to empty", () => {
    expectStatus(() => normalizeInboxFolder("!!!"), 400);
  });
});

describe("moveInboxSpec", () => {
  it("moves markdown without a sidecar and preserves its filename", () => {
    writeInbox("button");

    expect(moveInboxSpec(["_inbox", "button"], "Components")).toEqual([
      "components",
      "button",
    ]);
    expect(fs.readFileSync(markdownPath(["components", "button"]), "utf-8")).toBe(
      "# button\n",
    );
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(false);
    expect(fs.existsSync(sidecarPath(["components", "button"]))).toBe(false);
  });

  it("moves the optional spec-data sidecar with the markdown", () => {
    writeInbox("button", true);

    expect(moveInboxSpec(["_inbox", "button"], "Form Controls")).toEqual([
      "form-controls",
      "button",
    ]);
    expect(fs.existsSync(markdownPath(["form-controls", "button"]))).toBe(true);
    expect(fs.readFileSync(sidecarPath(["form-controls", "button"]), "utf-8")).toBe(
      JSON.stringify({ name: "button" }),
    );
    expect(fs.existsSync(sidecarPath(["_inbox", "button"]))).toBe(false);
  });

  it.each([
    { source: ["components", "button"] },
    { source: ["_inbox"] },
    { source: ["_inbox", "nested", "button"] },
    { source: ["_inbox", "../button"] },
    { source: ["_inbox", "."] },
  ])("rejects a source that is not directly inside _inbox: $source", ({ source }) => {
    expectStatus(() => moveInboxSpec(source, "Components"), 400);
  });

  it("does not treat the inbox directory marker as a direct file child", () => {
    fs.writeFileSync(path.join(dir, "_inbox.md"), "outside inbox\n", "utf-8");

    expectStatus(() => moveInboxSpec(["_inbox", "."], "Components"), 400);
    expect(fs.readFileSync(path.join(dir, "_inbox.md"), "utf-8")).toBe("outside inbox\n");
    expect(fs.existsSync(markdownPath(["components", "."]))).toBe(false);
  });

  it("rejects a symlinked inbox without reading or deleting the external source", () => {
    const externalDir = makeExternalDir();
    const externalSource = path.join(externalDir, "button.md");
    fs.writeFileSync(externalSource, "external source\n", "utf-8");
    fs.rmSync(path.join(dir, "_inbox"), { recursive: true });
    fs.symlinkSync(externalDir, path.join(dir, "_inbox"), "dir");

    expect(() => moveInboxSpec(["_inbox", "button"], "Components")).toThrowError(
      expect.objectContaining({
        message: "Source path must not contain symbolic links",
        status: 400,
      }),
    );
    expect(fs.readFileSync(externalSource, "utf-8")).toBe("external source\n");
    expect(fs.existsSync(markdownPath(["components", "button"]))).toBe(false);
  });

  it("rejects a symlinked destination folder without writing outside the content dir", () => {
    writeInbox("button");
    const externalDir = makeExternalDir();
    fs.symlinkSync(externalDir, path.join(dir, "components"), "dir");

    expect(() => moveInboxSpec(["_inbox", "button"], "Components")).toThrowError(
      expect.objectContaining({
        message: "Destination path must not contain symbolic links",
        status: 409,
      }),
    );
    expect(fs.existsSync(path.join(externalDir, "button.md"))).toBe(false);
    expect(fs.readFileSync(markdownPath(["_inbox", "button"]), "utf-8")).toBe("# button\n");
  });

  it("rejects a symlinked spec-data directory without reading or writing externally", () => {
    writeInbox("button");
    const externalDir = makeExternalDir();
    const externalSidecar = path.join(externalDir, "_inbox", "button.json");
    fs.mkdirSync(path.dirname(externalSidecar), { recursive: true });
    fs.writeFileSync(externalSidecar, "external sidecar\n", "utf-8");
    fs.symlinkSync(externalDir, path.join(dir, ".spec-data"), "dir");

    expect(() => moveInboxSpec(["_inbox", "button"], "Components")).toThrowError(
      expect.objectContaining({
        message: "Source path must not contain symbolic links",
        status: 400,
      }),
    );
    expect(fs.readFileSync(externalSidecar, "utf-8")).toBe("external sidecar\n");
    expect(fs.existsSync(path.join(externalDir, "components", "button.json"))).toBe(false);
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
  });

  it("reports a missing source without creating the destination", () => {
    expectStatus(() => moveInboxSpec(["_inbox", "missing"], "Components"), 404);
    expect(fs.existsSync(markdownPath(["components", "missing"]))).toBe(false);
  });

  it("rejects an existing destination markdown without overwriting", () => {
    writeInbox("button");
    const destination = markdownPath(["components", "button"]);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, "existing\n", "utf-8");

    expectStatus(() => moveInboxSpec(["_inbox", "button"], "Components"), 409);
    expect(fs.readFileSync(destination, "utf-8")).toBe("existing\n");
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
  });

  it("rejects an existing destination sidecar even when the source has none", () => {
    writeInbox("button");
    const destination = sidecarPath(["components", "button"]);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, "existing\n", "utf-8");

    expectStatus(() => moveInboxSpec(["_inbox", "button"], "Components"), 409);
    expect(fs.readFileSync(destination, "utf-8")).toBe("existing\n");
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
  });

  it("maps a destination race to 409 without overwriting either file", () => {
    writeInbox("button");
    const source = markdownPath(["_inbox", "button"]);
    const destination = markdownPath(["components", "button"]);
    const copyFileSync = fs.copyFileSync.bind(fs);
    vi.spyOn(fs, "copyFileSync").mockImplementationOnce((from, to, mode) => {
      fs.writeFileSync(destination, "concurrent destination\n", "utf-8");
      copyFileSync(from, to, mode);
    });

    expectStatus(() => moveInboxSpec(["_inbox", "button"], "Components"), 409);
    expect(fs.readFileSync(source, "utf-8")).toBe("# button\n");
    expect(fs.readFileSync(destination, "utf-8")).toBe("concurrent destination\n");
  });

  it("returns a stable error when the markdown copy fails", () => {
    writeInbox("button");
    vi.spyOn(fs, "copyFileSync").mockImplementationOnce(() => {
      throw new Error(`copy failed at ${markdownPath(["_inbox", "button"])}`);
    });

    expect(() => moveInboxSpec(["_inbox", "button"], "Components")).toThrowError(
      expect.objectContaining({ message: "Failed to move spec", status: 500 }),
    );
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
  });

  it("reports when markdown source and destination copies may both remain", () => {
    writeInbox("button");
    vi.spyOn(fs, "unlinkSync").mockImplementation(() => {
      throw new Error("unlink failed");
    });

    expect(() => moveInboxSpec(["_inbox", "button"], "Components")).toThrowError(
      expect.objectContaining({
        message:
          "Failed to remove _inbox/button.md after copying to components/button.md; both copies may remain",
        status: 500,
      }),
    );
    expect(fs.readFileSync(markdownPath(["_inbox", "button"]), "utf-8")).toBe("# button\n");
    expect(fs.readFileSync(markdownPath(["components", "button"]), "utf-8")).toBe(
      "# button\n",
    );
  });

  it("rolls markdown back when moving the sidecar fails", () => {
    writeInbox("button", true);
    const copyFileSync = fs.copyFileSync.bind(fs);
    let copyCount = 0;
    vi.spyOn(fs, "copyFileSync").mockImplementation((source, destination, mode) => {
      copyCount++;
      if (copyCount === 2) {
        throw new Error(`sidecar failed at ${String(destination)}`);
      }
      copyFileSync(source, destination, mode);
    });

    expect(() => moveInboxSpec(["_inbox", "button"], "Components")).toThrowError(
      expect.objectContaining({ message: "Failed to move sidecar", status: 500 }),
    );
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
    expect(fs.existsSync(sidecarPath(["_inbox", "button"]))).toBe(true);
    expect(fs.existsSync(markdownPath(["components", "button"]))).toBe(false);
  });

  it("rolls markdown back and reports when both sidecar copies may remain", () => {
    writeInbox("button", true);
    const unlinkSync = fs.unlinkSync.bind(fs);
    let unlinkCount = 0;
    vi.spyOn(fs, "unlinkSync").mockImplementation((filePath) => {
      unlinkCount++;
      if (unlinkCount === 2 || unlinkCount === 3) {
        throw new Error("sidecar unlink failed");
      }
      unlinkSync(filePath);
    });

    expect(() => moveInboxSpec(["_inbox", "button"], "Components")).toThrowError(
      expect.objectContaining({
        message:
          "Failed to remove .spec-data/_inbox/button.json after copying to .spec-data/components/button.json; both copies may remain",
        status: 500,
      }),
    );
    expect(fs.readFileSync(markdownPath(["_inbox", "button"]), "utf-8")).toBe("# button\n");
    expect(fs.existsSync(markdownPath(["components", "button"]))).toBe(false);
    expect(fs.existsSync(sidecarPath(["_inbox", "button"]))).toBe(true);
    expect(fs.existsSync(sidecarPath(["components", "button"]))).toBe(true);
  });

  it("preserves the moved markdown at its destination when rollback fails", () => {
    writeInbox("button", true);
    const copyFileSync = fs.copyFileSync.bind(fs);
    let copyCount = 0;
    vi.spyOn(fs, "copyFileSync").mockImplementation((source, destination, mode) => {
      copyCount++;
      if (copyCount === 2) {
        const error = new Error("sidecar path: " + String(source)) as NodeJS.ErrnoException;
        error.code = "EIO";
        throw error;
      }
      if (copyCount === 3) {
        const error = new Error("rollback path: " + String(destination)) as NodeJS.ErrnoException;
        error.code = "EIO";
        throw error;
      }
      copyFileSync(source, destination, mode);
    });

    expect(() => moveInboxSpec(["_inbox", "button"], "Components")).toThrowError(
      expect.objectContaining({
        message: "Failed to roll back markdown; moved copy remains at components/button.md",
        status: 500,
      }),
    );
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(false);
    expect(fs.readFileSync(markdownPath(["components", "button"]), "utf-8")).toBe(
      "# button\n",
    );
    expect(fs.existsSync(sidecarPath(["_inbox", "button"]))).toBe(true);
  });
});

describe("moveInboxSpecAs", () => {
  it("moves to a normalized custom name", () => {
    writeInbox("draft-button", true);

    expect(moveInboxSpecAs(["_inbox", "draft-button"], "Form Controls", "Icon Button")).toEqual([
      "form-controls",
      "icon-button",
    ]);
    expect(fs.existsSync(markdownPath(["form-controls", "icon-button"]))).toBe(true);
    expect(fs.existsSync(sidecarPath(["form-controls", "icon-button"]))).toBe(true);
  });

  it.each([undefined, 42, "", "!!!", "../button", "button/name", "button\\name"])(
    "rejects an invalid custom name %#",
    (name) => {
      writeInbox("button");
      expectStatus(() => moveInboxSpecAs(["_inbox", "button"], "Components", name), 400);
      expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
    },
  );
});

describe("saveAllInboxSpecs", () => {
  it.each([
    { items: undefined },
    { items: null },
    { items: {} },
    { items: "button" },
    { items: [] },
  ])(
    "rejects a non-array or empty request %#",
    ({ items }) => {
      expectStatus(() => saveAllInboxSpecs(items, "Components"), 400);
    },
  );

  it("defaults the folder once for the batch", () => {
    writeInbox("button");
    writeInbox("input");

    expect(
      saveAllInboxSpecs(
        [
          ["_inbox", "button"],
          ["_inbox", "input"],
        ],
        undefined,
      ),
    ).toEqual({
      saved: [
        ["components", "button"],
        ["components", "input"],
      ],
      failures: [],
    });
  });

  it("rejects an invalid folder before processing any source", () => {
    writeInbox("button");

    expectStatus(
      () => saveAllInboxSpecs([["_inbox", "button"]], "../components"),
      400,
    );
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
  });

  it("moves successful entries and reports failures independently", () => {
    writeInbox("button");
    writeInbox("input");
    writeInbox("select", true);
    const conflict = markdownPath(["components", "input"]);
    fs.mkdirSync(path.dirname(conflict), { recursive: true });
    fs.writeFileSync(conflict, "existing\n", "utf-8");

    const result = saveAllInboxSpecs(
      [
        ["_inbox", "button"],
        ["_inbox", "input"],
        ["components", "outside"],
        ["_inbox", "select"],
      ],
      "Components",
    );

    expect(result).toEqual({
      saved: [
        ["components", "button"],
        ["components", "select"],
      ],
      failures: [
        { source: ["_inbox", "input"], error: "Destination file already exists" },
        {
          source: ["components", "outside"],
          error: "Source must be a component directly inside _inbox",
        },
      ],
    });
    expect(fs.existsSync(markdownPath(["_inbox", "input"]))).toBe(true);
    expect(fs.existsSync(markdownPath(["components", "button"]))).toBe(true);
    expect(fs.existsSync(sidecarPath(["components", "select"]))).toBe(true);
  });
});

describe("clearInboxSpecs", () => {
  it.each([
    { items: undefined },
    { items: null },
    { items: {} },
    { items: "button" },
    { items: [] },
  ])("rejects a non-array or empty request %#", ({ items }) => {
    expectStatus(() => clearInboxSpecs(items), 400);
  });

  it("deletes markdown without a sidecar", () => {
    writeInbox("button");

    expect(clearInboxSpecs([["_inbox", "button"]])).toEqual({
      deleted: [["_inbox", "button"]],
      failures: [],
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(false);
  });

  it("deletes markdown together with its sidecar", () => {
    writeInbox("button", true);

    expect(clearInboxSpecs([["_inbox", "button"]])).toEqual({
      deleted: [["_inbox", "button"]],
      failures: [],
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(false);
    expect(fs.existsSync(sidecarPath(["_inbox", "button"]))).toBe(false);
  });

  it("reports a missing markdown file as a failure", () => {
    expect(clearInboxSpecs([["_inbox", "missing"]])).toEqual({
      deleted: [],
      failures: [{ source: ["_inbox", "missing"], error: "Source file not found" }],
    });
  });

  it("deletes valid entries and reports failures independently", () => {
    writeInbox("button");
    writeInbox("input", true);

    const result = clearInboxSpecs([
      ["_inbox", "button"],
      ["components", "outside"],
      ["_inbox", "input"],
    ]);

    expect(result).toEqual({
      deleted: [
        ["_inbox", "button"],
        ["_inbox", "input"],
      ],
      failures: [
        {
          source: ["components", "outside"],
          error: "Source must be a component directly inside _inbox",
        },
      ],
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(false);
    expect(fs.existsSync(markdownPath(["_inbox", "input"]))).toBe(false);
    expect(fs.existsSync(sidecarPath(["_inbox", "input"]))).toBe(false);
  });

  it("rejects a symlinked inbox as a failure without deleting the external source", () => {
    const externalDir = makeExternalDir();
    const externalSource = path.join(externalDir, "button.md");
    fs.writeFileSync(externalSource, "external source\n", "utf-8");
    fs.rmSync(path.join(dir, "_inbox"), { recursive: true });
    fs.symlinkSync(externalDir, path.join(dir, "_inbox"), "dir");

    expect(clearInboxSpecs([["_inbox", "button"]])).toEqual({
      deleted: [],
      failures: [
        {
          source: ["_inbox", "button"],
          error: "Source path must not contain symbolic links",
        },
      ],
    });
    expect(fs.readFileSync(externalSource, "utf-8")).toBe("external source\n");
  });
});
