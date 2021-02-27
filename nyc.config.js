module.exports = {
  exclude: ["**/*.spec.ts", "**/*.spec-helper.ts"],
  extends: "@istanbuljs/nyc-config-typescript",
  reporter: ["html", "lcov", "text"],
};
