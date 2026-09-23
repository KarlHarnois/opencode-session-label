const HASH_MULTIPLIER = 31

const DEFAULT_COLORS = [
  "#e06c75",
  "#98c379",
  "#e5c07b",
  "#61afef",
  "#c678dd",
  "#56b6c2",
  "#d19a66",
  "#7fbbb3",
  "#d699b6",
  "#a3be8c",
]

export class Palette {
  constructor(private readonly colors: readonly string[] = DEFAULT_COLORS) {}

  get entries(): readonly string[] {
    return this.colors
  }

  colorFor(seed: string): string {
    return this.colors[Palette.hash(seed) % this.colors.length]
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
