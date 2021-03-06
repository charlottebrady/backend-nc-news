const ENV = process.env.NODE_ENV || "development";

const developmentData = require("./development-data");
const testData = require("./test-data");

const data = {
  development: developmentData,
  test: testData,
  production: developmentData,
};

module.exports = data[ENV];
