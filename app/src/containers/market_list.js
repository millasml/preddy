import React, { useState, useEffect } from "react";

import { DrizzleContext } from "@drizzle/react-plugin";
import Market from "../contracts/Market.json";
import { web3 } from "../drizzleOptions";
import "./market_list.scss";

import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import MarketItem from "../components/market_item";

// var web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");

const MOCK_MARKETS = [
  {
    question: "Will Joe Biden Win the Elections",
    description: "see the question",
    endDate: "2021",
    voteSummary: "Yes (65.38%)",
    stakes: "112576.06 DAI",
  },
  {
    question: "Will Joe Biden Win the Elections",
    description: "see the question",
    endDate: "2021",
    voteSummary: "Yes (65.38%)",
    stakes: "112576.06 DAI",
  },
  {
    question: "Will Joe Biden Win the Elections",
    description: "see the question",
    endDate: "2021",
    voteSummary: "Yes (65.38%)",
    stakes: "112576.06 DAI",
  },
  {
    question: "Will Joe Biden Win the Elections",
    description: "see the question",
    endDate: "2021",
    voteSummary: "Yes (65.38%)",
    stakes: "112576.06 DAI",
  },
  {
    question: "Will Joe Biden Win the Elections",
    description: "see the question",
    endDate: "2021",
    voteSummary: "Yes (65.38%)",
    stakes: "112576.06 DAI",
  },
  {
    question: "Will Joe Biden Win the Elections",
    description: "see the question",
    endDate: "2021",
    voteSummary: "Yes (65.38%)",
    stakes: "112576.06 DAI",
  },
  {
    question: "Will Joe Biden Win the Elections",
    description: "see the question",
    endDate: "2021",
    voteSummary: "Yes (65.38%)",
    stakes: "112576.06 DAI",
  },
];

export default (props) => {
  return (
    <DrizzleContext.Consumer>
      {(drizzleContext) => {
        const { drizzle, drizzleState, initialized } = drizzleContext;

        if (!initialized) {
          return "Loading...";
        }
        return (
          <MarketList
            {...props}
            drizzle={drizzle}
            drizzleState={drizzleState}
          />
        );
      }}
    </DrizzleContext.Consumer>
  );
};

function MarketList(props) {
  const { drizzle, drizzleState } = props;
  const [allMarketAddresses, setAllMarketAddresses] = useState([]);
  const [dataKey, setDataKey] = useState(null);

  useEffect(() => {
    const contract = drizzle.contracts.MarketManager;
    if (contract) {
      const _dataKey = contract.methods["getMarkets"].cacheCall();
      setDataKey(_dataKey);
    }
  }, []);

  useEffect(() => {
    // get the contract state from drizzleState
    if (dataKey) {
      const { MarketManager } = drizzleState.contracts;
      // using the saved `dataKey`, get the variable we're interested in
      const markets = MarketManager.getMarkets[dataKey];
      if (markets) {
        setAllMarketAddresses(markets.value);
      }
    }
  }, [dataKey, drizzleState]);

  useEffect(() => {
    allMarketAddresses.forEach((address) => {
      try {
        var contractConfig = {
          contractName: address,
          web3Contract: new web3.eth.Contract(Market.abi, address),
        };
        drizzle.addContract(contractConfig);
      } catch (error) {
        console.log(error);
      }
    });
  }, [allMarketAddresses]);

  return (
    <Card>
      <Card.Title>Markets</Card.Title>
      <ListGroup variant="flush">
        {allMarketAddresses.length > 0
          ? allMarketAddresses.map((market, index) => {
              return <MarketItem address={market} key={index} />;
            })
          : "No markets available"}
      </ListGroup>
    </Card>
  );
}
