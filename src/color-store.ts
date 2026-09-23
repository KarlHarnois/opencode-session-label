import type { KeyValueStore } from "./key-value-store"
import type { Getter, Setter, SignalFactory } from "./signals"

type ColorMap = Record<string, string>

export class ColorStore {
  private readonly choices: Getter<ColorMap>
  private readonly replace: Setter<ColorMap>

  constructor(
    private readonly keyValueStore: KeyValueStore,
    private readonly key: string,
    signals: SignalFactory,
  ) {
    const [choices, replace] = signals.create(ColorStore.parse(keyValueStore.get(key, {})))
    this.choices = choices
    this.replace = replace
  }

  colorFor(sessionID: string, fallback: string): string {
    return this.choices()[sessionID] ?? fallback
  }

  override(sessionID: string, color: string): void {
    this.replace({ ...this.choices(), [sessionID]: color })
    this.keyValueStore.set(this.key, this.choices())
  }

  private static parse(stored: unknown): ColorMap {
    if (typeof stored !== "object" || stored === null) return {}
    return Object.fromEntries(
      Object.entries(stored).filter(([, color]) => typeof color === "string"),
    ) as ColorMap
  }
}
