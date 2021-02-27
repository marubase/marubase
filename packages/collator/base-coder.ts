import { CodeTable } from "./code-table";

export abstract class BaseCoder {
  public constructor(public table: typeof CodeTable) {}

  public append(binary: Uint8Array, ...items: Uint8Array[]): Uint8Array {
    let buffer = new Uint8Array(binary.buffer);

    let itemByteLength = 0;
    const itemLength = items.length;
    for (let index = 0; index < itemLength; index++) {
      itemByteLength += items[index].length;
    }

    while (binary.byteOffset + itemByteLength > buffer.length) {
      let newLength = buffer.length * 2 || 1;
      while (binary.byteOffset + itemByteLength > newLength) newLength *= 2;
      const newBuffer = new Uint8Array(newLength);
      newBuffer.set(buffer);
      buffer = newBuffer;
    }

    let itemOffset = binary.byteOffset;
    for (let index = 0; index < itemLength; index++) {
      buffer.set(items[index], itemOffset);
      itemOffset += items[index].length;
    }

    return new Uint8Array(
      buffer.buffer,
      binary.byteOffset,
      binary.length + itemByteLength
    );
  }
}
