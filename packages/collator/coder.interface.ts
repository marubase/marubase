import { Meta, Value } from "@marubase/contract/collator";

export interface CoderInterface {
  decode(binary: Uint8Array): Value;

  encode(binary: Uint8Array, meta: Meta<Value>): Uint8Array;
}
