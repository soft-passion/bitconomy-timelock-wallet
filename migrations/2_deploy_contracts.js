 const TimeLockedWalletFactory = artifacts.require("TimeLockedWalletFactory");
 const BiToken = artifacts.require("BiToken");
 
module.exports = function(deployer) {
  deployer.deploy(TimeLockedWalletFactory);
     let totalSupply = "10000000000000000000000000000";
  
    deployer.deploy(BiToken, "Gasless Token", "BCNMY", totalSupply);
  };
