import { MetaValueContract, ValueContract } from "@marubase/contract";

export interface CoderInterface {
  decode(binary: Uint8Array): ValueContract;

  encode(binary: Uint8Array, meta: MetaValueContract): Uint8Array;
}
