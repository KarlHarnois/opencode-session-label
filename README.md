# opencode-session-label

An opencode TUI plugin that shows a colored title badge for the active session inside the prompt, so parallel sessions are distinguishable at a glance. The color is deterministic per session ID, and `/color` overrides it per session.

## Install

### Home Manager

Add the repo as a non-flake input and expose it to the home modules:

```nix
inputs.opencode-session-label = {
  url = "github:KarlHarnois/opencode-session-label";
  flake = false;
};

home-manager.extraSpecialArgs = { inherit opencode-session-label; };
```

Then list it under `programs.opencode.tui`:

```nix
{ opencode-session-label, ... }:

{
  programs.opencode.tui.plugin = [ opencode-session-label ];
}
```

### Anywhere else

```sh
opencode plugin /path/to/opencode-session-label --global
```

Adds the plugin to `~/.config/opencode/tui.json`. Drop `--global` for a project-local `.opencode/tui.json`.
