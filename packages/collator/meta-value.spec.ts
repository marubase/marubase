import { expect } from "chai";
import { MetaValue } from "./meta-value";

describe("MetaValue", () => {
  describe(".create(value, asc)", () => {
    context("when given value", () => {
      it("should returns meta value", () => {
        const value = false;
        const meta = MetaValue.create(value, true);
        expect(meta.value).to.be.false;
        expect(meta.asc).to.be.true;
        expect(meta.type).to.equals("boolean");
      });
    });
    context("when given meta value", () => {
      it("should returns meta value", () => {
        const value = new MetaValue(false, true);
        const meta = MetaValue.create(value, true);
        expect(meta.value).to.be.false;
        expect(meta.asc).to.be.true;
        expect(meta.type).to.equals("boolean");
      });
    });
  });

  describe("#constructor(value, asc)", () => {
    context("when initilized with null", () => {
      it("should set the correct property value", () => {
        const key = new MetaValue(null, false);
        expect(key.value).to.be.null;
        expect(key.asc).to.be.false;
        expect(key.type).to.equals("null");
      });
    });

    context("when initilized with boolean", () => {
      it("should set the correct property value", () => {
        const key = new MetaValue(false, true);
        expect(key.value).to.be.false;
        expect(key.asc).to.be.true;
        expect(key.type).to.equals("boolean");
      });
    });

    context("when initilized with number", () => {
      it("should set the correct property value", () => {
        const key = new MetaValue(0, false);
        expect(key.value).to.equals(0);
        expect(key.asc).to.be.false;
        expect(key.type).to.equals("number");
      });
    });

    context("when initilized with date", () => {
      it("should set the correct property value", () => {
        const key = new MetaValue(new Date(), true);
        expect(key.value).to.be.an.instanceOf(Date);
        expect(key.asc).to.be.true;
        expect(key.type).to.equals("date");
      });
    });

    context("when initilized with buffer", () => {
      it("should set the correct property value", () => {
        const key = new MetaValue(new Uint8Array(8), false);
        expect(key.value).to.be.an.instanceOf(Uint8Array);
        expect(key.asc).to.be.false;
        expect(key.type).to.equals("buffer");
      });
    });

    context("when initilized with string", () => {
      it("should set the correct property value", () => {
        const key = new MetaValue("test", true);
        expect(key.value).to.equals("test");
        expect(key.asc).to.be.true;
        expect(key.type).to.equals("string");
      });
    });

    context("when initilized with array", () => {
      it("should set the correct property value", () => {
        const key = new MetaValue([], false);
        expect(key.value).to.deep.equals([]);
        expect(key.asc).to.be.false;
        expect(key.type).to.equals("array");
      });
    });

    context("when initilized with object", () => {
      it("should set the correct property value", () => {
        const key = new MetaValue({}, true);
        expect(key.value).to.deep.equals({});
        expect(key.asc).to.be.true;
        expect(key.type).to.equals("object");
      });
    });

    context("when initilized with undefined", () => {
      it("should set the correct property value", () => {
        const key = new MetaValue(undefined, false);
        expect(key.value).to.undefined;
        expect(key.asc).to.be.false;
        expect(key.type).to.equals("undefined");
      });
    });
  });
});
