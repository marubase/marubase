import { expect } from "chai";
import { CodeTable } from "./code-table";
import { CoderInterface } from "./coder.interface";
import { DateCoder } from "./date-coder";
import { mirrorRun } from "./mirror-run.spec-helper";

mirrorRun((asc, toBuffer, toMeta) => {
  describe(`DateCoder (${asc ? "asc" : "desc"})`, () => {
    let coder: CoderInterface;
    beforeEach(() => {
      coder = new DateCoder(CodeTable);
    });

    describe("#decodable(binary)", () => {
      context("when given positive date binary", () => {
        it("should returns true", () => {
          const hex = "0b3ff0000000000000";
          const binary = toBuffer(hex);
          const decodable = coder.decodable(binary);
          expect(decodable).to.be.true;
        });
      });
      context("when given negative date binary", () => {
        it("should returns true", () => {
          const hex = "0ac00fffffffffffff";
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
      context("when given positive date binary", () => {
        it("should returns date value", () => {
          const hex = "0b3ff0000000000000";
          const binary = toBuffer(hex);
          const decodable = coder.decode(binary);
          expect(decodable).to.instanceOf(Date);
        });
      });
      context("when given negative date binary", () => {
        it("should returns date value", () => {
          const hex = "0ac00fffffffffffff";
          const binary = toBuffer(hex);
          const decodable = coder.decode(binary);
          expect(decodable).to.instanceOf(Date);
        });
      });
    });

    describe("#encodable(meta)", () => {
      context("when given positive date value", () => {
        it("should returns true", () => {
          const value = new Date(-1);
          const meta = toMeta(value);
          const encodable = coder.encodable(meta);
          expect(encodable).to.be.true;
        });
      });
      context("when given negative date value", () => {
        it("should returns true", () => {
          const value = new Date(-1);
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
      context("when given positive date value", () => {
        it("should returns date binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = new Date(1);
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "0b3ff0000000000000";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(16 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given negative date value", () => {
        it("should returns date binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = new Date(-1);
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "0ac00fffffffffffff";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(16 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
    });
  });
});
