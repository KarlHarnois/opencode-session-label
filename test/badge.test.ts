import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { Badge } from "../src/badge"

describe("Badge", () => {
  it("pads the label with single spaces", () => {
    assert.equal(new Badge("hello", "#ffffff").text, " hello ")
  })

  it("uses dark text on a light background", () => {
    assert.equal(new Badge("hello", "#ffffff").foreground, "#1c1c1c")
  })

  it("uses light text on a dark background", () => {
    assert.equal(new Badge("hello", "#000000").foreground, "#f5f5f5")
  })
})
