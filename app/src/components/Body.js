import React, { useState, useEffect } from "react";
import HeaderNav from "./HeaderNav";
import Landing from "./Landing";
import ProgressAlertContainer from "../core/utilities/ProgressAlert.container";
import { Box, Flex } from "rimble-ui";

function Body({ drizzle, drizzleState, store }) {
  const [address, setAddress] = useState(null);
  const [route, setRoute] = useState("Home");

  useEffect(() => {
    if (drizzleState) {
      setAddress(drizzleState.accounts["0"]);
    }
  }, [drizzleState]);

  const preflightCheck = () => {
    if (window.ethereum) {
      window.ethereum.enable();
    }
  };

  return (
    <Box height={"100%"}>
      <Flex
        flexDirection={"column"}
        justifyContent={"space-between"}
        height={"100%"}
      >
        <HeaderNav
          drizzle={drizzle}
          drizzleState={drizzleState}
          preflightCheck={preflightCheck}
        />
        {
          {
            Home: <Landing drizzle={drizzle} drizzleState={drizzleState} />,
        
          }[route]
        }
       
      </Flex>

 
    </Box>
  );
}

export default Body;
