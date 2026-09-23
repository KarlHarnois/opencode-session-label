const ELLIPSIS = "…"

export class Truncated {
  constructor(private readonly limit: number) {}

  fit(value: string): string {
    if (value.length <= this.limit) return value
    return `${value.slice(0, this.limit - 1)}${ELLIPSIS}`
  }
}
