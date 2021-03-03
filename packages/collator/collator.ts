import {
  CollatorContract,
  MetaValueContract,
  ValueContract,
} from "@marubase/contract/collator";
import { CoderInterface } from "./coder.interface";
import { MetaValue } from "./meta-value";

export class Collator implements CollatorContract {
  public buffer = true;

  public type = "collator";

  public constructor(protected coder: CoderInterface) {}

  public decode(binary: Uint8Array): ValueContract {
    return this.coder.decode(binary);
  }

  public encode(value: ValueContract): Uint8Array {
    const buffer = new ArrayBuffer(32);
    const binary = new Uint8Array(buffer, 0, 0);
    const meta = MetaValue.create(value, true);
    return this.coder.encode(binary, meta);
  }

  public order = {
    asc(value: ValueContract): MetaValueContract {
      return MetaValue.create(value, true);
    },

    desc(value: ValueContract): MetaValueContract {
      return MetaValue.create(value, false);
    },
  };
}
