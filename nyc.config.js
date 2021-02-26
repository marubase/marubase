module.exports = {
  exclude: ["**/*.helper.ts", "**/*.spec.ts"],
  extends: "@istanbuljs/nyc-config-typescript",
  reporter: ["lcov", "text"],
  "report-dir": "./coverage/nodejs",
};
