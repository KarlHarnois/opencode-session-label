export type Getter<Value> = () => Value

export type Setter<Value> = (value: Value) => void

export interface SignalFactory {
  create<Value>(initial: Value): readonly [Getter<Value>, Setter<Value>]
}
