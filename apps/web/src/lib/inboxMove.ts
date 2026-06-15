import fs from "node:fs";
import path from "node:path";
import { getContentDir } from "./config";
import { hasTraversal, isSafeSlug } from "./specApi";
import { slugify } from "./specWriter";

export class InboxMoveError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 404 | 409 | 500,
  ) {
    super(message);
    this.name = "InboxMoveError";
  }
}

class InboxMovePartialError extends InboxMoveError {}

export function normalizeInboxFolder(raw: unknown): string {
  if (raw === undefined || (typeof raw === "string" && !raw.trim())) {
    return "components";
  }
  if (typeof raw !== "string") {
    throw new InboxMoveError("Folder must be a string", 400);
  }
  if (hasTraversal(raw)) {
    throw new InboxMoveError("Folder must not contain '/', '\\', or '..'", 400);
  }

  const folder = slugify(raw);
  if (!folder) {
    throw new InboxMoveError("Folder must contain an alphanumeric character", 400);
  }
  return folder;
}

function normalizeInboxName(raw: unknown): string {
  if (typeof raw !== "string") {
    throw new InboxMoveError("Name must be a string", 400);
  }
  if (hasTraversal(raw)) {
    throw new InboxMoveError("Name must not contain '/', '\\', or '..'", 400);
  }

  const name = slugify(raw);
  if (!name) {
    throw new InboxMoveError("Name must contain an alphanumeric character", 400);
  }
  return name;
}

function requireInboxSlug(value: unknown): string[] {
  if (
    !isSafeSlug(value) ||
    value.length !== 2 ||
    value[0] !== "_inbox" ||
    value[1] === "."
  ) {
    throw new InboxMoveError("Source must be a component directly inside _inbox", 400);
  }
  return value;
}

function getSidecarPath(contentDir: string, slug: string[]): string {
  return path.join(contentDir, ".spec-data", ...slug) + ".json";
}

function assertNoSymbolicLinks(
  contentDir: string,
  target: string,
  status: 400 | 409,
  message: string,
): void {
  const relative = path.relative(contentDir, target);
  const components = relative ? relative.split(path.sep) : [];
  let current = contentDir;

  for (const component of ["", ...components]) {
    if (component) current = path.join(current, component);
    try {
      if (fs.lstatSync(current).isSymbolicLink()) {
        throw new InboxMoveError(message, status);
      }
    } catch (error) {
      if (error instanceof InboxMoveError) throw error;
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
      throw new InboxMoveError("Failed to validate spec paths", 500);
    }
  }
}

function moveFileExclusive(
  source: string,
  destination: string,
  sourceLabel: string,
  destinationLabel: string,
  conflictMessage: string,
  failureMessage: string,
): void {
  try {
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      throw new InboxMoveError(conflictMessage, 409);
    }
    throw new InboxMoveError(failureMessage, 500);
  }

  try {
    fs.unlinkSync(source);
  } catch {
    try {
      fs.unlinkSync(destination);
    } catch {
      throw new InboxMovePartialError(
        `Failed to remove ${sourceLabel} after copying to ${destinationLabel}; both copies may remain`,
        500,
      );
    }
    throw new InboxMoveError(failureMessage, 500);
  }
}

function moveInboxSpecTo(source: string[], folder: string, name: string): string[] {
  const destination = [folder, name];
  const contentDir = getContentDir();
  const sourceMarkdown = path.join(contentDir, ...source) + ".md";
  const destinationMarkdown = path.join(contentDir, ...destination) + ".md";
  const sourceSidecar = getSidecarPath(contentDir, source);
  const destinationSidecar = getSidecarPath(contentDir, destination);

  assertNoSymbolicLinks(
    contentDir,
    sourceMarkdown,
    400,
    "Source path must not contain symbolic links",
  );
  assertNoSymbolicLinks(
    contentDir,
    destinationMarkdown,
    409,
    "Destination path must not contain symbolic links",
  );
  assertNoSymbolicLinks(
    contentDir,
    sourceSidecar,
    400,
    "Source path must not contain symbolic links",
  );
  assertNoSymbolicLinks(
    contentDir,
    destinationSidecar,
    409,
    "Destination path must not contain symbolic links",
  );

  if (!fs.existsSync(sourceMarkdown)) {
    throw new InboxMoveError("Source file not found", 404);
  }
  if (fs.existsSync(destinationMarkdown)) {
    throw new InboxMoveError("Destination file already exists", 409);
  }
  if (fs.existsSync(destinationSidecar)) {
    throw new InboxMoveError("Destination sidecar already exists", 409);
  }

  try {
    fs.mkdirSync(path.dirname(destinationMarkdown), { recursive: true });
    moveFileExclusive(
      sourceMarkdown,
      destinationMarkdown,
      `${source.join("/")}.md`,
      `${destination.join("/")}.md`,
      "Destination file already exists",
      "Failed to move spec",
    );
  } catch (error) {
    if (error instanceof InboxMoveError) throw error;
    throw new InboxMoveError("Failed to move spec", 500);
  }

  if (fs.existsSync(sourceSidecar)) {
    try {
      fs.mkdirSync(path.dirname(destinationSidecar), { recursive: true });
      moveFileExclusive(
        sourceSidecar,
        destinationSidecar,
        `.spec-data/${source.join("/")}.json`,
        `.spec-data/${destination.join("/")}.json`,
        "Destination sidecar already exists",
        "Failed to move sidecar",
      );
    } catch (error) {
      try {
        assertNoSymbolicLinks(
          contentDir,
          destinationMarkdown,
          409,
          "Destination path must not contain symbolic links",
        );
        assertNoSymbolicLinks(
          contentDir,
          sourceMarkdown,
          400,
          "Source path must not contain symbolic links",
        );
        moveFileExclusive(
          destinationMarkdown,
          sourceMarkdown,
          `${destination.join("/")}.md`,
          `${source.join("/")}.md`,
          "Source file already exists during rollback",
          "Failed to roll back markdown",
        );
      } catch (rollbackError) {
        if (rollbackError instanceof InboxMovePartialError) throw rollbackError;
        throw new InboxMoveError(
          `Failed to roll back markdown; moved copy remains at ${destination.join("/")}.md`,
          500,
        );
      }
      if (error instanceof InboxMoveError) throw error;
      throw new InboxMoveError("Failed to move sidecar", 500);
    }
  }

  return destination;
}

