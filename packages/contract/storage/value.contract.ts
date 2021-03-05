export interface Dictionary<T> {
  [key: string]: T;
}

export interface Tuple<T> extends Array<T> {
  [index: number]: T;
}

export type Value =
  | Date
  | Dictionary<Value>
  | Tuple<Value>
  | Uint8Array
  | boolean
  | null
  | number
  | string
  | undefined;
