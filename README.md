## Preddy - Prediction Market

## Features
- Automatic Market Maker (AMM) based on the Balancer whitepaper
- Real time information about potential winnings
- Fully decentralised web3 application, anyone can deploy the frontend
- Categorical/Binary markets

## Quick Start
Start the blockchain
```shell=
cd preddy
truffle migrate --network develop
truffle develop
```

Start the react application
```shell=
cd app
npm run start
```

if you would like to run the react application in debug mode, use the following commands instead
```shell=
cd app
npm run start:debug
```

## Fully Decentralized
All application state is stored on the blockchain in the 2 smart contracts, `Market` and `MarketManager`. This means that anyone can deploy their own version of Preddy, or run a mirror of the frontend pointing to the same smart contract.

## Real time information about potential winnings
In a prediction market, it's important for punters to understand the odds of a potential bet. This allows them to make an informed and rational decision by combining that information with their own intuition on the outcome probabilities. By providing real time price, odds and winnings information, we are enabling price/odds discovery which increases the accuracy of our market. This information is powered by our AMM.

## Automatic Market Maker (AMM)
AMM helps to provide continuously available liquidity for all outcome tokens. Preddy adapts the Constant Mean Market Maker (CMMM) from [Balancer Protocol](https://balancer.finance/whitepaper/) for the prediction market use case. The smart contract allows liquidity providers to choose an initial distribution of liqudity. This allows them to control the risks of providing liquidity based on their own estimates of the odds. 

Betters are issued outcome tokens in exchange for ETH when betting on a certain outcome. These outcome tokens represent their share of the winning pool. The price of the outcome token in the CMMM is proportional to the probability of the outcome. Although not implemented in Preddy, it is an easy extension to allow betters to sell tokens as odds changes.

## State Machine Diagram
![](https://i.imgur.com/AVkxU8z.png)

State transitions are achieved using a solidity modifier that is applied to functions. Require guards are used to ensure correct transitions. E.g. In `Market.resolve`, it is required for the transaction sender to be the arbiter specified in the Market contract.
