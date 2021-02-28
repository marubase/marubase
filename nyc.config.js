module.exports = {
  exclude: ["**/*.spec.ts", "**/*.spec-helper.ts"],
  extends: "@istanbuljs/nyc-config-typescript",
  reporter:
    process.env.NODE_ENV !== "test" ? ["html", "text"] : ["lcovonly", "text"],
};
