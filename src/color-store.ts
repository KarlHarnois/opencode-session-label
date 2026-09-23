import type { KeyValueStore } from "./key-value-store"

type ColorMap = Record<string, string>

export class ColorStore {
  constructor(
    private readonly keyValueStore: KeyValueStore,
    private readonly key: string,
  ) {}

  colorFor(sessionID: string, fallback: string): string {
    return this.overrides()[sessionID] ?? fallback
  }

  override(sessionID: string, color: string): void {
    this.keyValueStore.set(this.key, { ...this.overrides(), [sessionID]: color })
  }

  private overrides(): ColorMap {
    return ColorStore.parse(this.keyValueStore.get(this.key, {}))
  }

  private static parse(stored: unknown): ColorMap {
    if (typeof stored !== "object" || stored === null) return {}
    return Object.fromEntries(
      Object.entries(stored).filter(([, color]) => typeof color === "string"),
    ) as ColorMap
  }
}