export function moveInboxSpec(fromSlug: unknown, rawFolder: unknown): string[] {
  const source = requireInboxSlug(fromSlug);
  const folder = normalizeInboxFolder(rawFolder);
  return moveInboxSpecTo(source, folder, source[1]);
}

export function moveInboxSpecAs(
  fromSlug: unknown,
  rawFolder: unknown,
  rawName: unknown,
): string[] {
  const source = requireInboxSlug(fromSlug);
  const folder = normalizeInboxFolder(rawFolder);
  const name = normalizeInboxName(rawName);
  return moveInboxSpecTo(source, folder, name);
}

export function saveAllInboxSpecs(
  items: unknown,
  rawFolder: unknown,
): { saved: string[][]; failures: Array<{ source: string[]; error: string }> } {
  if (!Array.isArray(items) || items.length === 0) {
    throw new InboxMoveError("Items must be a non-empty array", 400);
  }

  const folder = normalizeInboxFolder(rawFolder);
  const saved: string[][] = [];
  const failures: Array<{ source: string[]; error: string }> = [];

  for (const item of items) {
    const source = Array.isArray(item)
      ? item.filter((part): part is string => typeof part === "string")
      : [];
    try {
      const validatedSource = requireInboxSlug(item);
      saved.push(moveInboxSpecTo(validatedSource, folder, validatedSource[1]));
    } catch (error) {
      failures.push({
        source,
        error: error instanceof Error ? error.message : "Failed to move spec",
      });
    }
  }

  return { saved, failures };
}

function deleteInboxSpecAt(source: string[]): string[] {
  const contentDir = getContentDir();
  const sourceMarkdown = path.join(contentDir, ...source) + ".md";
  const sourceSidecar = getSidecarPath(contentDir, source);

  assertNoSymbolicLinks(
    contentDir,
    sourceMarkdown,
    400,
    "Source path must not contain symbolic links",
  );
  assertNoSymbolicLinks(
    contentDir,
    sourceSidecar,
    400,
    "Source path must not contain symbolic links",
  );

  if (!fs.existsSync(sourceMarkdown)) {
    throw new InboxMoveError("Source file not found", 404);
  }

  try {
    fs.unlinkSync(sourceMarkdown);
  } catch {
    throw new InboxMoveError("Failed to delete spec", 500);
  }

  if (fs.existsSync(sourceSidecar)) {
    try {
      fs.unlinkSync(sourceSidecar);
    } catch {
      // Best-effort: a leftover sidecar is harmless and recoverable via git.
    }
  }

  return source;
}

export function clearInboxSpecs(items: unknown): {
  deleted: string[][];
  failures: Array<{ source: string[]; error: string }>;
} {
  if (!Array.isArray(items) || items.length === 0) {
    throw new InboxMoveError("Items must be a non-empty array", 400);
  }

  const deleted: string[][] = [];
  const failures: Array<{ source: string[]; error: string }> = [];

  for (const item of items) {
    const source = Array.isArray(item)
      ? item.filter((part): part is string => typeof part === "string")
      : [];
    try {
      const validatedSource = requireInboxSlug(item);
      deleted.push(deleteInboxSpecAt(validatedSource));
    } catch (error) {
      failures.push({
        source,
        error: error instanceof Error ? error.message : "Failed to delete spec",
      });
    }
  }

  return { deleted, failures };
}
