module.exports = {
  exclude: ["**/*.helper.ts", "**/*.spec.ts"],
  extends: "@istanbuljs/nyc-config-typescript",
  reporter: ["html", "lcov", "text"],
};
