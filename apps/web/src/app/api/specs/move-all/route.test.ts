import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as inboxMove from "@/lib/inboxMove";
import { OPTIONS as singleOptions, POST as singlePost } from "../move/route";
import { OPTIONS, POST } from "./route";

let contentDir: string;

beforeEach(() => {
  contentDir = fs.mkdtempSync(path.join(os.tmpdir(), "spec-move-route-"));
  process.env.DS_CONTENT_DIR = contentDir;
  fs.mkdirSync(path.join(contentDir, "_inbox"), { recursive: true });
});

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.DS_CONTENT_DIR;
  fs.rmSync(contentDir, { recursive: true, force: true });
});

function request(
  pathname: "move" | "move-all",
  body: string,
  options: { contentType?: string; origin?: string | null } = {},
): NextRequest {
  const headers = new Headers({
    "content-type": options.contentType ?? "application/json",
  });
  if (options.origin !== null) {
    headers.set("origin", options.origin ?? "http://localhost:3000");
  }
  return new NextRequest(`http://localhost:3000/api/specs/${pathname}`, {
    method: "POST",
    headers,
    body,
  });
}

function optionsRequest(
  pathname: "move" | "move-all",
  origin: string | null = "http://localhost:3000",
): NextRequest {
  const headers = new Headers();
  if (origin !== null) headers.set("origin", origin);
  return new NextRequest(`http://localhost:3000/api/specs/${pathname}`, {
    method: "OPTIONS",
    headers,
  });
}

function markdownPath(slug: string[]): string {
  return path.join(contentDir, ...slug) + ".md";
}

function writeInbox(name: string): void {
  fs.writeFileSync(markdownPath(["_inbox", name]), `# ${name}\n`, "utf-8");
}

