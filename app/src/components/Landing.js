import React, { useState, useEffect } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
 import ConnectionBanner from "@rimble/connection-banner";
import { Box, Flex, Text, Link ,Button} from "rimble-ui";
 import appConfig from "../appConfig";
 import WalletCard from "./walletCard";
 import DepositModal from "./deposit";

function Landing({ drizzle, drizzleState, drizzleStatus, account,
  address, networkId }) {
  const [currentNetwork, setCurrentNetwork] = useState(null);
  // const [address, setAddress] = useState(null);
  const [wallets, setWallets] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false)
  console.log(drizzle, 'drizzle');
  // Set account
  // useEffect(() => {
  //   if (account) {
  //     setAddress(account);
  //   }
  // }, [account]);
  useEffect(() => {
    if (drizzleStatus.initialized) {
      getUserWallets(address).then(wallet=>{
        console.log(wallet,'effect wallet');
        setWallets(wallet);
      })
     
    }
  },wallets);
  const getUserWallets = async (address) => {
console.log(address,'address');
    const wallets = await drizzle.contracts.TimeLockedWalletFactory.methods.getWallets(address).call();
    console.log(wallets, 'wallets get');
    return wallets;
  }
  // Set current network
  useEffect(() => {
    if (networkId) {
      setCurrentNetwork(networkId);
    }  
    if (!drizzleStatus.initialized && window.web3 && drizzle !== null) {
      window.web3.version.getNetwork((error, networkId) => {
        setCurrentNetwork(parseInt(networkId));
      });
    }
  }, [networkId, drizzleStatus, drizzle]);
  const emptyUserWallet = () => {
    console.log(drizzleStatus.initialized,'drizzle.contracts.TimeLockedWalletFactory');
    console.log(drizzle.contracts.TimeLockedWalletFactory,'drizzle.contracts.TimeLockedWalletFactory');
    return drizzleStatus.initialized ;
  }
  const toggleModal =()=>{
console.log('it toogle');
setShowDepositModal(!showDepositModal)
  }
  return (
    <Box>
    {!drizzleState && (
      <Box m={4}>
        <ConnectionBanner
          currentNetwork={currentNetwork}
          requiredNetwork={appConfig.requiredNetwork}
          onWeb3Fallback={null}
        />
      </Box>
    )}
    <Box maxWidth={"1180px"} p={3} mx={"auto"}>
      <Text my={4} />
      <Flex justifyContent={"space-between"} mx={-3} flexWrap={"wrap"}>
      {emptyUserWallet() && (
      <Box maxWidth={"1180px"} p={3} mx={"auto"}>
        <Text my={4} />
        <Flex justifyContent={"space-between"} mx={-3} flexWrap={"wrap"}>
      {/* let user create new wallet here  */}
      <Button onClick={toggleModal}>Create Wallet</Button>

      <DepositModal isOpen={showDepositModal} toggleModal={toggleModal} drizzle={drizzle} address={address} drizzleState={drizzleState}/>
           
         {  /*display current wallet here  */}

        </Flex>
      
      </Box>
      )}

      </Flex>
       </Box>
    <Box maxWidth={"1180px"} p={3} mx={"auto"}>
      <Text my={4} />
      <Flex justifyContent={"space-between"} mx={-3} flexWrap={"wrap"}>
        {wallets&&(wallets.map(wallet => {
          return (
            <WalletCard
                contractAddress={wallet}
                drizzleState={drizzleState}
               drizzle={drizzle}
              key={wallet}
            />
          );
        }))}
      </Flex>
       </Box>
       <Flex justifyContent={"flex-end"}>
          <Link href="https://biconomy.io/" target="_blank">
            Learn more about biconomy
          </Link>
        </Flex>
  </Box>
);

 
}

/*
 * Export connected component.
 */
const mapStateToProps = state => {
  return {
    drizzleStatus: state.drizzleStatus,
    address: state.accounts[0],
    networkId: state.web3.networkId
  };
};

export default drizzleConnect(Landing, mapStateToProps);
