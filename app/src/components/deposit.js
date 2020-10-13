import React, { useState } from "react";
import styled from "styled-components";
import { newContextComponents } from "@drizzle/react-components";
 
import {
  Box,
  Link,
  Icon,
  Button,
  Flex,
  Modal,
  Text,
  Heading,
  QR,
  Card,
  Form,
  Field,
  Input,
  Select,
  LocalSee
} from "rimble-ui";

const ModalFooter = styled(Flex)`
  border-top: 1px solid #ccc;
`;
const { AccountData, ContractData, ContractForm } = newContextComponents;

const CreateWalletPrep = ({
  toggleModal,drizzle,drizzleState,
   toggleShowBuyEth
}) => {
  return (
    <Box>
      <Flex justifyContent={"flex-end"}>
        <Link onClick={toggleModal} color={"#CCC"} p={3} title={"Close"}>
          <Icon name="Close"  onClick={toggleModal}/>
        </Link>
      </Flex>
      <Flex
        flexDirection={"column"}
        justifyContent={"space-between"}
        mx={5}
        mb={0}
      >
        <Heading.h3>Create new Wallet and Deposit your money there!</Heading.h3>
        <Text my={3}>
          Deposit some ether , tokens or even both. &mdash; specify the duration for lock    &mdash; you can claim your money after the release time 
         
        </Text>

        <Flex mt={3} mb={4}>
          <Icon name={"InfoOutline"} size={"32px"} mr={3} color={"primary"} />
          <Text>
            Every blockchain transaction has a fee – paid in ETH – to cover
            processing costs.
          </Text>
         
        </Flex>
        <Flex mt={3} mb={4}>
          <Icon name={"InfoOutline"} size={"32px"} mr={3} color={"primary"} />
          <Text>
            If you want to stake token, your current balance is
               <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="BiToken"
            method="balanceOf"
            methodArgs={[drizzleState.accounts[0]]}
          />
          </Text>
         
        </Flex>
        

        <Flex mt={3} mb={4}>
          <Icon name={"InfoOutline"} size={"32px"} mr={3} color={"primary"} />
        
          <Text>
            If you want to stake eth, your current balance is    <AccountData
          drizzle={drizzle}
          drizzleState={drizzleState}
          accountIndex={0}
          units="ether"
          precision={3}
        />
          </Text>
         
        </Flex>
        
      </Flex>
      <ModalFooter p={3} alignItems={"center"} justifyContent={"space-between"}>
               <Button onClick={toggleShowBuyEth}>Create and Deposit</Button>
      </ModalFooter>
    </Box>
  );
};


const CreateWallet = ({ toggleShowBuyEth, toggleModal, address ,drizzle}) => {
  return (
    <Box>
      <Flex mb={3} justifyContent={"space-between"}>
        <Link onClick={toggleShowBuyEth} p={3}>
          Back
        </Link>
        <Link onClick={toggleModal} color={"#CCC"} p={3} title={"Close"}>
          <Icon name="Close" />
        </Link>
      </Flex>
      <Box mx={5} mb={5}>
        <Flex>
          <Box width={[1, 1 / 2]}>
            <Heading.h3 mb={4}>Create Timelock Wallet</Heading.h3>

            <Text mb={4}>
              Deposit your funds for later investment
            </Text>
            <Flex alignItems={"center"} flexDirection={"column"} mb={4}></Flex>
          </Box>
          <CreateWalletForm width={[1, 1 / 2]} drizzle={drizzle} address={address} />
        </Flex>
      </Box>
    </Box>
  );
};

