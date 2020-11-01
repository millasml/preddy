import Web3 from "web3";

import MarketManager from "./contracts/MarketManager.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:8545"),
  },
  contracts: [MarketManager],
};

export default options;
