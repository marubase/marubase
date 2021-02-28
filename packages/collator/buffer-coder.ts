import { MetaValueContract, ValueContract } from "@marubase/contract";
import { BaseCoder } from "./base-coder";
import { CoderInterface } from "./coder.interface";
import { ComplexCoder } from "./complex-coder";

export class BufferCoder extends BaseCoder implements CoderInterface {
  public static service(complex: ComplexCoder): void {
    const instance = new BufferCoder(complex.table);
    complex.types.buffer = instance;

    const { ABSTART, DBSTART } = complex.table;
    const prefixes = [ABSTART, DBSTART];
    prefixes.forEach((prefix) => (complex.prefixes[prefix[0]] = instance));
  }

  public decodable(binary: Uint8Array): boolean {
    const { ABSTART, DBSTART } = this.table;
    return ABSTART[0] === binary[0] || DBSTART[0] === binary[0];
  }

  public decode(binary: Uint8Array): ValueContract {
    if (binary[0] < 128) {
      const { buffer, byteLength, byteOffset } = binary;
      const content = new Uint8Array(buffer, byteOffset + 1, byteLength - 2);
      return content;
    } else {
      const { buffer, byteLength, byteOffset } = binary;
      const inverted = new Uint8Array(buffer, byteOffset + 1, byteLength - 2);
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
      const content = <Uint8Array>meta.value;
      return this.append(binary, ABSTART, content, ABEND);
    } else {
      const { DBSTART, DBEND } = this.table;
      const content = <Uint8Array>meta.value;
      const inverted = content.map((b) => b ^ 255);
      return this.append(binary, DBSTART, inverted, DBEND);
    }
  }
}
