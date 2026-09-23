import type { TuiPluginApi } from "@opencode-ai/plugin/tui"
import { Badge } from "./badge"
import { BadgeWidth } from "./badge-width"
import type { ColorStore } from "./color-store"
import { Palette } from "./palette"
import { SessionTitle } from "./session-title"
import { Truncated } from "./truncated"

const SIDEBAR_KV_KEY = "sidebar"
const DEFAULT_SIDEBAR_MODE = "auto"

export class BadgeView {
  private readonly palette = new Palette()
  private readonly title: SessionTitle

  constructor(
    private readonly api: TuiPluginApi,
    private readonly store: ColorStore,
  ) {
    this.title = new SessionTitle(api.state.session)
  }

  badge(sessionID: string, terminalColumns: number): Badge {
    const width = new BadgeWidth(terminalColumns, this.sidebarMode)
    const label = new Truncated(width.availableColumns).fit(this.title.display(sessionID))
    return new Badge(label, this.colorFor(sessionID))
  }

  private colorFor(sessionID: string): string {
    return this.store.colorFor(sessionID, this.palette.colorFor(sessionID))
  }

  private get sidebarMode(): string {
    return this.api.kv.get(SIDEBAR_KV_KEY, DEFAULT_SIDEBAR_MODE)
  }
}
