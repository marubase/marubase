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

    describe("#decodable(binary)", () => {
      context("when given buffer binary", () => {
        it("should returns true", () => {
          const hex = "0c7465737403";
          const binary = toBuffer(hex);
          const decodable = coder.decodable(binary);
          expect(decodable).to.be.true;
        });
      });
      context("when given null binary", () => {
        it("should returns false", () => {
          const hex = "04";
          const binary = toBuffer(hex);
          const decodable = coder.decodable(binary);
          expect(decodable).to.be.false;
        });
      });
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
    });

    describe("#encodable(meta)", () => {
      context("when given buffer value", () => {
        it("should returns true", () => {
          const value = new Uint8Array([116, 101, 115, 116]);
          const meta = toMeta(value);
          const encodable = coder.encodable(meta);
          expect(encodable).to.be.true;
        });
      });
      context("when given null value", () => {
        it("should returns false", () => {
          const value = null;
          const meta = toMeta(value);
          const encodable = coder.encodable(meta);
          expect(encodable).to.be.false;
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
    });
  });
});
