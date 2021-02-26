import { MetaValueContract, ValueContract } from "@marubase/contract";

export interface CoderInterface {
  decodable(binary: Uint8Array): boolean;

  decode(binary: Uint8Array): ValueContract;

  encodable(value: MetaValueContract): boolean;

  encode(binary: Uint8Array, value: MetaValueContract): Uint8Array;
}
