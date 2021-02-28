import { MetaValueContract, ValueContract } from "@marubase/contract";
import { BaseCoder } from "./base-coder";
import { CoderInterface } from "./coder.interface";
import { ComplexCoder } from "./complex-coder";

export class BufferCoder extends BaseCoder implements CoderInterface {
  public static service(complex: ComplexCoder): void {
    const instance = new BufferCoder(complex.table);
    complex.registerType("buffer", instance);

    const { ABSTART, DBSTART } = complex.table;
    const prefixes = [ABSTART, DBSTART];
    prefixes.forEach((prefix) => complex.registerPrefix(prefix[0], instance));
  }

  public decode(binary: Uint8Array): ValueContract {
    if (binary[0] < 128) {
      const { buffer, byteLength, byteOffset } = binary;
      const escaped = new Uint8Array(buffer, byteOffset + 1, byteLength - 2);
      const content = this.unescape(escaped);
      return content;
    } else {
      const { buffer, byteLength, byteOffset } = binary;
      const inverted = new Uint8Array(buffer, byteOffset + 1, byteLength - 2);
      const escaped = inverted.map((b) => b ^ 255);
      const content = this.unescape(escaped);
      return content;
    }
  }

  public encode(binary: Uint8Array, meta: MetaValueContract): Uint8Array {
    if (meta.asc) {
      const { ABSTART, ABEND } = this.table;
      const content = <Uint8Array>meta.value;
      const escaped = this.escape(content);
      return this.append(binary, ABSTART, escaped, ABEND);
    } else {
      const { DBSTART, DBEND } = this.table;
      const content = <Uint8Array>meta.value;
      const escaped = this.escape(content);
      const inverted = escaped.map((b) => b ^ 255);
      return this.append(binary, DBSTART, inverted, DBEND);
    }
  }
}
