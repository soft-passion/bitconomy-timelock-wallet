import React, { useState, useEffect } from "react";
import { Card, Button, Flex, Box, Text, Heading, Form, Icon } from "rimble-ui";
import TimeLockedWallet from '../contracts/TimeLockedWallet.json'
import { toBuffer } from "ethereumjs-util";
import abi from "ethereumjs-abi";
import events from "events";
// import { ContractForm } from "@drizzle/react-components";
import { newContextComponents } from "@drizzle/react-components";
const { AccountData, ContractData, ContractForm } = newContextComponents;

function WalletCard({

  drizzle,
  drizzleState,
  contractAddress,
  // preflightCheck,
  // enableBuyButton
}) {
  const web3 = drizzle.web3;
  console.log(contractAddress, 'contractAddress');
  const [walletContract, setWalletContract] = useState(null)
  const [balance, setBalanace] = useState("0")
  const contractName = TimeLockedWallet.contractName
  const [contractData, setContractData] = useState({})

  const addNewContract = (newAddress) => {
    console.log(newAddress, 'newAddress');
    if (newAddress) {
      let web3Contract = new drizzle.web3.eth.Contract(TimeLockedWallet.abi, newAddress) //second argument is new contract's address 

      let contractConfig = { contractName, web3Contract }
      let events = ["Received", "Withdrew", "WithdrewTokens"]

      // Using the Drizzle context object
      drizzle.addContract(contractConfig, events)
      console.log(drizzle, 'add contract drizzle');
    }

  }
  const getWalletContract = (newAddress) => {
    if (newAddress) {
      return new drizzle.web3.eth.Contract(TimeLockedWallet.abi, newAddress) //second argument is new contract's address 


    } else { return false }

  }






  const info = async () => {
    const contract = getWalletContract(contractAddress)
    if (contract) {
      const data = await contract.methods.info().call();
      console.log(data[0], 'data');
      const result = {
        architect: data[0], owner: data[1], unlockDate: data[2], createdAt: data[3], ethAmount: data[4], tokenAmount: data[5]
      }
      return result;
    }

  }
  useEffect(() => {
    if (!walletContract) {
      setWalletContract(() => getWalletContract(contractAddress));
      console.log(walletContract, 'walletContractwalletContract');
      info().then(data => {
        setContractData(data)
      }, [])
    }

    if (!drizzle.contracts[contractName]) {
      addNewContract(contractAddress)
      console.log(drizzle, 'drizzle addNewContract');
    } else {
      console.log('hit');
    }

  });

 
  const getSignatureParameters = signature => {
    if (!web3.utils.isHexStrict(signature)) {
      throw new Error(
        'Given value "'.concat(signature, '" is not a valid hex string.')
      );
    }
    var r = signature.slice(0, 66);
    var s = "0x".concat(signature.slice(66, 130));
    var v = "0x".concat(signature.slice(130, 132));
    v = web3.utils.hexToNumber(v);
    if (![27, 28].includes(v)) v += 27;
    return {
      r: r,
      s: s,
      v: v
    };
  };
  const constructMetaTransactionMessage = (nonce, chainId, functionSignature, contractAddress) => {
    console.log(nonce, contractAddress, chainId, 'nonce, contractAddress, chainId');
    return abi.soliditySHA3(
      ["uint256", "address", "uint256", "bytes"],
      [nonce, contractAddress, chainId, toBuffer(functionSignature)]
    );
  }

  const executeMetaTransaciton = async (userAddress, functionSignature, contract, contractAddress, chainId) => {
    var eventEmitter = new events.EventEmitter();

    if (contract && userAddress && functionSignature, chainId, contractAddress) {
      let nonce = await contract.methods.getNonce(userAddress).call();
      let messageToSign = constructMetaTransactionMessage(nonce, chainId, functionSignature, contractAddress);

      const signature = await web3.eth.personal.sign(
        "0x" + messageToSign.toString("hex"),
        userAddress
      );

      console.info(`User signature is ${signature}`);
      let { r, s, v } = getSignatureParameters(signature);

      console.log("before transaction listener");
      // No need to calculate gas limit or gas price here
      let transactionListener = contract.methods.executeMetaTransaction(userAddress, functionSignature, r, s, v).send({
        from: userAddress
      });

      transactionListener.on("transactionHash", (hash) => {
        eventEmitter.emit("transactionHash", hash);
      }).once("confirmation", (confirmation, recipet) => {
        eventEmitter.emit("confirmation", confirmation, recipet);
      }).on("error", error => {
        eventEmitter.emit("error", error);
      });

      return eventEmitter;
    } else {
      console.log("All params userAddress, functionSignature, chainId, contract address and contract object are mandatory");
    }
  }
  const claimEth = async () => {
    const selectedAddress = drizzleState.accounts[0];
    if (selectedAddress) {

      console.log("Sending meta transaction");
      let userAddress = selectedAddress;
      const contract = getWalletContract(contractAddress)
      let nonce = await contract.methods.getNonce(userAddress).call();
      let functionSignature = contract.methods.withdraw().encodeABI();

      //userAddress, functionSignature, contract, contractAddress, chainId)
      executeMetaTransaciton(userAddress, functionSignature, contract, contractAddress, 42);
      // let messageToSign = constructMetaTransactionMessage(nonce,  drizzleState.web3.networkId, functionSignature, contractAddress);
      // const signature = await web3.eth.personal.sign(
      //   "0x" + messageToSign.toString("hex"),
      //   userAddress
      // );

      // console.info(`User signature is ${signature}`);
      // let { r, s, v } = getSignatureParameters(signature);

      // //alert(userAddress, functionSignature, r, s, v);

      // sendTransaction(userAddress, functionSignature, r, s, v);

    } else {
      alert("Transaction confirmed");
    }

  };
  const claimToken = async () => {
    const selectedAddress = drizzleState.accounts[0];
    if (selectedAddress) {

      console.log("Sending meta transaction");
      let userAddress = selectedAddress;
      const contract = getWalletContract(contractAddress)
      let nonce = await contract.methods.getNonce(userAddress).call();
      let functionSignature = contract.methods.withdrawTokens().encodeABI();

      //userAddress, functionSignature, contract, contractAddress, chainId)
      executeMetaTransaciton(userAddress, functionSignature, contract, contractAddress, 42);
      // let messageToSign = constructMetaTransactionMessage(nonce,  drizzleState.web3.networkId, functionSignature, contractAddress);
      // const signature = await web3.eth.personal.sign(
      //   "0x" + messageToSign.toString("hex"),
      //   userAddress
      // );

      // console.info(`User signature is ${signature}`);
      // let { r, s, v } = getSignatureParameters(signature);

      // //alert(userAddress, functionSignature, r, s, v);

      // sendTransaction(userAddress, functionSignature, r, s, v);

    } else {
      alert("Transaction confirmed");
    }

  };
  const sendTransaction = async (userAddress, functionData, r, s, v) => {
    try {
      fetch(`https://api.biconomy.io/api/v2/meta-tx/native`, {
        method: "POST",
        headers: {
          "x-api-key": "IX3KAQLDZ.439490cf-7cbe-4cf5-8be5-c8ce1979aeee",
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          "to": contractAddress,
          "apiId": "11c72576-fc72-4c3c-9731-113641f7e76b",
          "params": [
            userAddress, functionData, r, s, v
          ],
          "from": userAddress
        })
      })
        .then(response => response.json())
        .then(function (result) {
          console.log({ result });
          alert(`Transaction sent by relayer with hash ${result.txHash}`);

        })
        .catch(function (error) {
          console.log(error, 'error')
        });
    } catch (error) {
      console.log(error);
    }

  };

  return (
    <Box width={[5, 10, 1]} p={2}>
      {drizzle.contracts[contractName] && (
        <Card p={3} borderColor={"#d6d6d6"}>
          <Flex>
            {Date.now() >= contractData.unlockDate * 1000 && (<Icon name={"LockOpen"} size={"20px"} mr={3} color={"primary"} />
            )}
            {Date.now() < contractData.unlockDate * 1000 && (<Icon name={"Lock"} size={"20px"} mr={3} color={"primary"} />
            )}
            <Heading as={"h3"}>Your wallet Details</Heading>
          </Flex>

          <Flex justifyContent={"space-between"}>
            <Text color={"#aaa"}>~ ETH Amount</Text>{" "}
            <Text color={"#aaa"}> {contractData.ethAmount}</Text>{" "}

          </Flex>
          <Flex justifyContent={"space-between"}>
            <Text color={"#aaa"}>~ Owner Address</Text>{" "}
            <Text color={"#aaa"}> {contractData.owner}</Text>{" "}

          </Flex>
          <Flex justifyContent={"space-between"} mb={2}>
            <Text color={"#aaa"}>Token Amount</Text>{" "}
            <Text color={"#aaa"}> {contractData.tokenAmount}</Text>{" "}

          </Flex>
          <Flex justifyContent={"space-between"} mb={2}>
            <Flex>
              <Icon name={"AccessTime"} size={"20px"} mr={3} color={"primary"} />

              <Text color={"#aaa"}>Release Time</Text>{" "}
            </Flex>
            <Text color={"#aaa"}> {new Date(contractData.unlockDate * 1000).toLocaleString()}</Text>{" "}

          </Flex>
          <Flex justifyContent={"space-between"}>
            <Button

              // disabled={Date.now() < contractData.unlockDate * 1000}
              onClick={e => claimEth(e)}
            >
              Claim Eth
                 </Button>
            <Button
              disabled={Date.now() < contractData.unlockDate * 1000}
              onClick={e => claimToken(e)}
            >
              Claim Token
                 </Button>
          </Flex>


        </Card>
      )}  </Box>);
}

export default WalletCard;
