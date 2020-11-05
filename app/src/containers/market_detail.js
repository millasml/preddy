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
import WithdrawModal from "./withdraw_modal";

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

  const [questionKey, setQuestionKey] = useState(null);
  const [descriptionKey, setDescriptionKey] = useState(null);
  const [resolutionTimestampKey, setResolutionTimestampKey] = useState(null);
  const [outcomesKey, setOutcomesKey] = useState(null);
  const [statusKey, setStatusKey] = useState(null);
  const [arbiterKey, setArbiterKey] = useState(null);
  const [winningsKey, setWinningsKey] = useState(null);

  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [resolutionTimestamp, setResolutionTimestamp] = useState(0);
  const [outcomes, setOutcomes] = useState([]);
  const [status, setStatus] = useState("Open");
  const [arbiter, setArbiter] = useState("");
  const [winnings, setWinnings] = useState(0);

  useEffect(() => {
    const contract = drizzle.contracts[props.address];
    if (contract) {
      const questionKey = contract.methods["question"].cacheCall();
      setQuestionKey(questionKey);
      const descriptionKey = contract.methods["description"].cacheCall();
      setDescriptionKey(descriptionKey);
      const resolutionTimestampKey = contract.methods[
        "resolutionTimestamp"
      ].cacheCall();
      setResolutionTimestampKey(resolutionTimestampKey);
      const outcomesKey = contract.methods["outcomes"].cacheCall();
      setOutcomesKey(outcomesKey);
      const statusKey = contract.methods["getStatus"].cacheCall();
      setStatusKey(statusKey);
      const arbiterKey = contract.methods["arbiter"].cacheCall();
      setArbiterKey(arbiterKey);
      const winningsKey = contract.methods["getWinnings"].cacheCall(
        drizzleState.accounts[0]
      );
      setWinningsKey(winningsKey);
    }
  }, [drizzle.contracts[props.address]]);

  useEffect(() => {
    const currentContractState = drizzleState.contracts[props.address];
    if (currentContractState.question[questionKey]) {
      setQuestion(currentContractState.question[questionKey].value);
    }
  }, [questionKey, drizzleState]);

  useEffect(() => {
    const currentContractState = drizzleState.contracts[props.address];
    if (currentContractState.description[descriptionKey]) {
      setDescription(currentContractState.description[descriptionKey].value);
    }
  }, [descriptionKey, drizzleState]);

  useEffect(() => {
    const currentContractState = drizzleState.contracts[props.address];
    if (currentContractState.resolutionTimestamp[resolutionTimestampKey]) {
      setResolutionTimestamp(
        currentContractState.resolutionTimestamp[resolutionTimestampKey].value
      );
    }
  }, [resolutionTimestampKey, drizzleState]);

  useEffect(() => {
    const currentContractState = drizzleState.contracts[props.address];
    if (currentContractState.outcomes[outcomesKey]) {
      const outcomesBytes = currentContractState.outcomes[outcomesKey].value;
      setOutcomes(
        getOutcomeStrings(outcomesBytes).map((outcome) => ({
          outcome,
          percentage: 0.3,
        }))
      );
    }
  }, [outcomesKey, drizzleState]);

  useEffect(() => {
    const currentContractState = drizzleState.contracts[props.address];
    if (currentContractState.getStatus[statusKey]) {
      setStatus(currentContractState.getStatus[statusKey].value);
    }
  }, [statusKey, drizzleState]);

  useEffect(() => {
    const currentContractState = drizzleState.contracts[props.address];
    if (currentContractState.arbiter[arbiterKey]) {
      setArbiter(currentContractState.arbiter[arbiterKey].value);
    }
  }, [arbiterKey, drizzleState]);

  useEffect(() => {
    const currentContractState = drizzleState.contracts[props.address];
    if (currentContractState.getWinnings[winningsKey]) {
      setWinnings(currentContractState.getWinnings[winningsKey].value);
    }
  }, [winningsKey, drizzleState]);

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
          {status != "Closed" && (
            <Col className="text-center">
              <h6>Arbiter</h6>
              {arbiter}
            </Col>
          )}
          <Col className="text-center">
            <Badge className="status">{status}</Badge>
          </Col>
        </Row>
      </Card>
      {status == "Closed" && (
        <Card>
          <Row>
            <Col xs={4} className="text-center">
              <h6>Arbiter</h6>
              {arbiter}
            </Col>
            <Col>Are you the arbiter? If so, you can resolve this market.</Col>
            <Col>
              <ResolveModal
                outcomes={props.voteDetails.map(
                  (possibility) => possibility.outcome
                )}
                title={props.question}
                address={props.address}
              >
                <Button>Resolve</Button>
              </ResolveModal>
            </Col>
          </Row>
        </Card>
      )}

      {status == "Resolved" && winnings != 0 && (
        <Card>
          <Row>
            <Col xs={4} className="text-center">
              <h6>This market has been resolved.</h6>
              {winnings}
            </Col>
            <Col>You can withdraw your winnings.</Col>
            <Col>
              <WithdrawModal address={props.address} winnings={winnings}>
                <Button>Withdraw</Button>
              </WithdrawModal>
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
                    <NewBetModal
                      index={index}
                      outcome={possibility.outcome}
                      address={props.address}
                    >
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
