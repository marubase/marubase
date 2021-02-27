import { MetaValueContract, ValueContract } from "@marubase/contract";
import { BaseCoder } from "./base-coder";
import { CoderInterface } from "./coder.interface";

export class BufferCoder extends BaseCoder implements CoderInterface {
  public decodable(binary: Uint8Array): boolean {
    const { ABSTART, DBSTART } = this.table;
    return ABSTART[0] === binary[0] || DBSTART[0] === binary[0];
  }

  public decode(binary: Uint8Array): ValueContract {
    const { ABSTART } = this.table;
    if (ABSTART[0] === binary[0]) {
      const content = new Uint8Array(binary.buffer, 1, binary.length - 2);
      return content;
    } else {
      const inverted = new Uint8Array(binary.buffer, 1, binary.length - 2);
      const content = inverted.map((b) => b ^ 255);
      return content;
    }
  }

  public encodable(meta: MetaValueContract): boolean {
    return meta.type === "buffer";
  }

  public encode(binary: Uint8Array, meta: MetaValueContract): Uint8Array {
    if (meta.asc) {
      const { ABSTART, ABEND } = this.table;
      return this.append(binary, ABSTART, <Uint8Array>meta.value, ABEND);
    } else {
      const { DBSTART, DBEND } = this.table;
      const inverted = (<Uint8Array>meta.value).map((b) => b ^ 255);
      return this.append(binary, DBSTART, inverted, DBEND);
    }
  }
}
