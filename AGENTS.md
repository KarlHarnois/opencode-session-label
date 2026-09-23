# AGENTS.md

## What this is

An opencode TUI plugin. It renders a colored title badge inside the prompt for
the active session so parallel sessions are visually distinguishable. The badge
color is deterministic per session ID, with a per-session override stored in
opencode's key-value store.

## Layout

- `src/index.tsx` - plugin entry. Wires the collaborators and registers the
  command and slot.
- `src/badge-view.ts` - builds a `Badge` for a session and terminal width.
- `src/badge.ts` - the badge value: label, background, foreground, padded text.
- `src/color-command.tsx` - the `/color` command and its select dialog.
- `src/color-store.ts` - per-session color overrides read from the key-value
  store.
- `src/palette.ts` - deterministic palette color for a session ID.
- `src/contrast-text.ts` - readable text color for a background.
- `src/session-title.ts` - the display title for a session.
- `src/badge-width.ts` - available badge columns from terminal and sidebar.
- `src/truncated.ts` - ellipsis truncation to a column budget.
- `src/active-session.ts` - the session ID of the current route.
- `src/key-value-store.ts` - the `KeyValueStore` port for persisted values.
- `src/session-lookup.ts` - the `SessionLookup` port for session state.
- `src/route-lookup.ts` - the `RouteLookup` port for the current route.
- `src/session-prompt-slot.tsx` - renders the badge in the prompt's right area.
- `test/` - unit tests and hand-written doubles, no mocking library.
- `package.json` - maps the `./tui` export to `src/index.tsx`.
- `biome.json` - formatter and linter config.
- `README.md` - install instructions for Arch and NixOS.

## How it works

- `exports["./tui"]` in `package.json` points at the TSX entry.
- `src/index.tsx` default-exports a `TuiPluginModule` with `id` and `tui`.
- Colors come from `Palette`, selected by `hash(sessionID) % palette.length`.
- Overrides persist under the storage key `session-label.colors`, a
  `Record<sessionID, hex>`.
- The `/color` command is registered through `api.keymap.registerLayer`.
- The badge is injected via the `session_prompt` TUI slot.
- `api.kv.get` is reactive per key, so an effect that reads the overrides
  re-runs when they change. The plugin reads colors straight from the
  key-value store and keeps no reactive state of its own.
- Host capabilities reach the logic through narrow ports (`KeyValueStore`,
  `SessionLookup`, `RouteLookup`). `src/index.tsx` passes the real
  implementations; tests pass doubles. Never import `solid-js`,
  `@opentui/solid`, or `@opencode-ai/plugin/tui` outside their adapters.
- Runtime imports (`@opentui/core`, `@opentui/solid`, `solid-js`,
  `@opencode-ai/plugin/tui`) are not injected into the plugin's module graph by
  opencode 1.18.32. They must resolve from the plugin's own `node_modules`, so
  `@opentui/core`, `@opentui/solid`, and `solid-js` are pinned in
  `dependencies`. `@opencode-ai/plugin/tui` is imported for types only and
  needs no runtime copy.
- opencode rewrites the bare `solid-js` specifier to a shared renderer runtime
  module, but a deep path such as `solid-js/dist/solid.js` escapes that rewrite
  and builds a second reactive graph whose signals never notify the renderer's
  effects. Avoid importing solid-js in the plugin at all.
- When a module fails to import, opencode swallows the error: the plugin simply
  never registers and no toast or log line appears. The cause is visible only
  with `opencode --print-logs`, which writes loader errors to stderr.

## Conventions

- TypeScript, ESM (`"type": "module"`). Behaviour lives in small classes under
  `src/`, one responsibility per file. `src/index.tsx` only wires and registers
  them.
- Files that render JSX use the `@opentui/solid` JSX source via a
  `/** @jsxImportSource @opentui/solid */` directive on the first line.
- TUI plugin config is registered in `tui.json`, not `opencode.json`.
- Comments must earn their place. Prefer clear names over explanatory comments.
- No abbreviations in names. Spell out `keyValueStore`, `sessionID`,
  `accumulator`, and the like; keep only established domain terms such as
  `KV` in opencode's own API surface.

## Development

Formatting and linting are handled by Biome. Run it with npm:

- `npm run check` - report formatting and lint problems.
- `npm run fix` - apply safe fixes, including import sorting.
- `npm run format` - format only.
- `npm run lint` - lint only.
- `npm test` - run the unit tests with Node's test runner via `tsx`.

Tests cover the logic classes. Host capability is injected through the ports
above, so tests use hand-written doubles and no module mocking. The TUI wiring
(`src/index.tsx`, `src/session-prompt-slot.tsx`) is not unit tested.

There is no build or typecheck tooling. To try a change:

1. Install the plugin per `README.md` (point `tui.json` at this directory).
2. Restart opencode. Config and plugins load once at startup.

For iteration without pushing on NixOS, override the flake input as described
in the README.

## Git

Commit messages start with a capital letter, a short title under 72 chars, and
a longer body in plain imperative language.
