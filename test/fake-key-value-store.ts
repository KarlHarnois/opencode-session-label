import type { KeyValueStore } from "../src/key-value-store"

export class FakeKeyValueStore implements KeyValueStore {
  private readonly entries: Map<string, unknown>
  readonly writes: Array<{ key: string; value: unknown }> = []

  constructor(initial: Record<string, unknown> = {}) {
    this.entries = new Map(Object.entries(initial))
  }

  get(key: string, fallback?: unknown): unknown {
    return this.entries.has(key) ? this.entries.get(key) : fallback
  }

  set(key: string, value: unknown): void {
    this.entries.set(key, value)
    this.writes.push({ key, value })
  }
}
