import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { SessionTitle } from "../src/session-title"
import { FakeSessionLookup } from "./fake-lookups"

describe("SessionTitle", () => {
  it("returns a real title", () => {
    const title = new SessionTitle(new FakeSessionLookup({ s1: "Fix the badge" }))
    assert.equal(title.display("s1"), "Fix the badge")
  })

  it("falls back when the session is unknown", () => {
    const title = new SessionTitle(new FakeSessionLookup())
    assert.equal(title.display("missing"), "new session")
  })

  it("falls back for a generated title", () => {
    const generated = "New session - 2026-09-22T21:50:51.000Z"
    const title = new SessionTitle(new FakeSessionLookup({ s1: generated }))
    assert.equal(title.display("s1"), "new session")
  })

  it("falls back for an empty title", () => {
    const title = new SessionTitle(new FakeSessionLookup({ s1: "" }))
    assert.equal(title.display("s1"), "new session")
  })

  it("falls back for a generated child title", () => {
    const generated = "Child session - 2026-09-22T21:50:51.000Z"
    const title = new SessionTitle(new FakeSessionLookup({ s1: generated }))
    assert.equal(title.display("s1"), "new session")
  })
})
