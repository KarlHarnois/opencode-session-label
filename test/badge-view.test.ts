import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { BadgeView } from "../src/badge-view"
import { ColorStore } from "../src/color-store"
import { Palette } from "../src/palette"
import { FakeKeyValueStore } from "./fake-key-value-store"
import { FakeSessionLookup } from "./fake-lookups"

const COLORS_KEY = "session-label.colors"
const SIDEBAR_KEY = "sidebar"
const LONG_TITLE = "a very long session title indeed ".repeat(5).trim()

function createView(options: {
  titles?: Record<string, string>
  stored?: Record<string, unknown>
  sidebarMode?: unknown
}) {
  const keyValueStore = new FakeKeyValueStore({
    [COLORS_KEY]: options.stored ?? {},
    ...(options.sidebarMode === undefined ? {} : { [SIDEBAR_KEY]: options.sidebarMode }),
  })
  const store = new ColorStore(keyValueStore, COLORS_KEY)
  return new BadgeView(keyValueStore, store, new FakeSessionLookup(options.titles))
}

describe("BadgeView", () => {
  it("shows the session title", () => {
    const view = createView({ titles: { s1: "Fix the badge" } })
    assert.equal(view.badge("s1", 100).label, "Fix the badge")
  })

  it("shows a placeholder for a generated title", () => {
    const view = createView({ titles: { s1: "New session - 2026-09-22T21:50:51.000Z" } })
    assert.equal(view.badge("s1", 100).label, "new session")
  })

  it("truncates the title to the available columns", () => {
    const view = createView({ titles: { s1: "a very long session title indeed" } })
    assert.equal(view.badge("s1", 20).label, "a very long…")
  })

  it("reserves sidebar columns above the wide threshold", () => {
    const view = createView({ titles: { s1: LONG_TITLE } })
    assert.equal(view.badge("s1", 200).label.length, 150)
  })

  it("reclaims sidebar columns in hide mode", () => {
    const view = createView({ titles: { s1: LONG_TITLE }, sidebarMode: "hide" })
    assert.equal(view.badge("s1", 200).label, LONG_TITLE)
  })

  it("falls back to the default sidebar mode for a non-string value", () => {
    const view = createView({ titles: { s1: LONG_TITLE }, sidebarMode: 42 })
    assert.equal(view.badge("s1", 200).label.length, 150)
  })

  it("uses the palette color for a session", () => {
    const view = createView({ titles: { s1: "Title" } })
    assert.equal(view.badge("s1", 100).background, new Palette().colorFor("s1"))
  })

  it("prefers a stored override color", () => {
    const view = createView({ titles: { s1: "Title" }, stored: { s1: "#123456" } })
    assert.equal(view.badge("s1", 100).background, "#123456")
  })
})
