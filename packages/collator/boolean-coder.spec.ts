import { expect } from "chai";
import { BooleanCoder } from "./boolean-coder";
import { CodeTable } from "./code-table";
import { CoderInterface } from "./coder.interface";
import { mirrorRun } from "./mirror-run.helper";

mirrorRun((asc, toBuffer, toMeta) => {
  describe(`BooleanCoder (${asc ? "asc" : "desc"})`, () => {
    let coder: CoderInterface;
    beforeEach(() => {
      coder = new BooleanCoder(CodeTable);
    });

    describe("#decodable(binary)", () => {
      context("when given false binary", () => {
        it("should returns true", () => {
          const hex = "05";
          const binary = toBuffer(hex);
          const decodable = coder.decodable(binary);
          expect(decodable).to.be.true;
        });
      });
      context("when given true binary", () => {
        it("should returns true", () => {
          const hex = "06";
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
      context("when given false binary", () => {
        it("should returns false value", () => {
          const hex = "05";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);
          expect(decoded).to.be.false;
        });
      });
      context("when given true binary", () => {
        it("should returns true value", () => {
          const hex = "06";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);
          expect(decoded).to.be.true;
        });
      });
    });

    describe("#encodable(meta)", () => {
      context("when given false value", () => {
        it("should returns true", () => {
          const value = false;
          const meta = toMeta(value);
          const encodable = coder.encodable(meta);
          expect(encodable).to.be.true;
        });
      });
      context("when given true value", () => {
        it("should returns true", () => {
          const value = true;
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
      context("when given false value", () => {
        it("should returns false binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = false;
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "05";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(8 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given true value", () => {
        it("should returns true binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = true;
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "06";
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
