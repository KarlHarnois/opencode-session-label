const DARK_TEXT = "#1c1c1c"
const LIGHT_TEXT = "#f5f5f5"
const RED_WEIGHT = 0.2126
const GREEN_WEIGHT = 0.7152
const BLUE_WEIGHT = 0.0722
const CHANNEL_MAX = 255
const HEX_RADIX = 16
const LINEAR_THRESHOLD = 0.03928
const LINEAR_DIVISOR = 12.92
const GAMMA_OFFSET = 0.055
const GAMMA_DIVISOR = 1.055
const GAMMA_EXPONENT = 2.4
const CONTRAST_OFFSET = 0.05

export class ContrastText {
  private readonly luminance: number

  constructor(background: string) {
    this.luminance = ContrastText.luminanceOf(background)
  }

  get value(): string {
    return this.contrastWith(DARK_TEXT) >= this.contrastWith(LIGHT_TEXT) ? DARK_TEXT : LIGHT_TEXT
  }

  private contrastWith(text: string): number {
    const other = ContrastText.luminanceOf(text)
    const lighter = Math.max(this.luminance, other)
    const darker = Math.min(this.luminance, other)
    return (lighter + CONTRAST_OFFSET) / (darker + CONTRAST_OFFSET)
  }

  private static luminanceOf(hex: string): number {
    const channels = hex.replace("#", "")
    const [red, green, blue] = [
      channels.slice(0, 2),
      channels.slice(2, 4),
      channels.slice(4, 6),
    ].map((channel) => ContrastText.linear(Number.parseInt(channel, HEX_RADIX) / CHANNEL_MAX))
    return RED_WEIGHT * red + GREEN_WEIGHT * green + BLUE_WEIGHT * blue
  }

  private static linear(channel: number): number {
    return channel <= LINEAR_THRESHOLD
      ? channel / LINEAR_DIVISOR
      : ((channel + GAMMA_OFFSET) / GAMMA_DIVISOR) ** GAMMA_EXPONENT
  }
}
