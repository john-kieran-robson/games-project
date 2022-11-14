const devData = require("../data/development-data/index.js");
const seed = require("./seeds.js");
const db = require("../connection.js");

const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();
