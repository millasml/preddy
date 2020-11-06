import Web3 from "web3";

import MarketManager from "./contracts/MarketManager.json";

export const web3 = new Web3("ws://localhost:8545");

const options = {
  web3: {
    block: false,
    customProvider: web3,
  },
  contracts: [MarketManager],
};

export default options;
