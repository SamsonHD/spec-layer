import YAML from 'yaml';

// Opening fence, optional YAML block (absent for an empty `---\n---` fence),
// then the closing fence and a single trailing newline.
const FRONTMATTER_RE = /^---[^\S\r\n]*\r?\n(?:([\s\S]*?)\r?\n)?---[^\S\r\n]*(?:\r?\n|$)/;

/**
 * Lenient frontmatter split. Returns the parsed YAML frontmatter (or an empty
 * object when absent/empty) and the remaining markdown body.
 *
 * Behavior contract (matching the gray-matter usage it replaces):
 *  - No frontmatter fence → `{ data: {}, content: <input> }`; never throws.
 *  - Empty fence (`---\n---`) → `{ data: {}, content: <body> }`.
 *  - Non-object YAML (a bare scalar or sequence) → coerced to `{}`.
 *  - Malformed YAML throws, so callers can reject unparseable uploads.
 *
 * Uses the maintained `yaml` package rather than gray-matter's unmaintained
 * js-yaml v3 dependency, which carries a known DoS advisory.
 */
export function parseMarkdown(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  // Strip a leading UTF-8 BOM, mirroring gray-matter.
  const input = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;

  const match = FRONTMATTER_RE.exec(input);
  if (!match) return { data: {}, content: input };

  const block = (match[1] ?? '').trim();
  const content = input.slice(match[0].length);
  if (block === '') return { data: {}, content };

  const parsed = YAML.parse(block) as unknown;
  const data =
    parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  return { data, content };
}
