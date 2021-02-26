import { ValueContract } from "./value.contract";

export interface MetaValueContract {
  readonly asc: boolean;

  readonly type: string;

  readonly value: ValueContract;
}
