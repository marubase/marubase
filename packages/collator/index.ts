import { BooleanCoder } from "./boolean-coder";
import { BufferCoder } from "./buffer-coder";
import { CodeTable } from "./code-table";
import { Collator } from "./collator";
import { ComplexCoder } from "./complex-coder";
import { DateCoder } from "./date-coder";
import { NumberCoder } from "./number-coder";
import { StringCoder } from "./string-coder";

const complex = new ComplexCoder(CodeTable);
complex.register(BooleanCoder.service);
complex.register(NumberCoder.service);
complex.register(DateCoder.service);
complex.register(BufferCoder.service);
complex.register(StringCoder.service);

export default new Collator(complex);
export * from "./base-coder";
export * from "./boolean-coder";
export * from "./buffer-coder";
export * from "./code-table";
export * from "./coder.interface";
export * from "./collator";
export * from "./complex-coder";
export * from "./date-coder";
export * from "./meta-value";
export * from "./number-coder";
export * from "./string-coder";
