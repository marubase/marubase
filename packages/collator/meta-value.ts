import { Meta, Value } from "@marubase/contract/collator";

export class MetaValue implements Meta<Value> {
  public static create(value: Value, asc: boolean): Meta<Value> {
    return !(value instanceof MetaValue) ? new MetaValue(value, asc) : value;
  }

  public type: string;

  public constructor(public value: Value, public asc: boolean) {
    if (Array.isArray(value)) this.type = "array";
    else if (value instanceof Date) this.type = "date";
    else if (value instanceof Uint8Array) this.type = "buffer";
    else if (value === null) this.type = "null";
    else this.type = typeof value;
  }
}
