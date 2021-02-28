import { MetaValueContract, ValueContract } from "@marubase/contract";
import { BaseCoder } from "./base-coder";
import { CoderInterface } from "./coder.interface";
import { ComplexCoder } from "./complex-coder";

export class StringCoder extends BaseCoder implements CoderInterface {
  public decoder = new TextDecoder();

  public encoder = new TextEncoder();

  public static service(complex: ComplexCoder): void {
    const instance = new StringCoder(complex.table);
    complex.registerType("string", instance);

    const { ASSTART, DSSTART } = complex.table;
    const prefixes = [ASSTART, DSSTART];
    prefixes.forEach((prefix) => complex.registerPrefix(prefix[0], instance));
  }

  public decode(binary: Uint8Array): ValueContract {
    if (binary[0] < 128) {
      const { buffer, byteLength, byteOffset } = binary;
      const escaped = new Uint8Array(buffer, byteOffset + 1, byteLength - 2);
      const content = this.unescape(escaped);
      return this.decoder.decode(content);
    } else {
      const { buffer, byteLength, byteOffset } = binary;
      const inverted = new Uint8Array(buffer, byteOffset + 1, byteLength - 2);
      const escaped = inverted.map((b) => b ^ 255);
      const content = this.unescape(escaped);
      return this.decoder.decode(content);
    }
  }

  public encode(binary: Uint8Array, meta: MetaValueContract): Uint8Array {
    if (meta.asc) {
      const { ASSTART, ASEND } = this.table;
      const content = this.encoder.encode(<string>meta.value);
      const escaped = this.escape(content);
      return this.append(binary, ASSTART, escaped, ASEND);
    } else {
      const { DSSTART, DSEND } = this.table;
      const content = this.encoder.encode(<string>meta.value);
      const escaped = this.escape(content);
      const inverted = escaped.map((b) => b ^ 255);
      return this.append(binary, DSSTART, inverted, DSEND);
    }
  }
}
