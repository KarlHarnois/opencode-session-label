import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { BadgeWidth } from "../src/badge-width"

describe("BadgeWidth", () => {
  it("hides the sidebar at the wide threshold", () => {
    assert.equal(new BadgeWidth(120, "auto").availableColumns, 112)
  })

  it("reserves sidebar columns above the wide threshold", () => {
    assert.equal(new BadgeWidth(121, "auto").availableColumns, 71)
  })

  it("ignores the sidebar in hide mode", () => {
    assert.equal(new BadgeWidth(200, "hide").availableColumns, 192)
  })

  it("enforces a minimum on a narrow terminal", () => {
    assert.equal(new BadgeWidth(10, "auto").availableColumns, 10)
  })
})
