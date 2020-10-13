import Web3 from "web3";
import Biconomy from "@biconomy/mexa";

import BiToken from "./contracts/BiToken.json";
// import TimeLockedWallet from "./contracts/TimeLockedWallet.json";
import TimeLockedWalletFactory from "./contracts/TimeLockedWalletFactory.json";
// const provider = window["ethereum"];
// const biconomy = new Biconomy(provider,{apiKey: "eXnXdw7vm.82ae4614-d704-4714-a9aa-f1db8d8c921c", debug: true});

const options = {
  web3: {
    block: false,
   customProvider:  new Web3( new Biconomy(window.ethereum,{apiKey: "IX3KAQLDZ.439490cf-7cbe-4cf5-8be5-c8ce1979aeee", debug: true})),
  },
  contracts: [ BiToken, TimeLockedWalletFactory],
  events: {
    // TimeLockedWallet: ["Created","Received","Withdrew","WithdrewTokens"],
    TimeLockedWalletFactory: ["Created"],
    // BiToken: ["Created","Received","Withdrew","WithdrewTokens"],
  },
};

export default options;
