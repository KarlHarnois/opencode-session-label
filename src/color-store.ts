import type { TuiPluginApi } from "@opencode-ai/plugin/tui"
import { type Accessor, createSignal } from "solid-js"

export type ColorMap = Record<string, string>

export class ColorStore {
  private readonly choices: Accessor<ColorMap>
  private readonly replace: (value: ColorMap) => void

  constructor(
    private readonly kv: TuiPluginApi["kv"],
    private readonly key: string,
  ) {
    const [choices, replace] = createSignal(ColorStore.read(kv.get(key, {})))
    this.choices = choices
    this.replace = replace
  }

  colorFor(sessionID: string, fallback: string): string {
    return this.choices()[sessionID] ?? fallback
  }

  override(sessionID: string, color: string): void {
    this.replace({ ...this.choices(), [sessionID]: color })
    this.kv.set(this.key, this.choices())
  }

  private static read(raw: unknown): ColorMap {
    if (typeof raw !== "object" || raw === null) return {}
    return Object.fromEntries(
      Object.entries(raw).filter(([, color]) => typeof color === "string"),
    ) as ColorMap
  }
}
