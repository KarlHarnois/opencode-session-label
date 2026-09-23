# AGENTS.md

## What this is

An opencode TUI plugin. It renders a colored title badge above the prompt for
the active session so parallel sessions are visually distinguishable. The badge
color is deterministic per session ID, with a per-session override stored in
opencode's key-value store.

## Layout

- `session-label.tsx` - the entire plugin. No source directory, no build step.
- `package.json` - maps the `./tui` export to `session-label.tsx`.
- `README.md` - install instructions for Arch and NixOS.

## How it works

- `exports["./tui"]` in `package.json` points at the TSX entry.
- `session-label.tsx` default-exports a `TuiPluginModule` with `id` and `tui`.
- Colors come from `PALETTE`, selected by `hash(sessionID) % PALETTE.length`.
- Overrides persist under the KV key `session-label.colors` (`KV_KEY`), a
  `Record<sessionID, hex>`.
- The `/color` command is registered through `api.keymap.registerLayer`.
- The badge is injected via the `session_prompt` TUI slot.
- Runtime imports (`@opentui/solid`, `solid-js`, `@opencode-ai/plugin/tui`) are
  provided by opencode at load time. Never add them as dependencies.

## Conventions

- TypeScript, ESM (`"type": "module"`). Keep the single-file structure unless
  the plugin grows enough to justify a module split.
- The file uses the `@opentui/solid` JSX source via
  `/** @jsxImportSource @opentui/solid */`. Keep that directive first.
- TUI plugin config is registered in `tui.json`, not `opencode.json`.
- Comments must earn their place. Prefer clear names over explanatory comments.

## Development

There is no build, lint, typecheck, or test tooling in this repo. To try a
change:

1. Install the plugin per `README.md` (point `tui.json` at this directory).
2. Restart opencode. Config and plugins load once at startup.

For iteration without pushing on NixOS, override the flake input as described
in the README.

## Git

Commit messages start with a capital letter, a short title under 72 chars, and
a longer body in plain imperative language.
