# Security Policy

## Supported versions

Security fixes are applied to the latest revision of `main`. The project has not published a stable release line yet.

## Reporting a vulnerability

Use GitHub's private security advisory feature for this repository. Include reproduction steps, affected files, impact, and any suggested mitigation. Do not include real credentials or private design-system data.

If private advisories are unavailable, contact the maintainers privately before disclosing the issue publicly. Allow a reasonable remediation period before publication.

## Local application threat model

The docs app reads and writes local files and may use Anthropic and Figma credentials. It is intended to bind to loopback and is not a hardened public or multi-user service.

- Keep it on `localhost` or `127.0.0.1`.
- Configure `SPEC_LAYER_TOKEN` before using the Figma plugin's **Send to docs** action.
- Do not expose the development server through a public tunnel, shared host, or permissive reverse proxy.
- Store credentials in environment variables where possible. `.ds-config.json` is local, owner-readable configuration and must never be committed.
- Treat imported Markdown and Figma component metadata as potentially sensitive.

If credentials were ever committed or exposed through a public deployment, rotate them immediately.
