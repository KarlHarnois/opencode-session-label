import { Badge } from "./badge"
import { BadgeWidth } from "./badge-width"
import type { ColorStore } from "./color-store"
import type { KeyValueStore } from "./key-value-store"
import { Palette } from "./palette"
import type { SessionLookup } from "./session-lookup"
import { SessionTitle } from "./session-title"
import { Truncated } from "./truncated"

const SIDEBAR_STORAGE_KEY = "sidebar"
const DEFAULT_SIDEBAR_MODE = "auto"

export class BadgeView {
  private readonly palette = new Palette()
  private readonly title: SessionTitle

  constructor(
    private readonly keyValueStore: KeyValueStore,
    private readonly store: ColorStore,
    sessions: SessionLookup,
  ) {
    this.title = new SessionTitle(sessions)
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
    const mode = this.keyValueStore.get(SIDEBAR_STORAGE_KEY, DEFAULT_SIDEBAR_MODE)
    return typeof mode === "string" ? mode : DEFAULT_SIDEBAR_MODE
  }
}
