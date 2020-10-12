// Drizzle contracts
import BiToken from "./contracts/BiToken.json";
// import TimeLockedWallet from "./contracts/TimeLockedWallet.json";
import TimeLockedWalletFactory from "./contracts/TimeLockedWalletFactory.json";
const drizzleOptions = {
  contracts: [ BiToken, TimeLockedWalletFactory],
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:8545"
    }
  }
};

export default drizzleOptions;
