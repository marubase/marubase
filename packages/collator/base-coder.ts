import { CodeTable } from "./code-table";

export abstract class BaseCoder {
  public AESCAPEE: Uint8Array[] = [];

  public DESCAPEE: Uint8Array[] = [];

  public constructor(public table: typeof CodeTable) {
    const { AASTART, AACOMMA, AAEND, AESCAPE } = this.table;
    const { AOSTART, AOCOLON, AOCOMMA, AOEND } = this.table;
    this.AESCAPEE = [AASTART, AACOMMA, AAEND, AESCAPE];
    this.AESCAPEE.push(AOSTART, AOCOLON, AOCOMMA, AOEND);

    const { DASTART, DACOMMA, DAEND, DESCAPE } = this.table;
    const { DOSTART, DOCOLON, DOCOMMA, DOEND } = this.table;
    this.DESCAPEE = [DASTART, DACOMMA, DAEND, DESCAPE];
    this.DESCAPEE.push(DOSTART, DOCOLON, DOCOMMA, DOEND);
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
    if (binaryByteLength > buffer.length) {
      let newLength = buffer.length * 2 || 8;
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
    const { AESCAPE, DESCAPE } = this.table;
    const buffer = new Uint8Array(binary.buffer);
    const blocks: Uint8Array[] = [];
    let blockSize = 0;

    const target = binary.byteOffset + binary.byteLength;
    let idx = binary.byteOffset;
    let oft = binary.byteOffset;
    ESCAPE: for (; idx < target; idx++) {
      for (let cursor = this.AESCAPEE.length - 1; cursor >= 0; cursor--) {
        const PREFIX = this.AESCAPEE[cursor];
        if (PREFIX[0] === buffer[idx]) {
          const block = new Uint8Array(binary.buffer, oft, idx - oft + 1);
          blocks.push(block, AESCAPE);
          blockSize += block.length + 1;
          oft = idx + 1;
          continue ESCAPE;
        }
      }
      for (let cursor = this.DESCAPEE.length - 1; cursor >= 0; cursor--) {
        const PREFIX = this.DESCAPEE[cursor];
        if (PREFIX[0] === buffer[idx]) {
          const block = new Uint8Array(binary.buffer, oft, idx - oft + 1);
          blocks.push(block, DESCAPE);
          blockSize += block.length + 1;
          oft = idx + 1;
          continue ESCAPE;
        }
      }
    }
    const block = new Uint8Array(binary.buffer, oft, idx - oft);
    blocks.push(block);
    blockSize += block.length;

    const newBinary = new Uint8Array(blockSize);
    const blockLength = blocks.length;
    for (let index = 0, offset = 0; index < blockLength; index++) {
      newBinary.set(blocks[index], offset);
      offset += blocks[index].length;
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
    const { AESCAPE, DESCAPE } = this.table;
    const buffer = new Uint8Array(binary.buffer);
    const blocks: Uint8Array[] = [];
    let blockSize = 0;

    const target = binary.byteOffset + binary.byteLength;
    let idx = binary.byteOffset;
    let oft = binary.byteOffset;
    UNESCAPE: for (; idx < target; idx++) {
      for (let cursor = this.AESCAPEE.length - 1; cursor >= 0; cursor--) {
        const PREFIX = this.AESCAPEE[cursor];
        if (PREFIX[0] === buffer[idx] && AESCAPE[0] === buffer[idx + 1]) {
          const block = new Uint8Array(binary.buffer, oft, idx - oft + 1);
          blocks.push(block);
          blockSize += block.length;
          oft = idx + 2;
          idx = idx + 1;
          continue UNESCAPE;
        }
      }
      for (let cursor = this.DESCAPEE.length - 1; cursor >= 0; cursor--) {
        const PREFIX = this.DESCAPEE[cursor];
        if (PREFIX[0] === buffer[idx] && DESCAPE[0] === buffer[idx + 1]) {
          const block = new Uint8Array(binary.buffer, oft, idx - oft + 1);
          blocks.push(block);
          blockSize += block.length;
          oft = idx + 2;
          idx = idx + 1;
          continue UNESCAPE;
        }
      }
    }
    const block = new Uint8Array(binary.buffer, oft, idx - oft);
    blocks.push(block);
    blockSize += block.length;

    const newBinary = new Uint8Array(blockSize);
    const blockLength = blocks.length;
    for (let index = 0, offset = 0; index < blockLength; index++) {
      newBinary.set(blocks[index], offset);
      offset += blocks[index].length;
    }
    return newBinary;
  }
}
