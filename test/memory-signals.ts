import type { Getter, Setter, SignalFactory } from "../src/signals"

export class MemorySignals implements SignalFactory {
  create<Value>(initial: Value): readonly [Getter<Value>, Setter<Value>] {
    let current = initial
    return [() => current, (value: Value) => (current = value)]
  }
}
