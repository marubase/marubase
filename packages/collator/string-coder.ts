import { MetaValueContract, ValueContract } from "@marubase/contract";
import { BaseCoder } from "./base-coder";
import { CoderInterface } from "./coder.interface";
import { ComplexCoder } from "./complex-coder";

export class StringCoder extends BaseCoder implements CoderInterface {
  public decoder = new TextDecoder();

  public encoder = new TextEncoder();

  public static service(complex: ComplexCoder): void {
    const instance = new StringCoder(complex.table);
    complex.types.string = instance;

    const { ASSTART, DSSTART } = complex.table;
    const prefixes = [ASSTART, DSSTART];
    prefixes.forEach((prefix) => (complex.prefixes[prefix[0]] = instance));
  }

  public decodable(binary: Uint8Array): boolean {
    const { ASSTART, DSSTART } = this.table;
    return ASSTART[0] === binary[0] || DSSTART[0] === binary[0];
  }

  public decode(binary: Uint8Array): ValueContract {
    if (binary[0] < 128) {
      const { buffer, byteLength, byteOffset } = binary;
      const content = new Uint8Array(buffer, byteOffset + 1, byteLength - 2);
      return this.decoder.decode(content);
    } else {
      const { buffer, byteLength, byteOffset } = binary;
      const inverted = new Uint8Array(buffer, byteOffset + 1, byteLength - 2);
      const content = inverted.map((b) => b ^ 255);
      return this.decoder.decode(content);
    }
  }

  public encodable(meta: MetaValueContract): boolean {
    return meta.type === "string";
  }

  public encode(binary: Uint8Array, meta: MetaValueContract): Uint8Array {
    if (meta.asc) {
      const { ASSTART, ASEND } = this.table;
      const content = this.encoder.encode(<string>meta.value);
      return this.append(binary, ASSTART, content, ASEND);
    } else {
      const { DSSTART, DSEND } = this.table;
      const content = this.encoder.encode(<string>meta.value);
      const inverted = content.map((b) => b ^ 255);
      return this.append(binary, DSSTART, inverted, DSEND);
    }
  }
}
