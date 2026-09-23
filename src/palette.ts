import { PaletteColor } from "./palette-color"

const HASH_MULTIPLIER = 31

const DEFAULT_COLORS = [
  new PaletteColor("red", "#eb5f57"),
  new PaletteColor("orange", "#f58b57"),
  new PaletteColor("yellow", "#fac35f"),
  new PaletteColor("green", "#91c882"),
  new PaletteColor("blue", "#82aadc"),
  new PaletteColor("indigo", "#9b82c8"),
  new PaletteColor("violet", "#c882b4"),
]

export class Palette {
  constructor(private readonly colors: readonly PaletteColor[] = DEFAULT_COLORS) {}

  get entries(): readonly PaletteColor[] {
    return this.colors
  }

  colorFor(seed: string): string {
    return this.colors[Palette.hash(seed) % this.colors.length].hex
  }

  nameFor(hex: string): string {
    return this.colors.find((color) => color.hex === hex)?.name ?? hex
  }

  private static hash(value: string): number {
    let accumulator = 0
    for (const character of value) {
      const codePoint = character.codePointAt(0) ?? 0
      accumulator = (accumulator * HASH_MULTIPLIER + codePoint) >>> 0
    }
    return accumulator
  }
}
