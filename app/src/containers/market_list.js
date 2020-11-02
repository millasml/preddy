import React, { useState, useEffect } from "react";
import { DrizzleContext } from "@drizzle/react-plugin";

import "./market_list.scss";

import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import MarketItem from "../components/market_item";

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
          <MarketEntry
            {...props}
            drizzle={drizzle}
            drizzleState={drizzleState}
          />
        );
      }}
    </DrizzleContext.Consumer>
  );
};

function MarketEntry(props) {
  const { drizzle, drizzleState } = props;
  const [allMarkets, setAllMarkets] = useState(MOCK_MARKETS);
  const [dataKey, setDataKey] = useState(null);

  useEffect(() => {
    const contract = drizzle.contracts.MarketManager;
    if (contract) {
      // console.log(contract);
      const _dataKey = contract.methods["markets"].cacheCall();
      setDataKey(_dataKey);
    }
  }, []);

  useEffect(() => {
    // get the contract state from drizzleState
    const { MarketManager } = drizzleState.contracts;
    // using the saved `dataKey`, get the variable we're interested in
    console.log(dataKey);
    console.log(MarketManager);
    const markets = MarketManager.markets;
    console.log(markets);
  }, [dataKey]);

  return (
    <Card>
      <Card.Title>Markets</Card.Title>
      <ListGroup variant="flush">
        {allMarkets.map((market) => {
          return (
            <MarketItem
              question={market.question}
              description={market.description}
              endDate={market.endDate}
              voteSummary={market.voteSummary}
              stakes={market.stakes}
            />
          );
        })}
      </ListGroup>
    </Card>
  );
}
