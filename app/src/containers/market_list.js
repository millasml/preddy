import React, { useState } from "react";
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
  const [stackId, setStackId] = useState(null);
  return (
    <DrizzleContext.Consumer>
      {(drizzleContext) => {
        const { drizzle, drizzleState, initialized } = drizzleContext;

        const contract = drizzle.contracts.MarketManager;

        const getTxStatus = () => {
          // get the transaction states from the drizzle state
          const { transactions, transactionStack } = drizzleState;

          // get the transaction hash using our saved `stackId`
          const txHash = transactionStack[stackId];

          // if transaction hash does not exist, don't display anything
          if (!txHash) return null;

          console.log(
            `Transaction status: ${
              transactions[txHash] && transactions[txHash].status
            }`
          );

          // otherwise, return the transaction status
          return `Transaction status: ${
            transactions[txHash] && transactions[txHash].status
          }`;
        };

        if (!initialized) {
          return "Loading...";
        }

        return <MarketEntry {...props} />;
      }}
    </DrizzleContext.Consumer>
  );
};

function MarketEntry(props) {
  return (
    <Card>
      <Card.Title>Markets</Card.Title>
      <ListGroup variant="flush">
        {MOCK_MARKETS.map((market) => {
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
