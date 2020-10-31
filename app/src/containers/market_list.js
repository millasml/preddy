import React from "react";

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

export default function MarketEntry(props) {
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
