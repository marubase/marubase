import { Key } from "./key.contract";
import { TransactionContract } from "./transaction.contract";
import { Value } from "./value.contract";

export interface TransactionFn<T> {
  (transaction: TransactionContract): Promise<T>;
}

export interface BucketContract {
  clear(key: Key): Promise<void>;

  clearRange(start: Key, end: Key): Promise<void>;

  get(key: Key): Promise<Value>;

  set(key: Key, value: Value): Promise<void>;

  transaction<T>(transactionFn: TransactionFn<T>): Promise<T>;
}
