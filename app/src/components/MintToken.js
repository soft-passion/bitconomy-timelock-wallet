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








function MintTokenModal({ isOpen, toggleModal, address , drizzle,drizzleState}) {
  const [showBuyEth, setShowBuyEth] = useState(false);

 



  return (
    <Modal isOpen={isOpen}>
      <Box bg={"background"}>
      <Box>
      <Flex mb={3} justifyContent={"space-between"}>
    
        <Link onClick={toggleModal} color={"#CCC"} p={3} title={"Close"}>
          <Icon name="Close" />
        </Link>
      </Flex>
      <Card>
        <Heading as={"h3"}>Mint Token Instantly</Heading>
    
        <ContractForm
          drizzle={drizzle}
          contract="BiToken"
          method="mint"
          labels={["To Address", "Amount to Mint"]}
        />
        

      </Card>
    </Box>
      </Box>
    </Modal>
  );
}

export default MintTokenModal;
