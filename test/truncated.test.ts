import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { Truncated } from "../src/truncated"

describe("Truncated", () => {
  it("leaves a value under the limit unchanged", () => {
    assert.equal(new Truncated(10).fit("short"), "short")
  })

  it("leaves a value at the limit unchanged", () => {
    assert.equal(new Truncated(5).fit("exact"), "exact")
  })

  it("cuts an over-limit value to the budget with an ellipsis", () => {
    const result = new Truncated(5).fit("overflowing")
    assert.equal(result, "over…")
    assert.equal(result.length, 5)
  })
})
