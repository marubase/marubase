import { expect } from "chai";
import { CodeTable } from "./code-table";
import { CoderInterface } from "./coder.interface";
import { mirrorRun } from "./mirror-run.helper";
import { NumberCoder } from "./number-coder";

mirrorRun((asc, toBuffer, toMeta) => {
  describe(`NumberCoder (${asc ? "asc" : "desc"})`, () => {
    let coder: CoderInterface;
    beforeEach(() => {
      coder = new NumberCoder(CodeTable);
    });

    describe("#decodable(binary)", () => {
      context("when given -Infinity binary", () => {
        it("should returns true", () => {
          const hex = "08800fffffffffffff";
          const binary = toBuffer(hex);
          const decodable = coder.decodable(binary);
          expect(decodable).to.be.true;
        });
      });
      context("when given -Math.PI binary", () => {
        it("should returns true", () => {
          const hex = "08bff6de04abbbd2e7";
          const binary = toBuffer(hex);
          const decodable = coder.decodable(binary);
          expect(decodable).to.be.true;
        });
      });
      context("when given 0 binary", () => {
        it("should returns true", () => {
          const hex = "090000000000000000";
          const binary = toBuffer(hex);
          const decodable = coder.decodable(binary);
          expect(decodable).to.be.true;
        });
      });
      context("when given Math.PI binary", () => {
        it("should returns true", () => {
          const hex = "09400921fb54442d18";
          const binary = toBuffer(hex);
          const decodable = coder.decodable(binary);
          expect(decodable).to.be.true;
        });
      });
      context("when given Infinity binary", () => {
        it("should returns true", () => {
          const hex = "097ff0000000000000";
          const binary = toBuffer(hex);
          const decodable = coder.decodable(binary);
          expect(decodable).to.be.true;
        });
      });
      context("when given NaN binary", () => {
        it("should returns true", () => {
          const hex = "070000000000000000";
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
      context("when given -Infinity binary", () => {
        it("should returns -Infinity value", () => {
          const hex = "08800fffffffffffff";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);
          expect(decoded).to.equals(-Infinity);
        });
      });
      context("when given -Math.PI binary", () => {
        it("should returns -Math.PI value", () => {
          const hex = "08bff6de04abbbd2e7";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);
          expect(decoded).to.equals(-Math.PI);
        });
      });
      context("when given 0 binary", () => {
        it("should returns 0 value", () => {
          const hex = "090000000000000000";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);
          expect(decoded).to.equals(0);
        });
      });
      context("when given Math.PI binary", () => {
        it("should returns Math.PI value", () => {
          const hex = "09400921fb54442d18";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);
          expect(decoded).to.equals(Math.PI);
        });
      });
      context("when given Infinity binary", () => {
        it("should returns Infinity value", () => {
          const hex = "097ff0000000000000";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);
          expect(decoded).to.equals(Infinity);
        });
      });
      context("when given NaN binary", () => {
        it("should returns NaN value", () => {
          const hex = "070000000000000000";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);
          expect(decoded).to.be.NaN;
        });
      });
    });

    describe("#encodable(meta)", () => {
      context("when given -Infinity value", () => {
        it("should returns true", () => {
          const value = -Infinity;
          const meta = toMeta(value);
          const encodable = coder.encodable(meta);
          expect(encodable).to.be.true;
        });
      });
      context("when given -Math.PI value", () => {
        it("should returns true", () => {
          const value = -Math.PI;
          const meta = toMeta(value);
          const encodable = coder.encodable(meta);
          expect(encodable).to.be.true;
        });
      });
      context("when given 0 value", () => {
        it("should returns true", () => {
          const value = 0;
          const meta = toMeta(value);
          const encodable = coder.encodable(meta);
          expect(encodable).to.be.true;
        });
      });
      context("when given Math.PI value", () => {
        it("should returns true", () => {
          const value = Math.PI;
          const meta = toMeta(value);
          const encodable = coder.encodable(meta);
          expect(encodable).to.be.true;
        });
      });
      context("when given -Infinity value", () => {
        it("should returns true", () => {
          const value = -Infinity;
          const meta = toMeta(value);
          const encodable = coder.encodable(meta);
          expect(encodable).to.be.true;
        });
      });
      context("when given NaN value", () => {
        it("should returns true", () => {
          const value = Number.NaN;
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
      context("when given -Infinity value", () => {
        it("should returns -Infinity binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = -Infinity;
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "08800fffffffffffff";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(16 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given -Math.PI value", () => {
        it("should returns -Math.PI binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = -Math.PI;
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "08bff6de04abbbd2e7";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(16 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given 0 value", () => {
        it("should returns 0 binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = 0;
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "090000000000000000";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(16 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given Math.PI value", () => {
        it("should returns Math.PI binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = Math.PI;
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "09400921fb54442d18";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(16 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given Infinity value", () => {
        it("should returns Infinity binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = Infinity;
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "097ff0000000000000";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(16 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given NaN value", () => {
        it("should returns NaN binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = Number.NaN;
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "070000000000000000";
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
