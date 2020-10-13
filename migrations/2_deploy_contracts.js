 const BasicMetaTransaction = artifacts.require("BasicMetaTransaction");
 const TimeLockedWalletFactory = artifacts.require("TimeLockedWalletFactory");
 const BiToken = artifacts.require("BiToken");
 
module.exports = async(deployer)=> {
  const meta= await deployer.deploy(BasicMetaTransaction);
  const walletFactory= await deployer.deploy(TimeLockedWalletFactory,BasicMetaTransaction.address);
     let totalSupply = "10000000000000000000000000000";
  
     const token= await  deployer.deploy(BiToken, "Gasless Token", "BCNMY", totalSupply);
  };
