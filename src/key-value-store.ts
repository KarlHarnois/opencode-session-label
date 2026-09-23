export interface KeyValueStore {
  get(key: string, fallback?: unknown): unknown
  set(key: string, value: unknown): void
}
