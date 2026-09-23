# AGENTS.md

## What this is

An opencode TUI plugin. It renders a colored title badge above the prompt for
the active session so parallel sessions are visually distinguishable. The badge
color is deterministic per session ID, with a per-session override stored in
opencode's key-value store.

## Layout

- `src/index.tsx` - plugin entry. Wires the collaborators and registers the
  command and slot.
- `src/badge-view.ts` - builds a `Badge` for a session and terminal width.
- `src/badge.ts` - the badge value: label, background, foreground, padded text.
- `src/color-command.tsx` - the `/color` command and its select dialog.
- `src/color-store.ts` - reactive per-session color overrides backed by the KV
  store.
- `src/palette.ts` - deterministic palette color for a session ID.
- `src/contrast-text.ts` - readable text color for a background.
- `src/session-title.ts` - the display title for a session.
- `src/badge-width.ts` - available badge columns from terminal and sidebar.
- `src/truncated.ts` - ellipsis truncation to a column budget.
- `src/active-session.ts` - the session ID of the current route.
- `src/session-prompt-slot.tsx` - renders the badge above the prompt.
- `package.json` - maps the `./tui` export to `src/index.tsx`.
- `README.md` - install instructions for Arch and NixOS.

## How it works

- `exports["./tui"]` in `package.json` points at the TSX entry.
- `src/index.tsx` default-exports a `TuiPluginModule` with `id` and `tui`.
- Colors come from `Palette`, selected by `hash(sessionID) % palette.length`.
- Overrides persist under the KV key `session-label.colors`, a
  `Record<sessionID, hex>`.
- The `/color` command is registered through `api.keymap.registerLayer`.
- The badge is injected via the `session_prompt` TUI slot.
- Runtime imports (`@opentui/solid`, `solid-js`, `@opencode-ai/plugin/tui`) are
  provided by opencode at load time. Never add them as dependencies.

## Conventions

- TypeScript, ESM (`"type": "module"`). Behaviour lives in small classes under
  `src/`, one responsibility per file. `src/index.tsx` only wires and registers
  them.
- Files that render JSX use the `@opentui/solid` JSX source via a
  `/** @jsxImportSource @opentui/solid */` directive on the first line.
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
