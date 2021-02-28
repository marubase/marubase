module.exports = {
  extension: ["js", "jsx", "ts", "tsx"],
  reporter: process.env.NODE_ENV !== "test" ? ["spec"] : ["min"],
  require: ["ts-node/register", "source-map-support/register"],
};
