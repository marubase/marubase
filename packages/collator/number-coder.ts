import { Meta, Value } from "@marubase/contract/collator";
import { BaseCoder } from "./base-coder";
import { CoderInterface } from "./coder.interface";
import { ComplexCoder } from "./complex-coder";

export class NumberCoder extends BaseCoder implements CoderInterface {
  public static service(complex: ComplexCoder): void {
    const instance = new NumberCoder(complex.table);
    complex.registerType("number", instance);

    const { ANAN, APNUM, ANNUM, DNAN, DPNUM, DNNUM } = complex.table;
    const prefixes = [ANAN, APNUM, ANNUM, DNAN, DPNUM, DNNUM];
    prefixes.forEach((prefix) => complex.registerPrefix(prefix[0], instance));
  }

  public decode(binary: Uint8Array): Value {
    if (binary[0] < 128) {
      const { ANAN, APNUM } = this.table;
      if (ANAN[0] === binary[0]) {
        return Number.NaN;
      } else if (APNUM[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const escaped = new Uint8Array(buffer, byteOffset + 1, byteLength - 1);
        const content = this.unescape(escaped);
        return this.toNumber(content);
      } else {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = new Uint8Array(buffer, byteOffset + 1, byteLength - 1);
        const escaped = inverted.map((b) => b ^ 255);
        const content = this.unescape(escaped);
        return -1 * this.toNumber(content);
      }
    } else {
      const { DNAN, DPNUM } = this.table;
      if (DNAN[0] === binary[0]) {
        return Number.NaN;
      } else if (DPNUM[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = new Uint8Array(buffer, byteOffset + 1, byteLength - 1);
        const escaped = inverted.map((b) => b ^ 255);
        const content = this.unescape(escaped);
        return this.toNumber(content);
      } else {
        const { buffer, byteLength, byteOffset } = binary;
        const escaped = new Uint8Array(buffer, byteOffset + 1, byteLength - 1);
        const content = this.unescape(escaped);
        return -1 * this.toNumber(content);
      }
    }
  }

  public encode(binary: Uint8Array, meta: Meta<Value>): Uint8Array {
    if (meta.asc) {
      const { ANAN, APNUM, ANNUM } = this.table;
      if (Number.isNaN(meta.value)) {
        const content = new Uint8Array(8);
        const escaped = this.escape(content);
        return this.append(binary, ANAN, escaped);
      } else if (<number>meta.value >= 0) {
        const content = this.toBinary(<number>meta.value);
        const escaped = this.escape(content);
        return this.append(binary, APNUM, escaped);
      } else {
        const content = this.toBinary(-1 * <number>meta.value);
        const escaped = this.escape(content);
        const inverted = escaped.map((b) => b ^ 255);
        return this.append(binary, ANNUM, inverted);
      }
    } else {
      const { DNAN, DPNUM, DNNUM } = this.table;
      if (Number.isNaN(meta.value)) {
        const content = new Uint8Array(8);
        const escaped = this.escape(content);
        const inverted = escaped.map((b) => b ^ 255);
        return this.append(binary, DNAN, inverted);
      } else if (<number>meta.value >= 0) {
        const content = this.toBinary(<number>meta.value);
        const escaped = this.escape(content);
        const inverted = escaped.map((b) => b ^ 255);
        return this.append(binary, DPNUM, inverted);
      } else {
        const content = this.toBinary(-1 * <number>meta.value);
        const escaped = this.escape(content);
        return this.append(binary, DNNUM, escaped);
      }
    }
  }
}
