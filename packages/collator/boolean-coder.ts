import { MetaValueContract, ValueContract } from "@marubase/contract/collator";
import { BaseCoder } from "./base-coder";
import { CoderInterface } from "./coder.interface";

export class BooleanCoder extends BaseCoder implements CoderInterface {
  public decodable(binary: Uint8Array): boolean {
    const { AFALSE, ATRUE, DFALSE, DTRUE } = this.table;
    return (
      AFALSE[0] === binary[0] ||
      ATRUE[0] === binary[0] ||
      DFALSE[0] === binary[0] ||
      DTRUE[0] === binary[0]
    );
  }

  public decode(binary: Uint8Array): ValueContract {
    const { ATRUE, DTRUE } = this.table;
    return ATRUE[0] === binary[0] || DTRUE[0] === binary[0];
  }

  public encodable(meta: MetaValueContract): boolean {
    return meta.type === "boolean";
  }

  public encode(binary: Uint8Array, meta: MetaValueContract): Uint8Array {
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
