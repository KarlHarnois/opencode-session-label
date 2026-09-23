import type { RouteLookup } from "./route-lookup"

export class ActiveSession {
  constructor(private readonly route: RouteLookup) {}

  get id(): string | undefined {
    const current = this.route.current
    if (current.name !== "session") return undefined
    const sessionID = current.params?.sessionID
    return typeof sessionID === "string" ? sessionID : undefined
  }
}
