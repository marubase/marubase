import { Key } from "./key.contract";
import { Value } from "./value.contract";

export interface RangeOptions {
  limit?: number;
  reverse?: boolean;
}

export interface TransactionContract {
  clear(key: Key): Promise<void>;

  clearRange(start: Key, end: Key): Promise<void>;

  get(key: Key): Promise<Value>;

  getRange(
    start: Key,
    end: Key,
    options?: RangeOptions
  ): AsyncIterator<[Key, Value]>;

  set(key: Key, value: Value): Promise<void>;
}
