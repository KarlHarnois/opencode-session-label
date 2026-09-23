/** @jsxImportSource @opentui/solid */
import type { TuiPluginApi } from "@opencode-ai/plugin/tui"
import { ActiveSession } from "./active-session"
import type { ColorStore } from "./color-store"
import type { Palette } from "./palette"

const COMMAND_NAME = "session_label.color"
const COMMAND_TITLE = "Session label color"
const COMMAND_CATEGORY = "Session"
const COMMAND_NAMESPACE = "palette"
const SLASH_NAME = "color"

export class ColorCommand {
  private readonly activeSession: ActiveSession

  constructor(
    private readonly api: TuiPluginApi,
    private readonly palette: Palette,
    private readonly store: ColorStore,
  ) {
    this.activeSession = new ActiveSession(api.route)
  }

  register(): void {
    this.api.keymap.registerLayer({
      commands: [
        {
          name: COMMAND_NAME,
          title: COMMAND_TITLE,
          category: COMMAND_CATEGORY,
          namespace: COMMAND_NAMESPACE,
          slashName: SLASH_NAME,
          run: () => this.prompt(),
        },
      ],
    })
  }

  private prompt(): void {
    const sessionID = this.activeSession.id
    if (!sessionID) return
    const DialogSelect = this.api.ui.DialogSelect
    this.api.ui.dialog.replace(() => (
      <DialogSelect
        title={COMMAND_TITLE}
        options={this.palette.entries.map((color) => ({ title: color, value: color }))}
        current={this.store.colorFor(sessionID, this.palette.colorFor(sessionID))}
        onSelect={(option) => this.select(sessionID, option.value as string)}
      />
    ))
  }

  private select(sessionID: string, color: string): void {
    this.store.override(sessionID, color)
    this.api.ui.dialog.clear()
  }
}
