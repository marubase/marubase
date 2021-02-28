import { CollatorContract } from "@marubase/contract";
import { expect } from "chai";
import { BooleanCoder } from "./boolean-coder";
import { BufferCoder } from "./buffer-coder";
import { CodeTable } from "./code-table";
import { Collator } from "./collator";
import { ComplexCoder } from "./complex-coder";
import { DateCoder } from "./date-coder";
import { NumberCoder } from "./number-coder";
import { StringCoder } from "./string-coder";

describe("Collator", () => {
  let collator: CollatorContract;
  beforeEach(() => {
    const complex = new ComplexCoder(CodeTable);
    complex.register(BooleanCoder.service);
    complex.register(NumberCoder.service);
    complex.register(DateCoder.service);
    complex.register(BufferCoder.service);
    complex.register(StringCoder.service);

    collator = new Collator(complex);
  });

  describe("#decode(binary)", () => {
    it("should returns key value", () => {
      const binary = new Uint8Array([14, 5, 1]);
      const decoded = collator.decode(binary);
      expect(decoded).to.deep.equals([false]);
    });
  });

  describe("#encode(value)", () => {
    it("should returns key value", () => {
      const value = [false];
      const encoded = collator.encode(value);
      expect(encoded).to.deep.equals(new Uint8Array([14, 5, 1]));
    });
  });

  describe("#order", () => {
    describe("#asc(value)", () => {
      it("should returns meta value", () => {
        const value = false;
        const meta = collator.order.asc(value);
        expect(meta.type).to.equals("boolean");
        expect(meta.value).to.be.false;
        expect(meta.asc).to.be.true;
      });
    });
    describe("#desc(value)", () => {
      it("should returns meta value", () => {
        const value = false;
        const meta = collator.order.desc(value);
        expect(meta.type).to.equals("boolean");
        expect(meta.value).to.be.false;
        expect(meta.asc).to.be.false;
      });
    });
  });
});
