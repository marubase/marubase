import { CodeTable } from "./code-table";

export abstract class BaseCoder {
  public constructor(public table: typeof CodeTable) {}

  public append(binary: Uint8Array, bytes: Uint8Array): Uint8Array {
    let buffer = new Uint8Array(binary.buffer);
    while (binary.byteOffset + bytes.length > buffer.length) {
      let newLength = buffer.length * 2 || 1;
      while (binary.byteOffset + bytes.length > newLength) newLength *= 2;
      const newBuffer = new Uint8Array(newLength);
      newBuffer.set(buffer);
      buffer = newBuffer;
    }
    buffer.set(bytes, binary.byteOffset);
    return new Uint8Array(
      buffer.buffer,
      binary.byteOffset,
      binary.length + bytes.length
    );
  }
}
