import { Meta, Value } from "@marubase/contract/collator";
import { BaseCoder } from "./base-coder";
import { CoderInterface } from "./coder.interface";
import { ComplexCoder } from "./complex-coder";

export class DateCoder extends BaseCoder implements CoderInterface {
  public static service(complex: ComplexCoder): void {
    const instance = new DateCoder(complex.table);
    complex.registerType("date", instance);

    const { APDATE, ANDATE, DPDATE, DNDATE } = complex.table;
    const prefixes = [APDATE, ANDATE, DPDATE, DNDATE];
    prefixes.forEach((prefix) => complex.registerPrefix(prefix[0], instance));
  }

  public decode(binary: Uint8Array): Value {
    if (binary[0] < 128) {
      const { APDATE } = this.table;
      if (APDATE[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const escaped = new Uint8Array(buffer, byteOffset + 1, byteLength - 1);
        const content = this.unescape(escaped);
        const epoch = this.toNumber(content);
        return new Date(epoch);
      } else {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = new Uint8Array(buffer, byteOffset + 1, byteLength - 1);
        const escaped = inverted.map((b) => b ^ 255);
        const content = this.unescape(escaped);
        const epoch = -1 * this.toNumber(content);
        return new Date(epoch);
      }
    } else {
      const { DPDATE } = this.table;
      if (DPDATE[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = new Uint8Array(buffer, byteOffset + 1, byteLength - 1);
        const escaped = inverted.map((b) => b ^ 255);
        const content = this.unescape(escaped);
        const epoch = this.toNumber(content);
        return new Date(epoch);
      } else {
        const { buffer, byteLength, byteOffset } = binary;
        const escaped = new Uint8Array(buffer, byteOffset + 1, byteLength - 1);
        const content = this.unescape(escaped);
        const epoch = -1 * this.toNumber(content);
        return new Date(epoch);
      }
    }
  }

  public encode(binary: Uint8Array, meta: Meta<Value>): Uint8Array {
    const epoch = (<Date>meta.value).getTime();
    if (meta.asc) {
      const { APDATE, ANDATE } = this.table;
      if (epoch >= 0) {
        const content = this.toBinary(epoch);
        const escaped = this.escape(content);
        return this.append(binary, APDATE, escaped);
      } else {
        const content = this.toBinary(-1 * epoch);
        const escaped = this.escape(content);
        const inverted = escaped.map((b) => b ^ 255);
        return this.append(binary, ANDATE, inverted);
      }
    } else {
      const { DPDATE, DNDATE } = this.table;
      if (epoch >= 0) {
        const content = this.toBinary(epoch);
        const escaped = this.escape(content);
        const inverted = escaped.map((b) => b ^ 255);
        return this.append(binary, DPDATE, inverted);
      } else {
        const content = this.toBinary(-1 * epoch);
        const escaped = this.escape(content);
        return this.append(binary, DNDATE, escaped);
      }
    }
  }
}
