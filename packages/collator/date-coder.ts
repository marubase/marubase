import { MetaValueContract, ValueContract } from "@marubase/contract";
import { BaseCoder } from "./base-coder";
import { CoderInterface } from "./coder.interface";

export class DateCoder extends BaseCoder implements CoderInterface {
  public decodable(binary: Uint8Array): boolean {
    const { APDATE, ANDATE, DPDATE, DNDATE } = this.table;
    return (
      APDATE[0] === binary[0] ||
      ANDATE[0] === binary[0] ||
      DPDATE[0] === binary[0] ||
      DNDATE[0] === binary[0]
    );
  }

  public decode(binary: Uint8Array): ValueContract {
    if (binary[0] < 128) {
      const { APDATE } = this.table;
      if (APDATE[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const content = new Uint8Array(buffer, byteOffset + 1, byteLength - 1);
        const epoch = this.toNumber(content);
        return new Date(epoch);
      } else {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = new Uint8Array(buffer, byteOffset + 1, byteLength - 1);
        const content = inverted.map((b) => b ^ 255);
        const epoch = -1 * this.toNumber(content);
        return new Date(epoch);
      }
    } else {
      const { DPDATE } = this.table;
      if (DPDATE[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = new Uint8Array(buffer, byteOffset + 1, byteLength - 1);
        const content = inverted.map((b) => b ^ 255);
        const epoch = this.toNumber(content);
        return new Date(epoch);
      } else {
        const { buffer, byteLength, byteOffset } = binary;
        const content = new Uint8Array(buffer, byteOffset + 1, byteLength - 1);
        const epoch = -1 * this.toNumber(content);
        return new Date(epoch);
      }
    }
  }

  public encodable(meta: MetaValueContract): boolean {
    return meta.type === "date";
  }

  public encode(binary: Uint8Array, meta: MetaValueContract): Uint8Array {
    const epoch = (<Date>meta.value).getTime();
    if (meta.asc) {
      const { APDATE, ANDATE } = this.table;
      if (epoch >= 0) {
        const content = this.toBinary(epoch);
        return this.append(binary, APDATE, content);
      } else {
        const content = this.toBinary(-1 * epoch);
        const inverted = content.map((b) => b ^ 255);
        return this.append(binary, ANDATE, inverted);
      }
    } else {
      const { DPDATE, DNDATE } = this.table;
      if (epoch >= 0) {
        const content = this.toBinary(epoch);
        const inverted = content.map((b) => b ^ 255);
        return this.append(binary, DPDATE, inverted);
      } else {
        const content = this.toBinary(-1 * epoch);
        return this.append(binary, DNDATE, content);
      }
    }
  }
}
