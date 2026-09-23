import { createSignal } from "solid-js"
import type { Getter, Setter, SignalFactory } from "./signals"

export class SolidSignals implements SignalFactory {
  create<Value>(initial: Value): readonly [Getter<Value>, Setter<Value>] {
    const [get, set] = createSignal(initial)
    return [get, (value: Value) => set(() => value)]
  }
}
