import { expect } from "chai";
import { BufferCoder } from "./buffer-coder";
import { CodeTable } from "./code-table";
import { CoderInterface } from "./coder.interface";
import { mirrorRun } from "./mirror-run.spec-helper";

mirrorRun((asc, toBuffer, toMeta) => {
  describe(`BufferCoder (${asc ? "asc" : "desc"})`, () => {
    let coder: CoderInterface;
    beforeEach(() => {
      coder = new BufferCoder(CodeTable);
    });

    describe("#decode(binary)", () => {
      context("when given buffer binary", () => {
        it("should returns buffer value", () => {
          const hex = "0c7465737403";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);

          const decodedBinary = new Uint8Array([116, 101, 115, 116]);
          expect(decoded).to.deep.equals(decodedBinary);
        });
      });
      context("when given buffer with specials binary", () => {
        it("should returns buffer value", () => {
          const hex = "0c746573747f7f03";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);

          const decodedBinary = new Uint8Array([116, 101, 115, 116, 127]);
          expect(decoded).to.deep.equals(decodedBinary);
        });
      });
      context("when given buffer with specials binary #2", () => {
        it("should returns buffer value", () => {
          const hex = "0c7f7f7465737403";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);

          const decodedBinary = new Uint8Array([127, 116, 101, 115, 116]);
          expect(decoded).to.deep.equals(decodedBinary);
        });
      });
    });

    describe("#encode(binary, meta)", () => {
      context("when given buffer value", () => {
        it("should returns buffer binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = new Uint8Array([116, 101, 115, 116]);
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "0c7465737403";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(8 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given buffer with specials", () => {
        it("should returns buffer binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = new Uint8Array([116, 101, 115, 116, 127]);
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "0c746573747f7f03";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(8 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given buffer with specials #2", () => {
        it("should returns buffer binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = new Uint8Array([127, 116, 101, 115, 116]);
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "0c7f7f7465737403";
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
