import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { ColorStore } from "../src/color-store"
import { FakeKeyValueStore } from "./fake-key-value-store"
import { MemorySignals } from "./memory-signals"

const KEY = "session-label.colors"

function createStore(initial: Record<string, unknown> = {}) {
  const keyValueStore = new FakeKeyValueStore(initial)
  const store = new ColorStore(keyValueStore, KEY, new MemorySignals())
  return { keyValueStore, store }
}

describe("ColorStore", () => {
  it("falls back when there is no override", () => {
    const { store } = createStore()
    assert.equal(store.colorFor("s1", "#abcdef"), "#abcdef")
  })

  it("returns a stored override", () => {
    const { store } = createStore({ [KEY]: { s1: "#123456" } })
    assert.equal(store.colorFor("s1", "#abcdef"), "#123456")
  })

  it("persists an override to the key-value store", () => {
    const { keyValueStore, store } = createStore()
    store.override("s1", "#654321")
    assert.deepEqual(keyValueStore.writes, [{ key: KEY, value: { s1: "#654321" } }])
  })

  it("applies an override to later reads", () => {
    const { store } = createStore()
    store.override("s1", "#654321")
    assert.equal(store.colorFor("s1", "#abcdef"), "#654321")
  })

  it("keeps other overrides when adding a new one", () => {
    const { store } = createStore()
    store.override("s1", "#111111")
    store.override("s2", "#222222")
    assert.equal(store.colorFor("s1", "#abcdef"), "#111111")
    assert.equal(store.colorFor("s2", "#abcdef"), "#222222")
  })

  it("replaces an existing override without adding a key", () => {
    const { keyValueStore, store } = createStore({ [KEY]: { s1: "#111111" } })
    store.override("s1", "#222222")
    assert.equal(store.colorFor("s1", "#abcdef"), "#222222")
    assert.deepEqual(keyValueStore.writes, [{ key: KEY, value: { s1: "#222222" } }])
  })

  it("discards non-string stored values", () => {
    const { store } = createStore({ [KEY]: { s1: 42, s2: "#123456" } })
    assert.equal(store.colorFor("s1", "#abcdef"), "#abcdef")
    assert.equal(store.colorFor("s2", "#123456"), "#123456")
  })

  it("treats a non-object stored value as empty", () => {
    const { store } = createStore({ [KEY]: "not-an-object" })
    assert.equal(store.colorFor("s1", "#abcdef"), "#abcdef")
  })
})
