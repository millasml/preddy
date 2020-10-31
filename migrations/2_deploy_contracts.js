const MarketManager = artifacts.require("MarketManager");
const Market = artifacts.require("Market");

module.exports = function(deployer) {
  let reportWindow = 24 * 60 * 60
  deployer.deploy(MarketManager, reportWindow);
  // deployer.deploy(Market);
};
