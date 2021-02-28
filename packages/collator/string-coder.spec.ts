import { expect } from "chai";
import { CodeTable } from "./code-table";
import { CoderInterface } from "./coder.interface";
import { mirrorRun } from "./mirror-run.spec-helper";
import { StringCoder } from "./string-coder";

mirrorRun((asc, toBuffer, toMeta) => {
  describe(`StringCoder (${asc ? "asc" : "desc"})`, () => {
    let coder: CoderInterface;
    beforeEach(() => {
      coder = new StringCoder(CodeTable);
    });

    describe("#decode(binary)", () => {
      context("when given string binary", () => {
        it("should returns string value", () => {
          const hex = "0d7465737402";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);
          expect(decoded).to.equals("test");
        });
      });
      context("when given string with specials binary", () => {
        it("should returns unescaped string value", () => {
          const hex = "0d746573747f7f02";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);
          expect(decoded).to.equals("test\x7f");
        });
      });
      context("when given string with specials binary #2", () => {
        it("should returns unescaped string value", () => {
          const hex = "0d7f7f7465737402";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);
          expect(decoded).to.equals("\x7ftest");
        });
      });
    });

    describe("#encode(binary, meta)", () => {
      context("when given string value", () => {
        it("should returns string binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = "test";
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "0d7465737402";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(8 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given string with specials", () => {
        it("should returns escaped string binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = "test\x7f";
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "0d746573747f7f02";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(8 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given string with specials #2", () => {
        it("should returns escaped string binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = "\x7ftest";
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "0d7f7f7465737402";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(8 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
    });
  });
});
