import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { ContrastText } from "../src/contrast-text"

describe("ContrastText", () => {
  it("uses dark text on a light background", () => {
    assert.equal(new ContrastText("#ffffff").value, "#1c1c1c")
  })

  it("uses light text on a dark background", () => {
    assert.equal(new ContrastText("#000000").value, "#f5f5f5")
  })

  it("accepts a background without a leading hash", () => {
    assert.equal(new ContrastText("ffffff").value, "#1c1c1c")
  })
})
