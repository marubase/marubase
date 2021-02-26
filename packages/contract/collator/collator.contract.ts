import { MetaValueContract } from "./meta-value.contract";
import { ValueContract } from "./value.contract";

export interface CollatorContract {
  decode(buffer: Uint8Array): ValueContract;

  encode(value: MetaValueContract | ValueContract): Uint8Array;

  order: {
    asc(value: ValueContract): MetaValueContract;

    desc(value: ValueContract): MetaValueContract;
  };
}
