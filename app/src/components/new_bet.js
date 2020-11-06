import React, { useEffect, useState, useCallback } from "react";

import { DrizzleContext } from "@drizzle/react-plugin";
import { web3 } from "../drizzleOptions";
import { getOddsForBet } from "../utils";

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
  const { drizzle, drizzleState, index } = props;
  const [amount, setAmount] = useState(null);
  const [contract, setContract] = useState(null);
  const [totalTokensKey, setTotalTokensKey] = useState(null);
  const [liquidTokensKey, setLiquidTokensKey] = useState(null);
  const [totalAmountKey, setTotalAmountKey] = useState(null);
  const [stackId, setStackId] = useState(null);

  useEffect(() => {
    if (!contract) {
      const contract = drizzle.contracts[props.address];
      setContract(contract);
      const totalTokensKey = contract.methods["getTotalTokens"].cacheCall();
      setTotalTokensKey(totalTokensKey);
      const liquidTokensKey = contract.methods["getLiquidTokens"].cacheCall();
      setLiquidTokensKey(liquidTokensKey);
      const totalAmountKey = contract.methods["getTotalAmount"].cacheCall();
      setTotalAmountKey(totalAmountKey);
    }
  }, [drizzle.contracts, props.address]);

  const createBet = useCallback(
    (index, amount) => {
      const newStackId = contract.methods["placeBet"].cacheSend(index, {
        from: drizzleState.accounts[0],
        value: web3.utils.toWei(amount.toString()),
        gas: 5000000,
      });
      setStackId(newStackId);
    },
    [contract]
  );

  const _getBettingOdds = useCallback(
    (index, amount, totalTokens, liquidTokens, totalAmount) =>
      getOddsForBet(totalTokens, liquidTokens, totalAmount, index, amount)
  );

  const getBettingOdds = () =>
    _getBettingOdds(
      index,
      amount,
      drizzleState.contracts[props.address].getTotalTokens[totalTokensKey],
      drizzleState.contracts[props.address].getLiquidTokens[liquidTokensKey],
      drizzleState.contracts[props.address].getTotalAmount[totalAmountKey]
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
        if (process.env.REACT_APP_DEBUG !== "true") {
          props.onClose();
        }
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
        <p>Betting odds: {getBettingOdds()}</p>
      </ModalFooter>
      {process.env.REACT_APP_DEBUG === "true" && (
        <Button onClick={getTxStatus}>Get Txn Status</Button>
      )}
    </Form>
  );
}
