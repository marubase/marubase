import { ValueContract } from "@marubase/contract";
import { expect } from "chai";
import { BooleanCoder } from "./boolean-coder";
import { BufferCoder } from "./buffer-coder";
import { CodeTable } from "./code-table";
import { ComplexCoder } from "./complex-coder";
import { DateCoder } from "./date-coder";
import { mirrorRun } from "./mirror-run.spec-helper";
import { NumberCoder } from "./number-coder";
import { StringCoder } from "./string-coder";

mirrorRun((asc, toBuffer, toMeta) => {
  describe(`ComplexCoder (${asc ? "asc" : "desc"})`, () => {
    let coder: ComplexCoder;
    beforeEach(() => {
      coder = new ComplexCoder(CodeTable);
      coder.regiser(BooleanCoder.service);
      coder.regiser(NumberCoder.service);
      coder.regiser(DateCoder.service);
      coder.regiser(BufferCoder.service);
      coder.regiser(StringCoder.service);
    });

    describe("#decodable(binary)", () => {
      context("when given [] binary", () => {
        it("should returns true", () => {
          const hex = "0e01";
          const binary = toBuffer(hex);
          const decodable = coder.decodable(binary);
          expect(decodable).to.be.true;
        });
      });
      context("when given {} binary", () => {
        it("should returns true", () => {
          const hex = "0f00";
          const binary = toBuffer(hex);
          const decodable = coder.decodable(binary);
          expect(decodable).to.be.true;
        });
      });
      context("when given null binary", () => {
        it("should returns true", () => {
          const hex = "04";
          const binary = toBuffer(hex);
          const decodable = coder.decodable(binary);
          expect(decodable).to.be.true;
        });
      });
      context("when given undefined binary", () => {
        it("should returns true", () => {
          const hex = "10";
          const binary = toBuffer(hex);
          const decodable = coder.decodable(binary);
          expect(decodable).to.be.true;
        });
      });
      context("when given false binary", () => {
        it("should returns false", () => {
          const hex = "05";
          const binary = toBuffer(hex);
          const decodable = coder.decodable(binary);
          expect(decodable).to.be.false;
        });
      });
    });

    describe("#decode(binary)", () => {
      context("when given [] binary", () => {
        it("should returns [] value", () => {
          const hex = "0e01";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);

          const decodedValue: ValueContract = [];
          expect(decoded).to.deep.equals(decodedValue);
        });
      });
      context("when given [false] binary", () => {
        it("should returns [false] value", () => {
          const hex = "0e0501";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);

          const decodedValue = [false];
          expect(decoded).to.deep.equals(decodedValue);
        });
      });
      context("when given [false, true] binary", () => {
        it("should returns [false, true] value", () => {
          const hex = "0e057c0601";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);

          const decodedValue = [false, true];
          expect(decoded).to.deep.equals(decodedValue);
        });
      });
      context("when given [[false, true],[false, true]] binary", () => {
        it("should returns [[false, true],[false, true]] value", () => {
          const hex = "0e0e057c06017c0e057c060101";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);

          const decodedValue = [
            [false, true],
            [false, true],
          ];
          expect(decoded).to.deep.equals(decodedValue);
        });
      });
      context("when given {} binary", () => {
        it("should returns {} value", () => {
          const hex = "0f00";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);

          const decodedValue = {};
          expect(decoded).to.deep.equals(decodedValue);
        });
      });
      context("when given {a:false} binary", () => {
        it("should returns {a:false} value", () => {
          const hex = "0f0d61027d0500";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);

          const decodedValue = { a: false };
          expect(decoded).to.deep.equals(decodedValue);
        });
      });
      context("when given {a:false,b:true} binary", () => {
        it("should returns {a:false,b:true} value", () => {
          const hex = "0f0d61027d057e0d62027d0600";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);

          const decodedValue = { a: false, b: true };
          expect(decoded).to.deep.equals(decodedValue);
        });
      });
      context(
        "when given {a:{a:false,b:true},b:{a:false,b:true}} binary",
        () => {
          it("should returns {a:{a:false,b:true},b:{a:false,b:true}} value", () => {
            const hex =
              "0f0d61027d0f0d61027d057e0d62027d06007e0d62027d0f0d61027d057e0d62027d060000";
            const binary = toBuffer(hex);
            const decoded = coder.decode(binary);

            const decodedValue = {
              a: { a: false, b: true },
              b: { a: false, b: true },
            };
            expect(decoded).to.deep.equals(decodedValue);
          });
        }
      );
      context("when given [{a:false,b:true},{a:false,b:true}] binary", () => {
        it("should returns [{a:false,b:true},{a:false,b:true}] value", () => {
          const hex =
            "0e0f0d61027d057e0d62027d06007c0f0d61027d057e0d62027d060001";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);

          const decodedValue = [
            { a: false, b: true },
            { a: false, b: true },
          ];
          expect(decoded).to.deep.equals(decodedValue);
        });
      });
      context("when given {a:[false,true],b:[false,true]} binary", () => {
        it("should returns {a:[false,true],b:[false,true]} value", () => {
          const hex = "0f0d61027d0e057c06017e0d62027d0e057c060100";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);

          const decodedValue = {
            a: [false, true],
            b: [false, true],
          };
          expect(decoded).to.deep.equals(decodedValue);
        });
      });
      context("when given null binary", () => {
        it("should returns null value", () => {
          const hex = "04";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);
          expect(decoded).to.be.null;
        });
      });
      context("when given undefined binary", () => {
        it("should returns undefined value", () => {
          const hex = "10";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);
          expect(decoded).to.be.undefined;
        });
      });
      context("when given false binary", () => {
        it("should returns false value", () => {
          const hex = "05";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);
          expect(decoded).to.be.false;
        });
      });
    });

    describe("#encodable(meta)", () => {
      context("when given [] value", () => {
        it("should returns true", () => {
          const value: ValueContract = [];
          const meta = toMeta(value);
          const encodable = coder.encodable(meta);
          expect(encodable).to.be.true;
        });
      });
      context("when given {} value", () => {
        it("should returns true", () => {
          const value = {};
          const meta = toMeta(value);
          const encodable = coder.encodable(meta);
          expect(encodable).to.be.true;
        });
      });
      context("when given null value", () => {
        it("should returns true", () => {
          const value = null;
          const meta = toMeta(value);
          const encodable = coder.encodable(meta);
          expect(encodable).to.be.true;
        });
      });
      context("when given undefined value", () => {
        it("should returns true", () => {
          const value = undefined;
          const meta = toMeta(value);
          const encodable = coder.encodable(meta);
          expect(encodable).to.be.true;
        });
      });
      context("when given false value", () => {
        it("should returns false", () => {
          const value = false;
          const meta = toMeta(value);
          const encodable = coder.encodable(meta);
          expect(encodable).to.be.false;
        });
      });
    });

    describe("#encode(binary, meta)", () => {
      context("when given [] value", () => {
        it("should returns [] binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value: ValueContract = [];
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "0e01";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(8 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given [false] value", () => {
        it("should returns [false] binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = [false];
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "0e0501";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(8 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given [false, true] value", () => {
        it("should returns [false, true] binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = [false, true];
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "0e057c0601";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(8 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given [[false, true],[false, true]] value", () => {
        it("should returns [[false, true],[false, true]] binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = [
            [false, true],
            [false, true],
          ];
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "0e0e057c06017c0e057c060101";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(16 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given {} value", () => {
        it("should returns {} binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = {};
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "0f00";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(8 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given {a:false} value", () => {
        it("should returns {a:false} binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = { a: false };
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "0f0d61027d0500";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(8 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given {a:false,b:true} value", () => {
        it("should returns {a:false,b:true} binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = { a: false, b: true };
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "0f0d61027d057e0d62027d0600";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(16 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context(
        "when given {a:{a:false,b:true},b:{a:false,b:true}} value",
        () => {
          it("should returns {a:{a:false,b:true},b:{a:false,b:true}} binary", () => {
            const buffer = new ArrayBuffer(8);
            const binary = new Uint8Array(buffer, 0, 0);

            const value = {
              a: { a: false, b: true },
              b: { a: false, b: true },
            };
            const meta = toMeta(value);
            const encoded = coder.encode(binary, meta);

            const encodedHex =
              "0f0d61027d0f0d61027d057e0d62027d06007e0d62027d0f0d61027d057e0d62027d060000";
            const encodedBinary = toBuffer(encodedHex);
            expect(encoded).to.deep.equals(encodedBinary);

            const bufferHex = encodedHex.padEnd(64 * 2, asc ? "0" : "f");
            const bufferBinary = toBuffer(bufferHex);
            expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
          });
        }
      );
      context("when given [{a:false,b:true},{a:false,b:true}] value", () => {
        it("should returns [{a:false,b:true},{a:false,b:true}] binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = [
            { a: false, b: true },
            { a: false, b: true },
          ];
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex =
            "0e0f0d61027d057e0d62027d06007c0f0d61027d057e0d62027d060001";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(32 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given {a:[false,true],b:[false,true]} value", () => {
        it("should returns {a:[false,true],b:[false,true]} binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = {
            a: [false, true],
            b: [false, true],
          };
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "0f0d61027d0e057c06017e0d62027d0e057c060100";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(32 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given null value", () => {
        it("should returns null binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = null;
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "04";
          const encodedBinary = toBuffer(encodedHex);
          expect(encoded).to.deep.equals(encodedBinary);

          const bufferHex = encodedHex.padEnd(8 * 2, asc ? "0" : "f");
          const bufferBinary = toBuffer(bufferHex);
          expect(new Uint8Array(encoded.buffer)).to.deep.equals(bufferBinary);
        });
      });
      context("when given undefined value", () => {
        it("should returns undefined binary", () => {
          const buffer = new ArrayBuffer(8);
          const binary = new Uint8Array(buffer, 0, 0);

          const value = undefined;
          const meta = toMeta(value);
          const encoded = coder.encode(binary, meta);

          const encodedHex = "10";
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
