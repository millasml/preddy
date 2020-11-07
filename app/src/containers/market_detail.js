import React, { useState, useEffect, useCallback } from "react";

import "./market_detail.scss";

import { DrizzleContext } from "@drizzle/react-plugin";
import Market from "../contracts/Market.json";
import { web3 } from "../drizzleOptions";
import { getPotentialWinnings } from "../utils";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import ResolveModal from "./resolve_modal";
import NewBetModal from "./new_bet_modal";
import WithdrawModal from "./withdraw_modal";

import { bytesToStr, getOdds } from "../utils";

//TO-DO: useEffect not triggered if the link is visited directly.

export default (props) => {
  return (
    <DrizzleContext.Consumer>
      {(drizzleContext) => {
        const { drizzle, drizzleState, initialized } = drizzleContext;

        if (!initialized) {
          return "Loading...";
        }

        if (!(props.address in drizzle.contracts)) {
          const contractConfig = {
            contractName: props.address,
            web3Contract: new web3.eth.Contract(Market.abi, props.address),
          };
          drizzle.addContract(contractConfig);
        }
        const contract = drizzle.contracts[props.address];
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
  const [totalBetAmountsKey, setTotalBetAmountsKey] = useState(null);
  const [liquidTokensKey, setLiquidTokensKey] = useState(null);
  const [totalTokensKey, setTotalTokensKey] = useState(null);
  const [totalAmountKey, setTotalAmountKey] = useState(null);

  const [betterBetAmountsKey, setBetterBetAmountsKey] = useState(null);
  const [betSharesKey, setBetSharesKey] = useState(null);

  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [resolutionTimestamp, setResolutionTimestamp] = useState(0);
  const [outcomes, setOutcomes] = useState([]);
  const [status, setStatus] = useState("Open");
  const [arbiter, setArbiter] = useState("");
  const [winnings, setWinnings] = useState(0);

  const changeMarketStatus = useCallback(
    (idx) => {
      const contract = drizzle.contracts[props.address];
      const newStackId = contract.methods["setStatus"].cacheSend(idx, {
        from: drizzleState.accounts[0],
        gas: 5000000,
      });
    },
    [drizzle, drizzleState]
  );

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
      const totalBetAmountsKey = contract.methods[
        "getTotalBetAmounts"
      ].cacheCall();
      setTotalBetAmountsKey(totalBetAmountsKey);
      const liquidTokensKey = contract.methods["getLiquidTokens"].cacheCall();
      setLiquidTokensKey(liquidTokensKey);
      const betterBetAmountsKey = contract.methods[
        "getBetterBetAmounts"
      ].cacheCall(drizzleState.accounts[0]);
      setBetterBetAmountsKey(betterBetAmountsKey);
      const betSharesKey = contract.methods["getBetShares"].cacheCall(
        drizzleState.accounts[0]
      );
      setBetSharesKey(betSharesKey);
      const totalTokensKey = contract.methods["getTokenSupply"].cacheCall();
      setTotalTokensKey(totalTokensKey);
      const totalAmountKey = contract.methods["getTotalAmount"].cacheCall();
      setTotalAmountKey(totalAmountKey);
    }
  }, [drizzle.contracts[props.address]]);

  useEffect(() => {
    if (
      questionKey &&
      drizzleState.contracts[props.address].question[questionKey]
    ) {
      setQuestion(
        drizzleState.contracts[props.address].question[questionKey].value
      );
    }
  }, [questionKey, drizzleState.contracts[props.address]]);

  useEffect(() => {
    if (
      descriptionKey &&
      drizzleState.contracts[props.address].description[descriptionKey]
    ) {
      setDescription(
        drizzleState.contracts[props.address].description[descriptionKey].value
      );
    }
  }, [descriptionKey, drizzleState.contracts[props.address]]);

  useEffect(() => {
    if (
      resolutionTimestampKey &&
      drizzleState.contracts[props.address].resolutionTimestamp[
        resolutionTimestampKey
      ]
    ) {
      setResolutionTimestamp(
        drizzleState.contracts[props.address].resolutionTimestamp[
          resolutionTimestampKey
        ].value
      );
    }
  }, [resolutionTimestampKey, drizzleState.contracts[props.address]]);

  useEffect(() => {
    const contract = drizzleState.contracts[props.address];
    if (
      outcomesKey &&
      contract.outcomes[outcomesKey] &&
      totalBetAmountsKey &&
      contract.getTotalBetAmounts[totalBetAmountsKey] &&
      liquidTokensKey &&
      contract.getLiquidTokens[liquidTokensKey] &&
      betterBetAmountsKey &&
      contract.getBetterBetAmounts[betterBetAmountsKey] &&
      betSharesKey &&
      contract.getBetShares[betSharesKey] &&
      totalTokensKey &&
      contract.getTokenSupply[totalTokensKey] &&
      totalAmountKey &&
      contract.getTotalAmount[totalAmountKey]
    ) {
      const outcomesBytes = contract.outcomes[outcomesKey].value;
      const totalBetAmounts = drizzleState.contracts[
        props.address
      ].getTotalBetAmounts[totalBetAmountsKey].value.map((a) => parseInt(a));

      const liquidTokens =
        drizzleState.contracts[props.address].getLiquidTokens[liquidTokensKey]
          .value;
      const odds = getOdds(liquidTokens);
      const betterBetAmounts =
        contract.getBetterBetAmounts[betterBetAmountsKey].value;
      const betShares = contract.getBetShares[betSharesKey].value;
      const totalTokens = contract.getTokenSupply[totalTokensKey].value;
      const totalAmount = contract.getTotalAmount[totalAmountKey].value;
      const potentialWinnings = getPotentialWinnings(
        totalTokens,
        betShares,
        totalAmount
      );

      setOutcomes(
        getOutcomeStrings(outcomesBytes).map((outcome, index) => ({
          outcome,
          percentage: odds[index] ?? 0,
          bet: betterBetAmounts[index] ?? 0,
          payout: potentialWinnings ? potentialWinnings[index] ?? 0 : 0,
        }))
      );
    }
  }, [
    outcomesKey,
    totalBetAmountsKey,
    betterBetAmountsKey,
    betSharesKey,
    drizzleState.contracts[props.address],
  ]);

  useEffect(() => {
    if (
      statusKey &&
      drizzleState.contracts[props.address].getStatus[statusKey]
    ) {
      setStatus(
        drizzleState.contracts[props.address].getStatus[statusKey].value
      );
    }
  }, [statusKey, drizzleState.contracts[props.address]]);

  useEffect(() => {
    if (
      arbiterKey &&
      drizzleState.contracts[props.address].arbiter[arbiterKey]
    ) {
      setArbiter(
        drizzleState.contracts[props.address].arbiter[arbiterKey].value
      );
    }
  }, [arbiterKey, drizzleState.contracts[props.address]]);

  useEffect(() => {
    if (
      winningsKey &&
      drizzleState.contracts[props.address].getWinnings[winningsKey]
    ) {
      setWinnings(
        drizzleState.contracts[props.address].getWinnings[winningsKey].value ??
          0
      );
    }
  }, [winningsKey, drizzleState.contracts[props.address]]);

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

  const debugButton = () => {
    console.log(questionKey);
    console.log(descriptionKey);
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
      {status == "Close" && (
        <Card>
          <Row>
            <Col xs={4} className="text-center">
              <h6>Arbiter</h6>
              {arbiter}
            </Col>
            <Col>Are you the arbiter? If so, you can resolve this market.</Col>
            <Col>
              <ResolveModal
                outcomes={outcomes.map((possibility) => possibility.outcome)}
                title={question}
                address={props.address}
              >
                <Button>Resolve</Button>
              </ResolveModal>
            </Col>
          </Row>
        </Card>
      )}

      {status == "Resolved" && (
        <Card>
          <Row>
            <Col xs={4} className="text-center">
              <h6>Your Winnings</h6>
              {web3.utils.fromWei(winnings.toString()).substring(0, 5)}
            </Col>
            <Col>
              This market has been resolved. You can withdraw your winnings.
            </Col>
            <Col>
              <WithdrawModal
                address={props.address}
                winnings={web3.utils.fromWei(winnings.toString())}
              >
                <Button>Withdraw</Button>
              </WithdrawModal>
            </Col>
          </Row>
        </Card>
      )}
      <Card>
        <Card.Title>Outcome and Probabilites</Card.Title>
        <ListGroup variant="flush">
          <Row>
            <Col xs={4}>
              <h6>Outcome</h6>
            </Col>
            <Col xs={3} className="text-center">
              <h6>Outcome Likelihood</h6>
            </Col>
            <Col xs={2} className="text-center">
              <h6>Your Bets</h6>
            </Col>
            <Col xs={2} className="text-center">
              <h6>Your Payout</h6>
            </Col>
            <Col xs={1}></Col>
          </Row>
          {outcomes.map((possibility, index) => {
            return (
              <ListGroup.Item key={index}>
                <Row>
                  <Col xs={4}>{possibility.outcome}</Col>
                  <Col xs={3}>
                    <ProgressBar
                      animated
                      variant="success"
                      now={possibility.percentage * 100}
                      label={`${(possibility.percentage * 100).toFixed(2)}%`}
                    />
                  </Col>
                  <Col xs={2} className="text-center">
                    {web3.utils.fromWei(possibility.bet.toString())}
                  </Col>
                  <Col xs={2} className="text-center">
                    {possibility.payout.toFixed(2) ?? 0}
                  </Col>
                  <Col xs={1}>
                    {status === "Open" && (
                      <NewBetModal
                        index={index}
                        outcome={possibility.outcome}
                        address={props.address}
                      >
                        <Button>Bet</Button>
                      </NewBetModal>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Card>
      {process.env.REACT_APP_DEBUG === "true" && (
        <Card>
          <Card.Title>Set Market State</Card.Title>
          <ButtonGroup>
            <Button
              variant="secondary"
              onClick={() => {
                changeMarketStatus(0);
              }}
            >
              Open
            </Button>
            <Button
              onClick={() => {
                changeMarketStatus(1);
              }}
            >
              Close
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                changeMarketStatus(2);
              }}
            >
              Resolve
            </Button>
          </ButtonGroup>
          <Button variant="warning" onClick={debugButton}>
            Debug
          </Button>
        </Card>
      )}
    </Container>
  );
}