const CreateWalletForm = ({drizzle,address}) => {
    const [owner, setOwner] = useState(address)
    const [ethAmount, setEthAmoun] = useState(0)
    const [tokenAmount, setTokenAmount] = useState(0)
    const [releaseTime, setReleaseTime] = useState(Date.now())
     const createWallet= async(e)=>{
       e.preventDefault();
       const eth = parseInt(
      drizzle.  web3.utils.fromWei(ethAmount, "ether")
      );
        const tokenAddress =drizzle.contracts.BiToken.address;
       if(tokenAmount>0){
         await drizzle.contracts.BiToken.methods.approve(drizzle.contracts.TimeLockedWalletFactory.address,tokenAmount).send({from:address}).once('transactionHash', async(hash)=> {
          const tx = await drizzle.contracts.TimeLockedWalletFactory.methods.newTimeLockedWallet(owner,
            Math.floor(
                new Date(releaseTime).getTime() / 1000
              ),
           tokenAmount,
            tokenAddress).send ({
            from:address,
              value: eth//drizzle.web3.utils.toBN(ethAmount)
            }).once('transactionHash', function(hash) {console.log(hash,'hash')});
            
        });
       }else{
        const tx = await drizzle.contracts.TimeLockedWalletFactory.methods.newTimeLockedWallet(owner,
          Math.floor(
              new Date(releaseTime).getTime() / 1000
            ),
         tokenAmount,
          tokenAddress).send ({
          from:address,
            value: drizzle.web3.utils.toBN(ethAmount)
          }).once('transactionHash', function(hash) {console.log(hash,'hash')});
          
       }
       }
  return (
    <Box>
      <Card>
        <Heading as={"h3"}>Create Wallet Instantly</Heading>
        <Form>
     
       <Flex>
       <Field label="Currency">
            <Select readOnly options={[{ value: "eth", label: "Ethereum" }]} />
          </Field>
          <Field label="Amount">
            <Input type="number" min={"0"} placeholder={"1 wei"} value={ethAmount} onChange={(data)=>setEthAmoun(data.target.value)}/>
          </Field>
       </Flex>
     <Flex>
     <Field label="Token">
            <Select readOnly options={[{ value: "token", label: "Biconomy Token" }]} />
          </Field>
          <Field label="Amount">
            <Input type="number" min={"0"} placeholder={"BiT 1.00"} value={tokenAmount}  onChange={(data)=>setTokenAmount(data.target.value)}/>
          </Field>
     </Flex>
        
       <div>
       <Field label="Wallet Owner">
            <Input type="text" value={owner}   onChange={(data)=>setOwner(data.target.value)}/>
          </Field>
           <Field label="Release Time">
            <Input type="date" value={releaseTime}   onChange={(data)=>setReleaseTime(data.target.value)}/>
          </Field>
       </div>
         
          <Text color={"#aaa"}>Summary</Text>
          <Flex justifyContent={"space-between"}>
            <Text color={"#aaa"}>~ Wei Amount</Text>{" "}
            <Text color={"#aaa"}> {ethAmount}</Text>
          </Flex>
          <Flex justifyContent={"space-between"} mb={2}>
            <Text color={"#aaa"}>Token Amount</Text>{" "}
            <Text color={"#aaa"}>{tokenAmount}</Text>
          </Flex>
          <Flex justifyContent={"space-between"} mb={2}>
            <Text color={"#aaa"}>Release Time</Text>{" "}
            <Text color={"#aaa"}> {new Date(releaseTime).toLocaleString() }</Text>
          </Flex>
        {tokenAmount>0&&(<Flex>
          <Flex mt={3} mb={4}>
          <Icon name={"InfoOutline"} size={"32px"} mr={3} color={"primary"} />
          <Text>
          Please notes that Metamask will pop up twice and you need to sign th two transactions to stake successfully
          </Text>        
        </Flex>
          <Flex mt={3} mb={4}>
          <Text color={"#aaa"} >
            In order to let smart contract stake your token, you need to allow that through a transaction
          </Text>       
        </Flex>
        </Flex>)}
          <Button
            width={[1]}
            onClick={e => createWallet(e)}
          >
            Create & Deposit
          </Button>
        </Form>
      </Card>
    </Box>
  );
};

function DepositModal({ isOpen, toggleModal, address , drizzle,drizzleState}) {
  const [showBuyEth, setShowBuyEth] = useState(false);

 

  const toggleShowBuyEth = () => {
    setShowBuyEth(!showBuyEth);
  };

  return (
    <Modal isOpen={isOpen}>
      <Box bg={"background"}>
        {/* {showMoveEth && (
          <MoveEth
            toggleShowMoveEth={toggleShowMoveEth}
            toggleModal={toggleModal}
            address={address}
          />
        )} */}
        {showBuyEth && (
          <CreateWallet
          drizzle={drizzle}
          
            toggleShowBuyEth={toggleShowBuyEth}
            toggleModal={toggleModal}
            address={address}
          />
        )}
        { !showBuyEth && (
          <CreateWalletPrep
          drizzle={drizzle}
          drizzleState={drizzleState}
             toggleShowBuyEth={toggleShowBuyEth}
            toggleModal={toggleModal}
          />
        )}
      </Box>
    </Modal>
  );
}

export default DepositModal;
