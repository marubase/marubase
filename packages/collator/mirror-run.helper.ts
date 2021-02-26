import { MetaValueContract, ValueContract } from "@marubase/contract";
import { MetaValue } from "./meta-value";

interface ToBufferFn {
  (hex: string): Uint8Array;
}

interface ToMetaFn {
  (value: ValueContract): MetaValueContract;
}

interface TestFn {
  (asc: boolean, toBuffer: ToBufferFn, toMeta: ToMetaFn): void;
}

function toBufferFnHelper(asc: boolean): ToBufferFn {
  return (hex: string): Uint8Array => {
    const bytes = hex.match(/.{1,2}/g).map((b) => parseInt(b, 16));
    const buffer = new Uint8Array(bytes);
    return !asc ? buffer.map((b) => b ^ 255) : buffer;
  };
}

function toMetaFnHelper(asc: boolean): ToMetaFn {
  return (value: ValueContract): MetaValueContract => new MetaValue(value, asc);
}

export function mirrorRun(testFn: TestFn): void {
  testFn(true, toBufferFnHelper(true), toMetaFnHelper(true));
  testFn(false, toBufferFnHelper(false), toMetaFnHelper(false));
}
