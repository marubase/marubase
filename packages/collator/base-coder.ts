import { CodeTable } from "./code-table";

export abstract class BaseCoder {
  public constructor(public table: typeof CodeTable) {}

  public append(binary: Uint8Array, ...items: Uint8Array[]): Uint8Array {
    let buffer = new Uint8Array(binary.buffer);

    let itemsByteLength = 0;
    const itemsLength = items.length;
    for (let index = 0; index < itemsLength; index++) {
      itemsByteLength += items[index].length;
    }

    while (binary.byteOffset + itemsByteLength > buffer.length) {
      let newLength = buffer.length * 2 || 1;
      while (binary.byteOffset + itemsByteLength > newLength) newLength *= 2;

      const newBuffer = new Uint8Array(newLength);
      newBuffer.set(buffer);
      buffer = newBuffer;
    }

    let itemOffset = binary.byteOffset;
    for (let index = 0; index < itemsLength; index++) {
      buffer.set(items[index], itemOffset);
      itemOffset += items[index].length;
    }

    return new Uint8Array(
      buffer.buffer,
      binary.byteOffset,
      binary.length + itemsByteLength
    );
  }

  public toBinary(value: number): Uint8Array {
    const binary = new Uint8Array(8);
    const view = new DataView(binary.buffer);
    view.setFloat64(0, value, false);
    return binary;
  }

  public toNumber(binary: Uint8Array): number {
    const { buffer, byteLength, byteOffset } = binary;
    const view = new DataView(buffer, byteOffset, byteLength);
    return view.getFloat64(0, false);
  }
}
