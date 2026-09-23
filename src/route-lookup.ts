export interface RouteLookup {
  readonly current: { name: string; params?: Record<string, unknown> }
}
