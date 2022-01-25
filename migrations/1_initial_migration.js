const Migrations = artifacts.require("Migrations");
const FacuToken = artifacts.require("FacuToken");
const FacuTokenSale = artifacts.require("FacuTokenSale");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(FacuToken).then(() => 
    deployer.deploy(FacuTokenSale, FacuToken.address)
  );
};
