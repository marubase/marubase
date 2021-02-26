// eslint-disable-next-line
const path = require("path");

module.exports = function (configuration) {
  configuration.set({
    autoWatch: false,
    browsers: ["Chromium", "Firefox", "WebKit"],
    files: [path.resolve(process.cwd(), "index.spec.ts")],
    frameworks: ["mocha"],
    plugins: [
      "karma-mocha",
      "karma-sourcemap-loader",
      "karma-webpack",
      require("./.karma/launcher"),
    ],
    preprocessors: { "**/*.spec.ts": ["webpack", "sourcemap"] },
    reporters: ["progress"],
    singleRun: true,
    webpack: {
      devtool: "inline-source-map",
      mode: "development",
      module: {
        rules: [{ exclude: /node_modules/, test: /.tsx?$/, use: "ts-loader" }],
      },
      resolve: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    },
    webpackMiddleware: { stats: "errors-only" },
  });
};
