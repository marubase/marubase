import { expect } from "chai";
import { BaseCoder } from "./base-coder";
import { CodeTable } from "./code-table";
import { mirrorRun } from "./mirror-run.helper";

class TestCoder extends BaseCoder {}

mirrorRun((asc, toBuffer) => {
  describe(`BaseCoder ({${asc ? "asc" : "desc"}})`, () => {
    let coder: BaseCoder;
    beforeEach(() => {
      coder = new TestCoder(CodeTable);
    });

    describe("#append(binary, bytes)", () => {
      context("when given empty buffer", () => {
        it("should returns appended binary", () => {
          const buffer = new ArrayBuffer(0);
          const binary = new Uint8Array(buffer, 0, 0);

          const hex = "06";
          const bytes = toBuffer(hex);
          const appended = coder.append(binary, bytes);

          const appendedHex = "06";
          const appendedBinary = toBuffer(appendedHex);
          expect(appended).to.deep.equals(appendedBinary);

          const bufferHex = "06".padEnd(1 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(appended.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given filled buffer", () => {
        it("should returns appended binary", () => {
          const buffer = new ArrayBuffer(0);
          const binary = new Uint8Array(buffer, 0, 0);

          const hex = "010203";
          const bytes = toBuffer(hex);
          const appended = coder.append(binary, bytes);

          const appendedHex = "010203";
          const appendedBinary = toBuffer(appendedHex);
          expect(appended).to.deep.equals(appendedBinary);

          const bufferHex = "010203".padEnd(4 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(appended.buffer)).to.deep.equals(bufferBinary);
        });
      });
    });
  });
});
