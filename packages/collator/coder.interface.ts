import { MetaValueContract, ValueContract } from "@marubase/contract";

export interface CoderInterface {
  decodable(binary: Uint8Array): boolean;

  decode(binary: Uint8Array): ValueContract;

  encodable(meta: MetaValueContract): boolean;

  encode(binary: Uint8Array, meta: MetaValueContract): Uint8Array;
}
