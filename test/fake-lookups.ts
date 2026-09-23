import type { RouteLookup } from "../src/route-lookup"
import type { SessionLookup } from "../src/session-lookup"

export class FakeSessionLookup implements SessionLookup {
  constructor(private readonly titles: Record<string, string> = {}) {}

  get(sessionID: string): { title?: string } | undefined {
    return sessionID in this.titles ? { title: this.titles[sessionID] } : undefined
  }
}

export class FakeRouteLookup implements RouteLookup {
  constructor(public current: RouteLookup["current"]) {}
}
