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
        it("should returns string", () => {
          const hex = "0d7465737402";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);
          expect(decoded).to.equals("test");
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
    });
  });
});
