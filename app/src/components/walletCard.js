import React,{useState,useEffect} from "react";
import { Card, Button, Flex, Box, Text,Heading,Form } from "rimble-ui";
import TimeLockedWallet from '../contracts/TimeLockedWallet.json'
import RainbowBox from "./RainbowBox";
import RainbowImage from "./RainbowImage";
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
console.log(contractAddress,'contractAddress');
    const [wallet, setWallet] = useState(null)
    const contractName = TimeLockedWallet.contractName

    const addNewContract = (newAddress) => {
        console.log(newAddress,'newAddress');
        if(newAddress){
         let web3Contract = new drizzle.web3.eth.Contract(TimeLockedWallet.abi, newAddress) //second argument is new contract's address 
                                                  
        let contractConfig = { contractName, web3Contract }
        let events = ["Received","Withdrew","WithdrewTokens"]
      
        // Using the Drizzle context object
        drizzle.addContract(contractConfig, events)
        console.log(drizzle,'add contract drizzle');
        }
        
      }
    useEffect(() => {
        console.log(drizzle,'drizzle useEffect');

    if(!drizzle.contracts[contractName]){
            addNewContract(contractAddress)
            console.log(drizzle,'drizzle');
        }else{
            console.log('hit');
        }
       
      });
    const claimEth = () => {

    }
    const claimToken = () => {

    }
    return (
        <Box width={[5, 10 / 1]} p={3}>
     {wallet&&(       <Card p={0} borderColor={"#d6d6d6"}>
                <Heading as={"h3"}>Your wallet Details</Heading>

                <Flex justifyContent={"space-between"}>
                    <Text color={"#aaa"}>~ ETH Amount</Text>{" "}
                            {/* <ContractData
                            drizzle={drizzle}
                            drizzleState={drizzleState}
                            contract="TimeLockedWallet"
                            method="balanceOf"
                            methodArgs={[drizzleState.accounts[0]]}
                />     */}
                      </Flex>
                <Flex justifyContent={"space-between"}>
                    <Text color={"#aaa"}>~ Owner Address</Text>{" "}
                    <Text color={"#aaa"}> {wallet.owner}</Text>
                </Flex>
                <Flex justifyContent={"space-between"} mb={2}>
                    <Text color={"#aaa"}>Token Amount</Text>{" "}
                    <Text color={"#aaa"}>{wallet.tokenAmount}</Text>
                </Flex>
                <Flex justifyContent={"space-between"} mb={2}>
                    <Text color={"#aaa"}>Release Time</Text>{" "}
                    <Text color={"#aaa"}>wallet. </Text>
                </Flex>
                <Form>
                    <Button
                        width={[1]}
                        onClick={e => claimEth(e)}
                    >
                        Claim Eth
                  </Button>
                    <Button
                        width={[1]}
                        onClick={e => claimToken(e)}
                    >
                        Claim Token
                  </Button>
                </Form>
            </Card>
       )} </Box>);
}

export default WalletCard;
