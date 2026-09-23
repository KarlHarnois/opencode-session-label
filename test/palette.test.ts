import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { Palette } from "../src/palette"

describe("Palette", () => {
  it("returns the same color for the same seed", () => {
    const palette = new Palette()
    assert.equal(palette.colorFor("session-a"), palette.colorFor("session-a"))
  })

  it("maps a known seed to a known color", () => {
    assert.equal(new Palette().colorFor("session-a"), "#d19a66")
  })

  it("returns a color from the palette", () => {
    const palette = new Palette()
    assert.ok(palette.entries.includes(palette.colorFor("session-b")))
  })

  it("uses the supplied colors", () => {
    const palette = new Palette(["#111111", "#222222"])
    assert.equal(palette.colorFor("session-c"), "#111111")
  })

  it("maps distinct seeds to distinct colors", () => {
    const palette = new Palette(["#111111", "#222222", "#333333", "#444444"])
    const colors = ["seed-0", "seed-1", "seed-2", "seed-3"].map((seed) => palette.colorFor(seed))
    assert.equal(new Set(colors).size, 4)
  })
})
