import { CodeTable } from "./code-table";

export abstract class BaseCoder {
  public ESCAPEE: Uint8Array[] = [];

  public constructor(public table: typeof CodeTable) {
    const { AASTART, AACOMMA, AAEND, AESCAPE } = this.table;
    const { AOSTART, AOCOLON, AOCOMMA, AOEND } = this.table;
    this.ESCAPEE = [AASTART, AACOMMA, AAEND, AESCAPE];
    this.ESCAPEE.push(AOSTART, AOCOLON, AOCOMMA, AOEND);
  }

  protected append(binary: Uint8Array, ...items: Uint8Array[]): Uint8Array {
    let buffer = new Uint8Array(binary.buffer);

    let itemsByteLength = 0;
    const itemsLength = items.length;
    for (let index = 0; index < itemsLength; index++) {
      itemsByteLength += items[index].length;
    }

    const binaryByteLength =
      binary.byteOffset + binary.byteLength + itemsByteLength;
    while (binaryByteLength > buffer.length) {
      let newLength = buffer.length * 2 || 1;
      while (binaryByteLength > newLength) newLength *= 2;

      const newBuffer = new Uint8Array(newLength);
      newBuffer.set(buffer);
      buffer = newBuffer;
    }

    let itemOffset = binary.byteOffset + binary.byteLength;
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

  protected escape(binary: Uint8Array): Uint8Array {
    const { AESCAPE } = this.table;
    const blocks: Uint8Array[] = [];
    let blockSize = 0;

    const binaryLength = binary.length;
    let offset = 0;
    ESCAPE: for (let index = 0; index < binaryLength; index++) {
      for (let cursor = this.ESCAPEE.length - 1; cursor >= 0; cursor--) {
        const TARGET = this.ESCAPEE[cursor];
        if (TARGET[0] === binary[index]) {
          const block = new Uint8Array(binary.buffer, offset, index + 1);
          blocks.push(block, AESCAPE);
          blockSize += block.length + 1;
          offset = index + 1;
          continue ESCAPE;
        }
      }
    }
    const block = new Uint8Array(binary.buffer, offset);
    blockSize += block.length;
    blocks.push(block);

    const newBinary = new Uint8Array(blockSize);
    const blockLength = blocks.length;
    for (let index = 0, offset = 0; index < blockLength; index++) {
      newBinary.set(blocks[index], offset);
      offset += blocks[index].byteLength;
    }
    return newBinary;
  }

  protected toBinary(value: number): Uint8Array {
    const binary = new Uint8Array(8);
    const view = new DataView(binary.buffer);
    view.setFloat64(0, value, false);
    return binary;
  }

  protected toNumber(binary: Uint8Array): number {
    const { buffer, byteLength, byteOffset } = binary;
    const view = new DataView(buffer, byteOffset, byteLength);
    return view.getFloat64(0, false);
  }

  protected unescape(binary: Uint8Array): Uint8Array {
    const { AESCAPE } = this.table;
    const buffer = new Uint8Array(binary.buffer);
    const blocks: Uint8Array[] = [];
    let blockSize = 0;

    const byteLength = binary.byteOffset + binary.byteLength;
    let idx = binary.byteOffset;
    let offset = binary.byteOffset;
    UNESCAPE: for (; idx < byteLength; idx++) {
      for (let cursor = this.ESCAPEE.length - 1; cursor >= 0; cursor--) {
        const TARGET = this.ESCAPEE[cursor];
        if (TARGET[0] === buffer[idx] && AESCAPE[0] === buffer[idx + 1]) {
          const block = new Uint8Array(binary.buffer, offset, idx - offset + 1);
          blocks.push(block);
          blockSize += block.length;
          offset = idx + 2;
          idx = idx + 1;
          continue UNESCAPE;
        }
      }
    }
    const block = new Uint8Array(binary.buffer, offset, idx - offset);
    blocks.push(block);
    blockSize += block.length;

    const newBinary = new Uint8Array(blockSize);
    const blockLength = blocks.length;
    for (let idx = 0, offset = 0; idx < blockLength; idx++) {
      newBinary.set(blocks[idx], offset);
      offset += blocks[idx].length;
    }
    return newBinary;
  }
}
