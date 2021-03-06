import { Dictionary, Meta, Tuple, Value } from "@marubase/contract/collator";
import { BaseCoder } from "./base-coder";
import { CoderInterface } from "./coder.interface";
import { MetaValue } from "./meta-value";

export class ComplexCoder extends BaseCoder implements CoderInterface {
  protected prefixes: { [type: number]: CoderInterface } = {};

  protected types: { [type: string]: CoderInterface } = {};

  public decode(binary: Uint8Array): Value {
    if (this.prefixes[binary[0]])
      return this.prefixes[binary[0]].decode(binary);

    const { ANULL, AUNDEF, DNULL, DUNDEF } = this.table;
    if (ANULL[0] === binary[0] || DNULL[0] === binary[0]) return null;
    if (AUNDEF[0] === binary[0] || DUNDEF[0] === binary[0]) return undefined;

    const { AASTART, AACOMMA, AAEND, AESCAPE } = this.table;
    const { DASTART, DACOMMA, DAEND, DESCAPE } = this.table;
    const { AOSTART, AOCOLON, AOCOMMA, AOEND } = this.table;
    const { DOSTART, DOCOLON, DOCOMMA, DOEND } = this.table;

    const data: Value[] = [];
    const cursorStack: Value[] = [data];
    const binaryLength = binary.length;
    for (let index = 0, offset = 0, key = ""; index < binaryLength; index++) {
      const cursor = cursorStack[cursorStack.length - 1];
      if (AESCAPE[0] === binary[index] || DESCAPE[0] === binary[index]) {
        if (
          (AESCAPE[0] === binary[index] && AESCAPE[0] === binary[index + 1]) ||
          (DESCAPE[0] === binary[index] && DESCAPE[0] === binary[index + 1])
        ) {
          index += 1;
          continue;
        }
      }

      if (AASTART[0] === binary[index] || DASTART[0] === binary[index]) {
        if (
          (AASTART[0] === binary[index] && AESCAPE[0] === binary[index + 1]) ||
          (DASTART[0] === binary[index] && DESCAPE[0] === binary[index + 1])
        ) {
          index += 1;
          continue;
        }
        if (Array.isArray(cursor)) {
          cursor.push([]);
          cursorStack.push(cursor[cursor.length - 1]);
        } else {
          (<Dictionary<Value>>cursor)[key] = [];
          cursorStack.push((<Dictionary<Value>>cursor)[key]);
        }
        offset = index + 1;
        continue;
      }
      if (AACOMMA[0] === binary[index] || DACOMMA[0] === binary[index]) {
        if (
          (AACOMMA[0] === binary[index] && AESCAPE[0] === binary[index + 1]) ||
          (DACOMMA[0] === binary[index] && DESCAPE[0] === binary[index + 1])
        ) {
          index += 1;
          continue;
        }
        const encoded = new Uint8Array(binary.buffer, offset, index - offset);
        if (encoded.length > 0) {
          const decoded = this.decode(encoded);
          (<Tuple<Value>>cursor).push(decoded);
        }
        offset = index + 1;
        continue;
      }
      if (AAEND[0] === binary[index] || DAEND[0] === binary[index]) {
        if (
          (AAEND[0] === binary[index] && AESCAPE[0] === binary[index + 1]) ||
          (DAEND[0] === binary[index] && DESCAPE[0] === binary[index + 1])
        ) {
          index += 1;
          continue;
        }
        const encoded = new Uint8Array(binary.buffer, offset, index - offset);
        if (encoded.length > 0) {
          const decoded = this.decode(encoded);
          (<Tuple<Value>>cursor).push(decoded);
        }
        cursorStack.pop();
        offset = index + 1;
        continue;
      }

      if (AOSTART[0] === binary[index] || DOSTART[0] === binary[index]) {
        if (
          (AOSTART[0] === binary[index] && AESCAPE[0] === binary[index + 1]) ||
          (DOSTART[0] === binary[index] && DESCAPE[0] === binary[index + 1])
        ) {
          index += 1;
          continue;
        }
        if (Array.isArray(cursor)) {
          cursor.push({});
          cursorStack.push(cursor[cursor.length - 1]);
        } else {
          (<Dictionary<Value>>cursor)[key] = {};
          cursorStack.push((<Dictionary<Value>>cursor)[key]);
        }
        offset = index + 1;
        continue;
      }
      if (AOCOLON[0] === binary[index] || DOCOLON[0] === binary[index]) {
        if (
          (AOCOLON[0] === binary[index] && AESCAPE[0] === binary[index + 1]) ||
          (DOCOLON[0] === binary[index] && DESCAPE[0] === binary[index + 1])
        ) {
          index += 1;
          continue;
        }
        const encoded = new Uint8Array(binary.buffer, offset, index - offset);
        key = <string>this.decode(encoded);
        offset = index + 1;
        continue;
      }
      if (AOCOMMA[0] === binary[index] || DOCOMMA[0] === binary[index]) {
        if (
          (AOCOMMA[0] === binary[index] && AESCAPE[0] === binary[index + 1]) ||
          (DOCOMMA[0] === binary[index] && DESCAPE[0] === binary[index + 1])
        ) {
          index += 1;
          continue;
        }
        const encoded = new Uint8Array(binary.buffer, offset, index - offset);
        if (encoded.length > 0) {
          const decoded = this.decode(encoded);
          (<Dictionary<Value>>cursor)[key] = decoded;
        }
        offset = index + 1;
        continue;
      }
      if (AOEND[0] === binary[index] || DOEND[0] === binary[index]) {
        if (
          (AOEND[0] === binary[index] && AESCAPE[0] === binary[index + 1]) ||
          (DOEND[0] === binary[index] && DESCAPE[0] === binary[index + 1])
        ) {
          index += 1;
          continue;
        }
        const encoded = new Uint8Array(binary.buffer, offset, index - offset);
        if (encoded.length > 0) {
          const decoded = this.decode(encoded);
          (<Dictionary<Value>>cursor)[key] = decoded;
        }
        cursorStack.pop();
        offset = index + 1;
        continue;
      }
    }
    return data[0];
  }

