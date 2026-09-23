import type { TuiPluginApi } from "@opencode-ai/plugin/tui"

export class ActiveSession {
  constructor(private readonly route: TuiPluginApi["route"]) {}

  get id(): string | undefined {
    const current = this.route.current
    if (current.name !== "session") return undefined
    const sessionID = current.params?.sessionID
    return typeof sessionID === "string" ? sessionID : undefined
  }
}
