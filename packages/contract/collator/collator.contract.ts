import { Meta, Value } from "./value.contract";

export interface CollatorContract {
  decode(binary: Uint8Array): Value;

  encode(value: Value): Uint8Array;

  order: {
    asc(value: Value): Meta<Value>;

    desc(value: Value): Meta<Value>;
  };
}
