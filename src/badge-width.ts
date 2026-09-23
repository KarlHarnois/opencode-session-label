const WIDE_TERMINAL_COLUMNS = 120
const SIDEBAR_COLUMNS = 42
const BADGE_RESERVED_COLUMNS = 8
const MINIMUM_TITLE_COLUMNS = 10

export class BadgeWidth {
  constructor(
    private readonly terminalColumns: number,
    private readonly sidebarMode: string,
  ) {}

  get availableColumns(): number {
    const columns = this.terminalColumns - this.sidebarColumns - BADGE_RESERVED_COLUMNS
    return Math.max(MINIMUM_TITLE_COLUMNS, columns)
  }

  private get sidebarColumns(): number {
    return this.sidebarVisible ? SIDEBAR_COLUMNS : 0
  }

  private get sidebarVisible(): boolean {
    return this.sidebarMode !== "hide" && this.terminalColumns > WIDE_TERMINAL_COLUMNS
  }
}