  public encode(binary: Uint8Array, value: Meta<Value>): Uint8Array {
    if (this.types[value.type])
      return this.types[value.type].encode(binary, value);
    if (value.type === "array") return this.encodeArray(binary, value);
    if (value.type === "object") return this.encodeObject(binary, value);
    if (value.type === "null") return this.encodeNull(binary, value);
    return this.encodeUndefined(binary, value);
  }

  public register(serviceFn: (coder: ComplexCoder) => void): ComplexCoder {
    serviceFn(this);
    return this;
  }

  public registerPrefix(prefix: number, coder: CoderInterface): ComplexCoder {
    this.prefixes[prefix] = coder;
    return this;
  }

  public registerType(type: string, coder: CoderInterface): ComplexCoder {
    this.types[type] = coder;
    return this;
  }

  protected encodeArray(binary: Uint8Array, meta: Meta<Value>): Uint8Array {
    if (meta.asc) {
      const { AASTART, AACOMMA, AAEND } = this.table;
      const itemLength = (<Tuple<Value>>meta.value).length;

      let encoded = this.append(binary, AASTART);
      for (let index = 0; index < itemLength; index++) {
        const item = (<Tuple<Value>>meta.value)[index];
        const metaItem = MetaValue.create(item, meta.asc);
        encoded = this.encode(encoded, metaItem);
        if (index < itemLength - 1) encoded = this.append(encoded, AACOMMA);
      }
      encoded = this.append(encoded, AAEND);
      return encoded;
    } else {
      const { DASTART, DACOMMA, DAEND } = this.table;
      const itemLength = (<Tuple<Value>>meta.value).length;

      let encoded = this.append(binary, DASTART);
      for (let index = 0; index < itemLength; index++) {
        const item = (<Tuple<Value>>meta.value)[index];
        const metaItem = MetaValue.create(item, meta.asc);
        encoded = this.encode(encoded, metaItem);
        if (index < itemLength - 1) encoded = this.append(encoded, DACOMMA);
      }
      encoded = this.append(encoded, DAEND);
      return encoded;
    }
  }

  protected encodeNull(binary: Uint8Array, meta: Meta<Value>): Uint8Array {
    if (meta.asc) {
      const { ANULL } = this.table;
      return this.append(binary, ANULL);
    } else {
      const { DNULL } = this.table;
      return this.append(binary, DNULL);
    }
  }

  protected encodeObject(binary: Uint8Array, meta: Meta<Value>): Uint8Array {
    if (meta.asc) {
      const { AOSTART, AOCOLON, AOCOMMA, AOEND } = this.table;
      const items = <Dictionary<Value>>meta.value;
      const itemEntries = Object.entries(items);
      const itemLength = itemEntries.length;

      let encoded = this.append(binary, AOSTART);
      for (let index = 0; index < itemLength; index++) {
        const [key, item] = itemEntries[index];
        const metaKey = MetaValue.create(key, meta.asc);
        const metaItem = MetaValue.create(item, meta.asc);
        encoded = this.types.string.encode(encoded, metaKey);
        encoded = this.append(encoded, AOCOLON);
        encoded = this.encode(encoded, metaItem);
        if (index < itemLength - 1) encoded = this.append(encoded, AOCOMMA);
      }
      encoded = this.append(encoded, AOEND);
      return encoded;
    } else {
      const { DOSTART, DOCOLON, DOCOMMA, DOEND } = this.table;
      const items = <Dictionary<Value>>meta.value;
      const itemEntries = Object.entries(items);
      const itemLength = itemEntries.length;

      let encoded = this.append(binary, DOSTART);
      for (let index = 0; index < itemLength; index++) {
        const [key, item] = itemEntries[index];
        const metaKey = MetaValue.create(key, meta.asc);
        const metaItem = MetaValue.create(item, meta.asc);
        encoded = this.types.string.encode(encoded, metaKey);
        encoded = this.append(encoded, DOCOLON);
        encoded = this.encode(encoded, metaItem);
        if (index < itemLength - 1) encoded = this.append(encoded, DOCOMMA);
      }
      encoded = this.append(encoded, DOEND);
      return encoded;
    }
  }

  protected encodeUndefined(binary: Uint8Array, meta: Meta<Value>): Uint8Array {
    if (meta.asc) {
      const { AUNDEF } = this.table;
      return this.append(binary, AUNDEF);
    } else {
      const { DUNDEF } = this.table;
      return this.append(binary, DUNDEF);
    }
  }
}
