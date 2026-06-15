# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| `0.1.x` | Yes |
| Earlier/unreleased revisions | No |

Security fixes are applied to the latest `0.1.x` release and the latest revision of `main`.

## Reporting a vulnerability

Use GitHub's private security advisory feature for this repository. Include reproduction steps, affected files, impact, and any suggested mitigation. Do not include real credentials or private design-system data.

If private advisories are unavailable, contact the maintainers privately before disclosing the issue publicly. Allow a reasonable remediation period before publication.

## Local application threat model

The docs app reads and writes local files and may use Anthropic and Figma credentials. It is intended to bind to loopback and is not a hardened public or multi-user service.

- Keep it bound to the loopback interface (the dev/start scripts bind to `localhost`).
- The Figma plugin's **Send to docs** posts from an opaque origin and is permitted without a token; do not rely on the docs app for authentication.
- Do not expose the development server through a public tunnel, shared host, or permissive reverse proxy.
- Store credentials in environment variables where possible. `.ds-config.json` is local, owner-readable configuration and must never be committed.
- Treat imported Markdown and Figma component metadata as potentially sensitive.

If credentials were ever committed or exposed through a public deployment, rotate them immediately.
