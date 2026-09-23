const LIGHT_TEXT_THRESHOLD = 0.6
const DARK_TEXT = "#1c1c1c"
const LIGHT_TEXT = "#f5f5f5"
const RED_WEIGHT = 0.299
const GREEN_WEIGHT = 0.587
const BLUE_WEIGHT = 0.114
const CHANNEL_MAX = 255
const HEX_RADIX = 16

export class ContrastText {
  constructor(private readonly background: string) {}

  get value(): string {
    return ContrastText.luminance(this.background) > LIGHT_TEXT_THRESHOLD ? DARK_TEXT : LIGHT_TEXT
  }

  private static luminance(hex: string): number {
    const channels = hex.replace("#", "")
    const red = Number.parseInt(channels.slice(0, 2), HEX_RADIX)
    const green = Number.parseInt(channels.slice(2, 4), HEX_RADIX)
    const blue = Number.parseInt(channels.slice(4, 6), HEX_RADIX)
    return (RED_WEIGHT * red + GREEN_WEIGHT * green + BLUE_WEIGHT * blue) / CHANNEL_MAX
  }
}
