import { PaletteColor } from "./palette-color"

const HASH_MULTIPLIER = 31

const DEFAULT_COLORS = [
  new PaletteColor("red", "#e06c75"),
  new PaletteColor("green", "#98c379"),
  new PaletteColor("yellow", "#e5c07b"),
  new PaletteColor("blue", "#61afef"),
  new PaletteColor("purple", "#c678dd"),
  new PaletteColor("cyan", "#56b6c2"),
  new PaletteColor("orange", "#d19a66"),
  new PaletteColor("teal", "#7fbbb3"),
  new PaletteColor("pink", "#d699b6"),
  new PaletteColor("lime", "#a3be8c"),
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
