/* eslint-disable @typescript-eslint/no-var-requires */
const bytewise = require("bytewise");
const charwise = require("charwise");
const collator = require("..").default;

function benchmark(processFn: () => void): number {
  let iteration = 0;
  const start = process.hrtime.bigint();
  while (process.hrtime.bigint() - start <= BigInt(1 * 1000 * 1000 * 1000)) {
    processFn();
    iteration += 1;
  }
  return iteration;
}

const value = [
  ["database", "table"],
  ["composite", "key"],
];

const encodedValue = {
  bytewise: Buffer.from(
    "a0a070646174616261736500707461626c650000a070636f6d706f7369746500706b6579000000",
    "hex"
  ),
  charwise: 'KKJdatabase"Jtable!"KJcomposite"Jkey!!',
  collator: Buffer.from(
    "0e0e0d6461746162617365027c0d7461626c6502017c0e0d636f6d706f73697465027c0d6b6579020101",
    "hex"
  ),
};

const summary = {
  encoding: [
    { name: "bytewise", first: 0, second: 0, third: 0, average: 0, ratio: 0 },
    { name: "charwise", first: 0, second: 0, third: 0, average: 0, ratio: 0 },
    { name: "collator", first: 0, second: 0, third: 0, average: 0, ratio: 0 },
  ],
  decoding: [
    { name: "bytewise", first: 0, second: 0, third: 0, average: 0, ratio: 0 },
    { name: "charwise", first: 0, second: 0, third: 0, average: 0, ratio: 0 },
    { name: "collator", first: 0, second: 0, third: 0, average: 0, ratio: 0 },
  ],
};

console.info("bytewise.encode #1 benchmarking...");
summary.encoding[0].first = benchmark(() => bytewise.encode(value));
console.info("bytewise.encode #2 benchmarking...");
summary.encoding[0].second = benchmark(() => bytewise.encode(value));
console.info("bytewise.encode #3 benchmarking...");
summary.encoding[0].third = benchmark(() => bytewise.encode(value));
console.info("bytewise computing average");
summary.encoding[0].average = Math.round(
  (summary.encoding[0].first +
    summary.encoding[0].second +
    summary.encoding[0].third) /
    3
);
console.info("bytewise computing ratio");
summary.encoding[0].ratio =
  Math.round((summary.encoding[0].average / summary.encoding[0].average) * 10) /
  10;
console.info();

console.info("charwise.encode #1 benchmarking...");
summary.encoding[1].first = benchmark(() => charwise.encode(value));
console.info("charwise.encode #2 benchmarking...");
summary.encoding[1].second = benchmark(() => charwise.encode(value));
console.info("charwise.encode #3 benchmarking...");
summary.encoding[1].third = benchmark(() => charwise.encode(value));
console.info("charwise computing average");
summary.encoding[1].average = Math.round(
  (summary.encoding[1].first +
    summary.encoding[1].second +
    summary.encoding[1].third) /
    3
);
console.info("charwise computing ratio");
summary.encoding[1].ratio =
  Math.round((summary.encoding[1].average / summary.encoding[0].average) * 10) /
  10;
console.info();

console.info("collator.encode #1 benchmarking...");
summary.encoding[2].first = benchmark(() => collator.encode(value));
console.info("collator.encode #2 benchmarking...");
summary.encoding[2].second = benchmark(() => collator.encode(value));
console.info("collator.encode #3 benchmarking...");
summary.encoding[2].third = benchmark(() => collator.encode(value));
console.info("collator computing average");
summary.encoding[2].average = Math.round(
  (summary.encoding[2].first +
    summary.encoding[2].second +
    summary.encoding[2].third) /
    3
);
console.info("collator computing ratio");
summary.encoding[2].ratio =
  Math.round((summary.encoding[2].average / summary.encoding[0].average) * 10) /
  10;
console.info();

console.info("bytewise.decode #1 benchmarking...");
summary.decoding[0].first = benchmark(() =>
  bytewise.decode(encodedValue.bytewise)
);
console.info("bytewise.decode #2 benchmarking...");
summary.decoding[0].second = benchmark(() =>
  bytewise.decode(encodedValue.bytewise)
);
console.info("bytewise.decode #3 benchmarking...");
summary.decoding[0].third = benchmark(() =>
  bytewise.decode(encodedValue.bytewise)
);
console.info("bytewise computing average");
summary.decoding[0].average = Math.round(
  (summary.decoding[0].first +
    summary.decoding[0].second +
    summary.decoding[0].third) /
    3
);
console.info("bytewise computing ratio");
summary.decoding[0].ratio =
  Math.round((summary.decoding[0].average / summary.decoding[0].average) * 10) /
  10;
console.info();

console.info("charwise.decode #1 benchmarking...");
summary.decoding[1].first = benchmark(() =>
  charwise.decode(encodedValue.charwise)
);
console.info("charwise.decode #2 benchmarking...");
summary.decoding[1].second = benchmark(() =>
  charwise.decode(encodedValue.charwise)
);
console.info("charwise.decode #3 benchmarking...");
summary.decoding[1].third = benchmark(() =>
  charwise.decode(encodedValue.charwise)
);
console.info("charwise computing average");
summary.decoding[1].average = Math.round(
  (summary.decoding[1].first +
    summary.decoding[1].second +
    summary.decoding[1].third) /
    3
);
console.info("charwise computing ratio");
summary.decoding[1].ratio =
  Math.round((summary.decoding[1].average / summary.decoding[0].average) * 10) /
  10;
console.info();

console.info("collator.decode #1 benchmarking...");
summary.decoding[2].first = benchmark(() =>
  collator.decode(encodedValue.collator)
);
console.info("collator.decode #2 benchmarking...");
summary.decoding[2].second = benchmark(() =>
  collator.decode(encodedValue.collator)
);
console.info("collator.decode #3 benchmarking...");
summary.decoding[2].third = benchmark(() =>
  collator.decode(encodedValue.collator)
);
console.info("collator computing average");
summary.decoding[2].average = Math.round(
  (summary.decoding[2].first +
    summary.decoding[2].second +
    summary.decoding[2].third) /
    3
);
console.info("collator computing ratio");
summary.decoding[2].ratio =
  Math.round((summary.decoding[2].average / summary.decoding[0].average) * 10) /
  10;
console.info();

console.info("Encoding (Summary)");
console.table(summary.encoding);
console.info("Decoding (Summary)");
console.table(summary.decoding);
