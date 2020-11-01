import React, { useState } from "react";

import { DrizzleContext } from "@drizzle/react-plugin";

import "./new_market.scss";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import ModalFooter from "react-bootstrap/ModalFooter";

export default (props) => {
  const [stackId, setStackId] = useState(null);
  return (
    <DrizzleContext.Consumer>
      {(drizzleContext) => {
        const { drizzle, drizzleState, initialized } = drizzleContext;

        const contract = drizzle.contracts.MarketManager;

        const createBet = () => {};

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

        return (
          <NewBet {...props} onSubmit={createBet} getTxStatus={getTxStatus} />
        );
      }}
    </DrizzleContext.Consumer>
  );
};

function NewBet(props) {
  const [address, setAddress] = useState(null);
  const [amount, setAmount] = useState(null);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(props.outcome, address, amount);
        props.onClose();
      }}
      className="new-bet-form"
    >
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Address</Form.Label>
          <FormControl
            placeholder="Address here"
            aria-label="question"
            onChange={(event) => setAddress(event.target.value)}
            required
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Bet Amount</Form.Label>
          <FormControl
            placeholder="Bet amount"
            aria-label="description"
            onChange={(event) => setAmount(event.target.value)}
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
          <Button type="submit">Place Bet</Button>
        </Form.Row>
      </ModalFooter>
    </Form>
  );
}
