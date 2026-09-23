import { ContrastText } from "./contrast-text"

export class Badge {
  constructor(
    readonly label: string,
    readonly background: string,
  ) {}

  get text(): string {
    return ` ${this.label} `
  }

  get foreground(): string {
    return ContrastText.for(this.background)
  }
}
