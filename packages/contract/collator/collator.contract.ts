import { MetaValueContract } from "./meta-value.contract";
import { ValueContract } from "./value.contract";

export interface CollatorContract {
  decode(binary: Uint8Array): ValueContract;

  encode(value: ValueContract): Uint8Array;

  order: {
    asc(value: ValueContract): MetaValueContract;

    desc(value: ValueContract): MetaValueContract;
  };
}
