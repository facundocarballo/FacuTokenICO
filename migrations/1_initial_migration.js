const FacuToken = artifacts.require("./facuTokenICO/FacuToken");
const FacuTokenSale = artifacts.require("./facuTokenICO/FacuTokenSale");

module.exports = function (deployer) {
  deployer.deploy(FacuToken).then(() => {
    deployer.deploy(FacuTokenSale, FacuToken.address);
  });
  // If this code doesn't work, to deploy the contract token sale
  // we have to copy the contract tokenn address and paste here
  // deployer.deploy(FacuTokenSale, "0xBC0484Ab69982738BcD5FA45947Fc9203551bB7c");
};