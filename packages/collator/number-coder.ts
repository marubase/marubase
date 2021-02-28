import { MetaValueContract, ValueContract } from "@marubase/contract";
import { BaseCoder } from "./base-coder";
import { CoderInterface } from "./coder.interface";
import { ComplexCoder } from "./complex-coder";

export class NumberCoder extends BaseCoder implements CoderInterface {
  public static service(complex: ComplexCoder): void {
    const instance = new NumberCoder(complex.table);
    complex.types.number = instance;

    const { ANAN, APNUM, ANNUM, DNAN, DPNUM, DNNUM } = complex.table;
    const prefixes = [ANAN, APNUM, ANNUM, DNAN, DPNUM, DNNUM];
    prefixes.forEach((prefix) => (complex.prefixes[prefix[0]] = instance));
  }

  public decode(binary: Uint8Array): ValueContract {
    if (binary[0] < 128) {
      const { ANAN, APNUM } = this.table;
      if (ANAN[0] === binary[0]) {
        return Number.NaN;
      } else if (APNUM[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const content = new Uint8Array(buffer, byteOffset + 1, byteLength - 1);
        return this.toNumber(content);
      } else {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = new Uint8Array(buffer, byteOffset + 1, byteLength - 1);
        const content = inverted.map((b) => b ^ 255);
        return -1 * this.toNumber(content);
      }
    } else {
      const { DNAN, DPNUM } = this.table;
      if (DNAN[0] === binary[0]) {
        return Number.NaN;
      } else if (DPNUM[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = new Uint8Array(buffer, byteOffset + 1, byteLength - 1);
        const content = inverted.map((b) => b ^ 255);
        return this.toNumber(content);
      } else {
        const { buffer, byteLength, byteOffset } = binary;
        const content = new Uint8Array(buffer, byteOffset + 1, byteLength - 1);
        return -1 * this.toNumber(content);
      }
    }
  }

  public encode(binary: Uint8Array, meta: MetaValueContract): Uint8Array {
    if (meta.asc) {
      const { ANAN, APNUM, ANNUM } = this.table;
      if (Number.isNaN(meta.value)) {
        const content = new Uint8Array(8);
        return this.append(binary, ANAN, content);
      } else if (<number>meta.value >= 0) {
        const content = this.toBinary(<number>meta.value);
        return this.append(binary, APNUM, content);
      } else {
        const content = this.toBinary(-1 * <number>meta.value);
        const inverted = content.map((b) => b ^ 255);
        return this.append(binary, ANNUM, inverted);
      }
    } else {
      const { DNAN, DPNUM, DNNUM } = this.table;
      if (Number.isNaN(meta.value)) {
        const inverted = new Uint8Array(8).fill(255);
        return this.append(binary, DNAN, inverted);
      } else if (<number>meta.value >= 0) {
        const content = this.toBinary(<number>meta.value);
        const inverted = content.map((b) => b ^ 255);
        return this.append(binary, DPNUM, inverted);
      } else {
        const content = this.toBinary(-1 * <number>meta.value);
        return this.append(binary, DNNUM, content);
      }
    }
  }
}
