import React, { useState, useEffect } from "react";

import "./market_detail.scss";

import { DrizzleContext } from "@drizzle/react-plugin";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import ResolveModal from "./resolve_modal";
import NewBetModal from "./new_bet_modal";

import { bytesToStr } from "../utils";

//TO-DO: useEffect not triggered if the link is visited directly.

export default (props) => {
  return (
    <DrizzleContext.Consumer>
      {(drizzleContext) => {
        const { drizzle, drizzleState, initialized } = drizzleContext;

        if (!initialized) {
          return "Loading...";
        }
        return (
          <MarketDetail
            {...props}
            drizzle={drizzle}
            drizzleState={drizzleState}
          />
        );
      }}
    </DrizzleContext.Consumer>
  );
};

function MarketDetail(props) {
  const { drizzle, drizzleState } = props;

  const [contract, setContract] = useState(null);

  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [resolutionTimestamp, setResolutionTimestamp] = useState(0);
  const [outcomes, setOutcomes] = useState([]);

  useEffect(() => {
    if (!contract) {
      const contract = drizzle.contracts[props.address];
      setContract(contract);
    }
  }, [drizzleState, props.address, drizzle.contracts]);

  useEffect(() => {
    if (contract) {
      const questionKey = contract.methods["question"].cacheCall();
      const descriptionKey = contract.methods["description"].cacheCall();
      const resolutionTimestampKey = contract.methods[
        "resolutionTimestamp"
      ].cacheCall();
      const arbiterKey = contract.methods["arbiter"].cacheCall();
      const outcomesKey = contract.methods["outcomes"].cacheCall();

      const currentContractState = drizzleState.contracts[props.address];

      if (currentContractState.question[questionKey]) {
        setQuestion(currentContractState.question[questionKey].value);
      }
      if (currentContractState.description[descriptionKey]) {
        setDescription(currentContractState.description[descriptionKey].value);
      }
      if (currentContractState.resolutionTimestamp[resolutionTimestampKey]) {
        setResolutionTimestamp(
          currentContractState.resolutionTimestamp[resolutionTimestampKey].value
        );
      }

      if (currentContractState.outcomes[outcomesKey]) {
        const outcomesBytes = currentContractState.outcomes[outcomesKey].value;
        setOutcomes(
          getOutcomeStrings(outcomesBytes).map((outcome) => ({
            outcome,
            percentage: 0.3,
          }))
        );
      }
    }
  }, [contract, drizzleState, props.address]);

  const getFormattedDate = (timeInSeconds) => {
    const dateObject = new Date(timeInSeconds * 1000);
    return dateObject.toDateString();
  };

  const getTimeLeft = (timeInSeconds) => {
    const difference = timeInSeconds * 1000 - Date.now();
    return Math.floor(difference / 86400000);
  };

  const getOutcomeStrings = (outcomeBytes) => {
    const stringArr = bytesToStr(outcomeBytes);
    return stringArr;
  };

  return (
    <Container className="market-detail">
      <Card>
        <Card.Title>{question}</Card.Title>
        <Card.Subtitle>{description}</Card.Subtitle>
        <br />
        <Row>
          <Col className="text-center">
            <h6>Closing Date</h6>
            {getFormattedDate(resolutionTimestamp)}
          </Col>
          <Col className="text-center">
            <h6>Time Remaining</h6>
            {getTimeLeft(resolutionTimestamp)} Days Left
          </Col>
          <Col className="text-center">
            <Badge className="status">{props.isOpen ? "OPEN" : "CLOSED"}</Badge>
          </Col>
        </Row>
      </Card>
      {props.isOpen && (
        <Card>
          <Row>
            <Col xs={4} className="text-center">
              <h6>Arbiter</h6>
              {props.arbiter}
            </Col>
            <Col>Are you the arbiter? If so, you can resolve this market.</Col>
            <Col>
              <ResolveModal
                outcomes={props.voteDetails.map(
                  (possibility) => possibility.outcome
                )}
                title={props.question}
              >
                <Button>Resolve</Button>
              </ResolveModal>
            </Col>
          </Row>
        </Card>
      )}

      <Card>
        <Card.Title>Outcome and Probabilites</Card.Title>
        <ListGroup variant="flush">
          {outcomes.map((possibility, index) => {
            return (
              <ListGroup.Item key={index}>
                <Row>
                  <Col>{possibility.outcome}</Col>
                  <Col>
                    <ProgressBar
                      animated
                      variant="success"
                      now={possibility.percentage * 100}
                      label={`${possibility.percentage * 100}%`}
                    />
                  </Col>
                  <Col xs={1}>
                    <NewBetModal outcome={index}>
                      <Button>Bet</Button>
                    </NewBetModal>
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Card>
    </Container>
  );
}
