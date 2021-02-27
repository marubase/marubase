import { MetaValueContract, ValueContract } from "@marubase/contract/collator";

export class MetaValue implements MetaValueContract {
  public type: string;

  public constructor(public value: ValueContract, public asc: boolean) {
    if (Array.isArray(value)) this.type = "array";
    else if (value instanceof Date) this.type = "date";
    else if (value instanceof Uint8Array) this.type = "buffer";
    else if (value === null) this.type = "null";
    else this.type = typeof value;
  }
}
