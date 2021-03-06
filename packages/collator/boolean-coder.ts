import { Meta, Value } from "@marubase/contract/collator";
import { BaseCoder } from "./base-coder";
import { CoderInterface } from "./coder.interface";
import { ComplexCoder } from "./complex-coder";

export class BooleanCoder extends BaseCoder implements CoderInterface {
  public static service(complex: ComplexCoder): void {
    const instance = new BooleanCoder(complex.table);
    complex.registerType("boolean", instance);

    const { AFALSE, ATRUE, DFALSE, DTRUE } = complex.table;
    const prefixes = [AFALSE, ATRUE, DFALSE, DTRUE];
    prefixes.forEach((prefix) => complex.registerPrefix(prefix[0], instance));
  }

  public decode(binary: Uint8Array): Value {
    const { ATRUE, DTRUE } = this.table;
    return ATRUE[0] === binary[0] || DTRUE[0] === binary[0];
  }

  public encode(binary: Uint8Array, meta: Meta<Value>): Uint8Array {
    if (meta.asc) {
      const { AFALSE, ATRUE } = this.table;
      return meta.value
        ? this.append(binary, ATRUE)
        : this.append(binary, AFALSE);
    } else {
      const { DFALSE, DTRUE } = this.table;
      return meta.value
        ? this.append(binary, DTRUE)
        : this.append(binary, DFALSE);
    }
  }
}
