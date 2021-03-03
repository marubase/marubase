import { MetaValueContract } from "./meta-value.contract";

export type ValueContract =
  | { [key: string]: ValueContract }
  | Date
  | MetaValueContract
  | Uint8Array
  | ValueContract[]
  | boolean
  | null
  | number
  | string
  | undefined;
