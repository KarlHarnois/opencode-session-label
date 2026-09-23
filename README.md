# opencode-session-label

An opencode TUI plugin that labels the active session with a colored title badge above the prompt, so parallel sessions are distinguishable at a glance.

Each session gets a deterministic color from a fixed palette, keyed off the session ID. The palette entry can be overridden per session with the
`/color` command, which persists the choice through opencode's key-value store under `session-label.colors`.

## Install

This is a TUI plugin, so it is registered in `tui.json`.
