export interface SessionLookup {
  get(sessionID: string): { title?: string } | undefined
}
