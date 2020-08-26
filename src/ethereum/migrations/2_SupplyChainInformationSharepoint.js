const SCInformationSharepoint = artifacts.require("SupplyChainInformationSharepoint");

module.exports = function (deployer) {
  deployer.deploy(SCInformationSharepoint);
};
