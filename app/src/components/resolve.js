import React, { useState, useEffect, useCallback } from "react";
import { DrizzleContext } from "@drizzle/react-plugin";

import Button from "react-bootstrap/Button";

import "./new_market.scss";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
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
          <Resolve {...props} drizzle={drizzle} drizzleState={drizzleState} />
        );
      }}
    </DrizzleContext.Consumer>
  );
};

function Resolve(props) {
  const { drizzle, drizzleState } = props;

  const [resolution, setResolution] = useState(0);

  const [contract, setContract] = useState(null);
  const [stackId, setStackId] = useState(null);

  useEffect(() => {
    if (!contract) {
      const contract = drizzle.contracts[props.address];
      setContract(contract);
    }
  }, [drizzle.contracts, props.address]);

  const resolveMarket = useCallback(
    (resolution) => {
      const newStackId = contract.methods["resolve"].cacheSend(resolution, {
        from: drizzleState.accounts[0],
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
        resolveMarket(parseInt(resolution));
        if (process.env.REACT_APP_DEBUG !== "true") {
          props.onClose();
        }
      }}
      className="new-bet-form"
    >
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Resolution</Form.Label>
          <Form.Control
            as="select"
            onChange={(event) => setResolution(event.target.value)}
            required
          >
            {props.outcomes.map((outcome, index) => (
              <option value={index} key={index}>
                {outcome}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form.Row>

      <ModalFooter>
        <Form.Row className="form-btns">
          <Button variant="outline-secondary" onClick={props.onClose}>
            Close
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="submit">Resolve</Button>
        </Form.Row>
      </ModalFooter>
      {process.env.REACT_APP_DEBUG === "true" && (
        <Button onClick={getTxStatus}>Get Txn Status</Button>
      )}
    </Form>
  );
}
