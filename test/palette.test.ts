import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { Palette } from "../src/palette"
import { PaletteColor } from "../src/palette-color"

describe("Palette", () => {
  it("returns the same color for the same seed", () => {
    const palette = new Palette()
    assert.equal(palette.colorFor("session-a"), palette.colorFor("session-a"))
  })

  it("maps a known seed to a known color", () => {
    assert.equal(new Palette().colorFor("session-a"), "#fac35f")
  })

  it("returns a color from the palette", () => {
    const palette = new Palette()
    assert.ok(palette.entries.some((color) => color.hex === palette.colorFor("session-b")))
  })

  it("uses the supplied colors", () => {
    const palette = new Palette([new PaletteColor("black", "#111111")])
    assert.equal(palette.colorFor("session-c"), "#111111")
  })

  it("maps distinct seeds to distinct colors", () => {
    const palette = new Palette([
      new PaletteColor("one", "#111111"),
      new PaletteColor("two", "#222222"),
      new PaletteColor("three", "#333333"),
      new PaletteColor("four", "#444444"),
    ])
    const colors = ["seed-0", "seed-1", "seed-2", "seed-3"].map((seed) => palette.colorFor(seed))
    assert.equal(new Set(colors).size, 4)
  })

  it("names a known color", () => {
    assert.equal(new Palette().nameFor("#f58b57"), "orange")
  })

  it("falls back to the hex for an unknown color", () => {
    assert.equal(new Palette().nameFor("#abcdef"), "#abcdef")
  })
})
