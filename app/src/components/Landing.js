import React, { useState, useEffect } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import ConnectionBanner from "@rimble/connection-banner";
import { Box, Flex, Text, Link, Button, Icon } from "rimble-ui";
import appConfig from "../appConfig";
import WalletCard from "./walletCard";
import MintTokenModal from "./MintToken";
import DepositModal from "./deposit";
import TxLowBalanceModal from "../core/utilities/components/TxLowBalanceModal";

function Landing({ drizzle, drizzleState, drizzleStatus, account,
  address, networkId }) {
  const [currentNetwork, setCurrentNetwork] = useState(null);
  // const [address, setAddress] = useState(null);
  const [wallets, setWallets] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showGetEthModal, setShowGetEthModal] = useState(null);
  const [showGetTokenModal, setShowGetTokenModal] = useState(false)
  console.log(drizzle, 'drizzle');
  // Set account
  // useEffect(() => {
  //   if (account) {
  //     setAddress(account);
  //   }
  // }, [account]);
  useEffect(() => {
    if (drizzleStatus.initialized &&drizzle.contracts.TimeLockedWalletFactory ) {
      getUserWallets(address).then(wallet => {
        console.log(wallet, 'effect wallet');
        setWallets(wallet);
      })

    }
  }, wallets);
  const getUserWallets = async (address) => {
    console.log(address, 'address');
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
    console.log(drizzleStatus.initialized, 'drizzle.contracts.TimeLockedWalletFactory');
    console.log(drizzle.contracts.TimeLockedWalletFactory, 'drizzle.contracts.TimeLockedWalletFactory');
    return drizzleStatus.initialized;
  }
  const toggleModal = () => {
    console.log('it toggle');
    setShowDepositModal(!showDepositModal)
  }
  const toggleGetTokenModal = () => {
    console.log('it toggle');
    setShowGetTokenModal(!showGetTokenModal)
  }
  const toggleGetEthModal = () => {
    console.log('it toggle');
    setShowGetEthModal(!showGetEthModal)
  }
  return (
    <Box position = {"top"}>
      {!drizzleState && (
        <Box m={4}>
          <ConnectionBanner
            currentNetwork={currentNetwork}
            requiredNetwork={appConfig.requiredNetwork}
            onWeb3Fallback={null}
          />
        </Box>
      )}
      {emptyUserWallet() && (
        <Box maxWidth={"1180px"} p={3} mx={"auto"} my={"auto"}   width={[
          1, // 100% below the smallest breakpoint
          1 / 2, // 50% from the next breakpoint and up
          1 / 4, // 25% from the next breakpoint and up
        ]}>
          <Text my={4} />
          <Flex justifyContent={"space-between"} mx={-3} flexWrap={"wrap"} order={1}>
            {/* let user create new wallet here  */}
            <Button onClick={toggleModal}>Create Wallet</Button>

            <DepositModal isOpen={showDepositModal} toggleModal={toggleModal} drizzle={drizzle} address={address} drizzleState={drizzleState} />
            <TxLowBalanceModal isOpen={showGetEthModal} toggleModal={toggleGetEthModal} drizzle={drizzle} address={address} drizzleState={drizzleState} />
            <MintTokenModal isOpen={showGetTokenModal} toggleModal={toggleGetTokenModal} drizzle={drizzle} address={address} drizzleState={drizzleState} />

            {  /*display current wallet here  */}

          </Flex>

        </Box>
      )}
      <Box maxWidth={"1180px"} p={3} mx={"auto"}>
        <Text my={4} />
        <Flex justifyContent={"space-between"} mx={-3} flexWrap={"wrap"}>


        </Flex>
      </Box>
      <Box maxWidth={"1180px"} p={3} mx={"auto"}>
        <Text my={4} />
        <Flex justifyContent={"space-between"} mx={-3} flexWrap={"wrap"}>
          {wallets && (wallets.map(wallet => {
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
 
      <Flex justifyContent={"flex-start"}>
        <Flex onClick={()=>toggleGetEthModal()} p={3}>
          <Icon name={"Launch"} size={"20px"} mr={3} color={"primary"} />

          <Text color={"#aaa"}>Get Ether</Text>{" "}
        </Flex>
        <Flex onClick={()=>toggleGetTokenModal()} p={3}>
          <Icon name={"Launch"} size={"20px"} mr={3} color={"primary"} />

          <Text color={"#aaa"}>Get Tokens</Text>{" "}
        </Flex>
        <Flex justifyContent={"flex-end"} p={3}>
        <Link href="https://biconomy.io/" target="_blank">
          Learn more about biconomy
          </Link>
      </Flex>
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
