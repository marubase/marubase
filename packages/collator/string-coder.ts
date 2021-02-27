import { MetaValueContract, ValueContract } from "@marubase/contract";
import { BaseCoder } from "./base-coder";
import { CodeTable } from "./code-table";
import { CoderInterface } from "./coder.interface";

export class StringCoder extends BaseCoder implements CoderInterface {
  public decoder: TextDecoder;

  public encoder: TextEncoder;

  public constructor(public table: typeof CodeTable) {
    super(table);
    this.decoder = new TextDecoder();
    this.encoder = new TextEncoder();
  }

  public decodable(binary: Uint8Array): boolean {
    const { ASSTART, DSSTART } = this.table;
    return ASSTART[0] === binary[0] || DSSTART[0] === binary[0];
  }

  public decode(binary: Uint8Array): ValueContract {
    const { ASSTART } = this.table;
    if (ASSTART[0] === binary[0]) {
      const content = new Uint8Array(binary.buffer, 1, binary.length - 2);
      return this.decoder.decode(content);
    } else {
      const inverted = new Uint8Array(binary.buffer, 1, binary.length - 2);
      const content = inverted.map((b) => b ^ 255);
      return this.decoder.decode(content);
    }
  }

  public encodable(meta: MetaValueContract): boolean {
    return meta.type === "string";
  }

  public encode(binary: Uint8Array, meta: MetaValueContract): Uint8Array {
    const content = this.encoder.encode(<string>meta.value);
    if (meta.asc) {
      const { ASSTART, ASEND } = this.table;
      return this.append(binary, ASSTART, content, ASEND);
    } else {
      const { DSSTART, DSEND } = this.table;
      const inverted = content.map((b) => b ^ 255);
      return this.append(binary, DSSTART, inverted, DSEND);
    }
  }
}
