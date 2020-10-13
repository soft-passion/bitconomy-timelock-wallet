import Web3 from "web3";

import Biconomy from "@biconomy/mexa";

// Drizzle contracts
import BiToken from "./contracts/BiToken.json";
// import TimeLockedWallet from "./contracts/TimeLockedWallet.json";
import TimeLockedWalletFactory from "./contracts/TimeLockedWalletFactory.json";
const drizzleOptions = {
  contracts: [ BiToken, TimeLockedWalletFactory],
  web3: {
    block: false,
   customProvider:  new Web3( new Biconomy(window.ethereum,{apiKey: "IX3KAQLDZ.439490cf-7cbe-4cf5-8be5-c8ce1979aeee", debug: true})),
  },
};

export default drizzleOptions;
