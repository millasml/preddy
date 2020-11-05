import React, { useEffect, useState, useCallback } from "react";

import { DrizzleContext } from "@drizzle/react-plugin";

import "./new_market.scss";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import ModalFooter from "react-bootstrap/ModalFooter";

export default (props) => {
  return (
    <DrizzleContext.Consumer>
      {(drizzleContext) => {
        const { drizzle, drizzleState, initialized } = drizzleContext;

        if (!initialized) {
          return "Loading...";
        }

        return (
          <NewBet {...props} drizzle={drizzle} drizzleState={drizzleState} />
        );
      }}
    </DrizzleContext.Consumer>
  );
};

function NewBet(props) {
  const { drizzle, drizzleState } = props;
  const [amount, setAmount] = useState(null);
  const [contract, setContract] = useState(null);
  const [stackId, setStackId] = useState(null);

  useEffect(() => {
    if (!contract) {
      const contract = drizzle.contracts[props.address];
      setContract(contract);
    }
  }, [drizzle.contracts, props.address]);

  const createBet = useCallback(
    (index, amount) => {
      const newStackId = contract.methods["placeBet"].cacheSend(index, {
        from: drizzleState.accounts[0],
        value: amount,
        gas: 5000000,
      });
      setStackId(newStackId);
    },
    [contract]
  );

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

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        createBet(props.index, amount);
        // props.onClose();
      }}
      className="new-bet-form"
    >
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
      {process.env.REACT_APP_DEBUG === "true" && (
        <Button onClick={getTxStatus}>Get Txn Status</Button>
      )}
    </Form>
  );
}
