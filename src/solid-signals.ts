import { createSignal } from "solid-js/dist/solid.js"
import type { Getter, Setter, SignalFactory } from "./signals"

// The bare "solid-js" specifier resolves to the inert server build under Node,
// whose signals never notify effects. Match the reactive build the renderer uses.
export class SolidSignals implements SignalFactory {
  create<Value>(initial: Value): readonly [Getter<Value>, Setter<Value>] {
    const [get, set] = createSignal(initial)
    return [get, (value: Value) => set(() => value)]
  }
}
