import type { SessionLookup } from "./session-lookup"

const GENERATED_TITLE_PATTERN = /^(New session|Child session) - \d{4}-\d{2}-\d{2}T/
const PLACEHOLDER_TITLE = "new session"

export class SessionTitle {
  constructor(private readonly sessions: SessionLookup) {}

  display(sessionID: string): string {
    const title = this.sessions.get(sessionID)?.title
    return title && !GENERATED_TITLE_PATTERN.test(title) ? title : PLACEHOLDER_TITLE
  }
}
