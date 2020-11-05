import React, { useState, useEffect } from "react";

import { DrizzleContext } from "@drizzle/react-plugin";

import "./new_market.scss";

import { strArrToBytes } from "../utils";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import ModalFooter from "react-bootstrap/ModalFooter";
import InputGroup from "react-bootstrap/InputGroup";

import BetOptions from "./bet_options";
import { web3 } from "../drizzleOptions";

export default (props) => {
  const [stackId, setStackId] = useState(null);
  return (
    <DrizzleContext.Consumer>
      {(drizzleContext) => {
        const { drizzle, drizzleState, initialized } = drizzleContext;

        const contract = drizzle.contracts.MarketManager;

        const createContract = (
          question,
          description,
          outcomePairs,
          initialLiquidity,
          expiryDate,
          arbiter
        ) => {
          const outcomeStrings = outcomePairs.map(
            ({ description }) => description
          );
          const outcomeShares = outcomePairs.map(({ liquidity }) =>
            parseInt(liquidity)
          );
          initialLiquidity = parseInt(initialLiquidity);
          const initialMarket = outcomeShares.map((s) => {
            const mkt = initialLiquidity * (s / 100);
            return web3.utils.toWei(mkt.toString(), "ether");
          });
          const [outcomes, outcomeLengths] = strArrToBytes(outcomeStrings);
          const resolutionUnixTime = Math.floor(
            new Date(expiryDate).valueOf() / 1000
          );
          const newStackId = contract.methods["createMarket"].cacheSend(
            outcomes,
            outcomeLengths,
            initialMarket,
            arbiter,
            question,
            description,
            resolutionUnixTime,
            {
              from: drizzleState.accounts[0],
              gas: 5000000,
              value: web3.utils.toWei(initialLiquidity.toString(), "ether"),
            }
          );
          setStackId(newStackId);
        };

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
        };

        if (!initialized) {
          return "Loading...";
        }

        return (
          <AddNewMarket
            {...props}
            onSubmit={createContract}
            getTxStatus={getTxStatus}
          />
        );
      }}
    </DrizzleContext.Consumer>
  );
};

function AddNewMarket(props) {
  const [question, setQuestion] = useState(null);
  const [description, setDescription] = useState(null);
  const [outcomes, setOutcomes] = useState(null);
  const [initialLiquidity, setInitialLiquidity] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [arbiter, setArbiter] = useState(null);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(
          question,
          description,
          outcomes,
          initialLiquidity,
          expiryDate,
          arbiter
        );
        // props.onClose();
      }}
      className="new-market-form"
    >
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Question</Form.Label>
          <FormControl
            placeholder="Write your question here"
            aria-label="question"
            onChange={(event) => setQuestion(event.target.value)}
            required
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Description</Form.Label>
          <FormControl
            placeholder="Provide a short description of your market"
            aria-label="description"
            as="textarea"
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Outcomes</Form.Label>
          <BetOptions updateOutcomes={setOutcomes} />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Label>Total Initial Liquity</Form.Label>
        <Form.Group as={InputGroup}>
          <FormControl
            placeholder=""
            aria-label="total-liquidity"
            onChange={(event) => setInitialLiquidity(event.target.value)}
            required
          />
          <InputGroup.Append>
            <InputGroup.Text>Ether</InputGroup.Text>
          </InputGroup.Append>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Expiry Date</Form.Label>
          <Form.Control
            placeholder="Date the market closes"
            aria-label="date"
            type="date"
            onChange={(event) => setExpiryDate(event.target.value)}
            min={new Date(Date.now())}
            required
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Arbiter</Form.Label>
          <FormControl
            placeholder="Assign an arbiter over here"
            aria-label="arbiter"
            onChange={(event) => setArbiter(event.target.value)}
            required
          />
        </Form.Group>
      </Form.Row>
      <ModalFooter>
        <Form.Row className="form-btns">
          <Button variant="outline-secondary" onClick={props.onClose}>
            Close
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="submit">Create New Market</Button>
        </Form.Row>
      </ModalFooter>
      {process.env.REACT_APP_DEBUG === "true" && (
        <Button onClick={props.getTxStatus}>Get Txn Status</Button>
      )}
    </Form>
  );
}