describe("POST /api/specs/move-all", () => {
  it("returns a CORS-readable 400 for invalid JSON", async () => {
    const response = await POST(request("move-all", "{"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid JSON body" });
    expect(response.headers.get("access-control-allow-origin")).toBe(
      "http://localhost:3000",
    );
  });

  it.each(["null", "42", "[]"])("rejects a non-object JSON body: %s", async (body) => {
    const response = await POST(request("move-all", body));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid request body" });
  });

  it("rejects a non-JSON cross-origin request without moving files", async () => {
    writeInbox("button");

    const response = await POST(
      request(
        "move-all",
        JSON.stringify({ folder: "Components", items: [["_inbox", "button"]] }),
        { contentType: "text/plain", origin: "https://example.com" },
      ),
    );

    expect(response.status).toBe(415);
    await expect(response.json()).resolves.toEqual({
      error: "Content-Type must be application/json",
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
    expect(fs.existsSync(markdownPath(["components", "button"]))).toBe(false);
  });

  it("rejects application/jsonp without moving files", async () => {
    writeInbox("button");

    const response = await POST(
      request(
        "move-all",
        JSON.stringify({ folder: "Components", items: [["_inbox", "button"]] }),
        { contentType: "application/jsonp" },
      ),
    );

    expect(response.status).toBe(415);
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
    expect(fs.existsSync(markdownPath(["components", "button"]))).toBe(false);
  });

  it("accepts application/json with parameters", async () => {
    writeInbox("button");

    const response = await POST(
      request(
        "move-all",
        JSON.stringify({ folder: "Components", items: [["_inbox", "button"]] }),
        { contentType: " Application/JSON ; charset=utf-8 " },
      ),
    );

    expect(response.status).toBe(200);
    expect(fs.existsSync(markdownPath(["components", "button"]))).toBe(true);
  });

  it("rejects cross-origin JSON without moving files", async () => {
    writeInbox("button");

    const response = await POST(
      request(
        "move-all",
        JSON.stringify({ folder: "Components", items: [["_inbox", "button"]] }),
        { origin: "https://example.com" },
      ),
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Origin not allowed" });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
    expect(fs.existsSync(markdownPath(["components", "button"]))).toBe(false);
  });

  it("allows the Figma plugin's opaque null Origin to move files", async () => {
    writeInbox("button");

    const response = await POST(
      request(
        "move-all",
        JSON.stringify({ folder: "Components", items: [["_inbox", "button"]] }),
        { origin: "null" },
      ),
    );

    expect(response.status).toBe(200);
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(false);
    expect(fs.existsSync(markdownPath(["components", "button"]))).toBe(true);
  });

  it("allows JSON requests without an Origin header", async () => {
    writeInbox("button");

    const response = await POST(
      request(
        "move-all",
        JSON.stringify({ folder: "Components", items: [["_inbox", "button"]] }),
        { origin: null },
      ),
    );

    expect(response.status).toBe(200);
    expect(fs.existsSync(markdownPath(["components", "button"]))).toBe(true);
  });

  it("defaults a blank folder to components", async () => {
    writeInbox("button");

    const response = await POST(
      request(
        "move-all",
        JSON.stringify({ folder: "   ", items: [["_inbox", "button"]] }),
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      saved: [["components", "button"]],
      failures: [],
    });
    expect(fs.existsSync(markdownPath(["components", "button"]))).toBe(true);
  });

  it("returns item failures while saving valid items", async () => {
    writeInbox("button");

    const response = await POST(
      request(
        "move-all",
        JSON.stringify({
          folder: "Components",
          items: [["_inbox", "button"], ["components", "outside"]],
        }),
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      saved: [["components", "button"]],
      failures: [
        {
          source: ["components", "outside"],
          error: "Source must be a component directly inside _inbox",
        },
      ],
    });
  });

  it("maps empty items to the top-level InboxMoveError status", async () => {
    const response = await POST(
      request("move-all", JSON.stringify({ folder: "Components", items: [] })),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Items must be a non-empty array",
    });
  });

  it("rejects an unsafe folder before moving any items", async () => {
    writeInbox("button");

    const response = await POST(
      request(
        "move-all",
        JSON.stringify({ folder: "../components", items: [["_inbox", "button"]] }),
      ),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Folder must not contain '/', '\\', or '..'",
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
  });

  it("returns a stable 500 for an unknown top-level error", async () => {
    vi.spyOn(inboxMove, "saveAllInboxSpecs").mockImplementationOnce(() => {
      throw new Error("internal path details");
    });

    const response = await POST(
      request(
        "move-all",
        JSON.stringify({ folder: "Components", items: [["_inbox", "button"]] }),
      ),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to save Inbox items",
    });
  });

  it("allows same-origin and no-origin CORS preflight", () => {
    const response = OPTIONS(optionsRequest("move-all"));
    const noOriginResponse = OPTIONS(optionsRequest("move-all", null));

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe(
      "http://localhost:3000",
    );
    expect(response.headers.get("access-control-allow-methods")).toBe("GET, POST, OPTIONS");
    expect(noOriginResponse.status).toBe(204);
  });

  it.each(["https://example.com", "null"])(
    "does not allow disallowed CORS preflight origin %s",
    (origin) => {
      const response = OPTIONS(optionsRequest("move-all", origin));

      expect(response.status).toBe(204);
      expect(response.headers.get("access-control-allow-origin")).toBe(
        origin === "null" ? "null" : null,
      );
    },
  );
});

describe("POST /api/specs/move", () => {
  it.each(["null", "42", "[]"])("rejects a non-object JSON body: %s", async (body) => {
    const response = await singlePost(request("move", body));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid request body" });
  });
  it("preserves invalid JSON behavior and CORS headers", async () => {
    const response = await singlePost(request("move", "{"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid JSON body" });
    expect(response.headers.get("access-control-allow-origin")).toBe(
      "http://localhost:3000",
    );
  });

  it("moves an Inbox spec to a normalized custom name", async () => {
    writeInbox("draft-button");

    const response = await singlePost(
      request(
        "move",
        JSON.stringify({
          fromSlug: ["_inbox", "draft-button"],
          group: "Form Controls",
          name: "Icon Button",
        }),
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      slug: ["form-controls", "icon-button"],
    });
    expect(fs.existsSync(markdownPath(["form-controls", "icon-button"]))).toBe(true);
  });

  it("rejects a non-JSON cross-origin request without moving files", async () => {
    writeInbox("button");

    const response = await singlePost(
      request(
        "move",
        JSON.stringify({
          fromSlug: ["_inbox", "button"],
          group: "Components",
          name: "Button",
        }),
        { contentType: "text/plain", origin: "https://example.com" },
      ),
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "Request origin is not allowed",
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
    expect(fs.existsSync(markdownPath(["components", "button"]))).toBe(false);
  });

  it("rejects cross-origin JSON without moving files", async () => {
    writeInbox("button");

    const response = await singlePost(
      request(
        "move",
        JSON.stringify({
          fromSlug: ["_inbox", "button"],
          group: "Components",
          name: "Button",
        }),
        { origin: "https://example.com" },
      ),
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "Request origin is not allowed",
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
    expect(fs.existsSync(markdownPath(["components", "button"]))).toBe(false);
  });

  it("allows JSON requests without an Origin header", async () => {
    writeInbox("button");

    const response = await singlePost(
      request(
        "move",
        JSON.stringify({
          fromSlug: ["_inbox", "button"],
          group: "Components",
          name: "Button",
        }),
        { origin: null },
      ),
    );

    expect(response.status).toBe(200);
    expect(fs.existsSync(markdownPath(["components", "button"]))).toBe(true);
  });

  it("rejects a missing group without moving the source", async () => {
    writeInbox("button");

    const response = await singlePost(
      request(
        "move",
        JSON.stringify({
          fromSlug: ["_inbox", "button"],
          name: "Button",
        }),
      ),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Missing or invalid 'group' or 'name'",
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
    expect(fs.existsSync(markdownPath(["components", "button"]))).toBe(false);
  });

  it("validates missing fromSlug before missing group and name", async () => {
    writeInbox("button");

    const response = await singlePost(request("move", JSON.stringify({})));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Missing or invalid 'fromSlug'",
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
  });

  it("rejects an unsafe fromSlug before group and name validation", async () => {
    writeInbox("button");

    const response = await singlePost(
      request(
        "move",
        JSON.stringify({
          fromSlug: ["_inbox", "../button"],
        }),
      ),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Missing or invalid 'fromSlug'",
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
  });

  it("rejects a blank group without moving the source", async () => {
    writeInbox("button");

    const response = await singlePost(
      request(
        "move",
        JSON.stringify({
          fromSlug: ["_inbox", "button"],
          group: "   ",
          name: "Button",
        }),
      ),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Group and name must contain at least one alphanumeric character",
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
    expect(fs.existsSync(markdownPath(["components", "button"]))).toBe(false);
  });

  it.each([
    { group: "!!!", name: "Button" },
    { group: "Components", name: "!!!" },
  ])(
    "rejects punctuation-only group or name with the legacy message: %#",
    async ({ group, name }) => {
      writeInbox("button");

      const response = await singlePost(
        request(
          "move",
          JSON.stringify({
            fromSlug: ["_inbox", "button"],
            group,
            name,
          }),
        ),
      );

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({
        error: "Group and name must contain at least one alphanumeric character",
      });
      expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
    },
  );

  it("preserves the legacy traversal error payload", async () => {
    writeInbox("button");

    const response = await singlePost(
      request(
        "move",
        JSON.stringify({
          fromSlug: ["_inbox", "button"],
          group: "../components",
          name: "Button",
        }),
      ),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Group and name must not contain '/' or '..'",
    });
    expect(fs.existsSync(markdownPath(["_inbox", "button"]))).toBe(true);
  });

  it("preserves missing-source and destination-conflict statuses", async () => {
    const missing = await singlePost(
      request(
        "move",
        JSON.stringify({
          fromSlug: ["_inbox", "missing"],
          group: "Components",
          name: "Button",
        }),
      ),
    );
    expect(missing.status).toBe(404);

    writeInbox("button");
    fs.mkdirSync(path.dirname(markdownPath(["components", "button"])), {
      recursive: true,
    });
    fs.writeFileSync(markdownPath(["components", "button"]), "existing\n", "utf-8");

    const conflict = await singlePost(
      request(
        "move",
        JSON.stringify({
          fromSlug: ["_inbox", "button"],
          group: "Components",
          name: "Button",
        }),
      ),
    );
    expect(conflict.status).toBe(409);
  });

  it("allows same-origin and no-origin CORS preflight", () => {
    const response = singleOptions(optionsRequest("move"));
    const noOriginResponse = singleOptions(optionsRequest("move", null));

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe(
      "http://localhost:3000",
    );
    expect(noOriginResponse.status).toBe(204);
  });

  it.each(["https://example.com", "null"])(
    "does not allow disallowed CORS preflight origin %s",
    (origin) => {
      const response = singleOptions(optionsRequest("move", origin));

      expect(response.status).toBe(204);
      expect(response.headers.get("access-control-allow-origin")).toBe(
        origin === "null" ? "null" : null,
      );
    },
  );
});
