import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { ActiveSession } from "../src/active-session"
import { FakeRouteLookup } from "./fake-lookups"

describe("ActiveSession", () => {
  it("returns the session ID on the session route", () => {
    const route = new FakeRouteLookup({ name: "session", params: { sessionID: "s1" } })
    assert.equal(new ActiveSession(route).id, "s1")
  })

  it("returns undefined off the session route", () => {
    const route = new FakeRouteLookup({ name: "home" })
    assert.equal(new ActiveSession(route).id, undefined)
  })

  it("returns undefined when the route has no session ID", () => {
    const route = new FakeRouteLookup({ name: "session", params: {} })
    assert.equal(new ActiveSession(route).id, undefined)
  })

  it("returns undefined for a non-string session ID", () => {
    const route = new FakeRouteLookup({ name: "session", params: { sessionID: 42 } })
    assert.equal(new ActiveSession(route).id, undefined)
  })
})
