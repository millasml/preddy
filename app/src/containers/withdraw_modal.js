import React, { useState, useEffect, useCallback } from "react";

import { DrizzleContext } from "@drizzle/react-plugin";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default (props) => {
  return (
    <DrizzleContext.Consumer>
      {(drizzleContext) => {
        const { drizzle, drizzleState, initialized } = drizzleContext;

        if (!initialized) {
          return "Loading...";
        }

        return (
          <WithdrawModal
            {...props}
            drizzle={drizzle}
            drizzleState={drizzleState}
          />
        );
      }}
    </DrizzleContext.Consumer>
  );
};

function WithdrawModal(props) {
  const { drizzle, drizzleState } = props;
  const [show, setShow] = useState(false);

  const [contract, setContract] = useState(null);
  const [stackId, setStackId] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (!contract) {
      const contract = drizzle.contracts[props.address];
      setContract(contract);
    }
  }, [drizzle.contracts, props.address]);

  const withdrawWinnings = useCallback(() => {
    const newStackId = contract.methods["withdraw"].cacheSend({
      from: drizzleState.accounts[0],
      gas: 5000000,
    });
    setStackId(newStackId);
  }, [contract]);

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

  return (
    <>
      <div onClick={handleShow} className="modal-button">
        {props.children}
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="new-market-modal"
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>Withdraw Winnings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have total winnings of {props.winnings}. Would you like to
          withdraw them?
        </Modal.Body>
        <Modal.Footer>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              withdrawWinnings();
              // props.onClose();
            }}
            className="new-bet-form"
          >
            <Form.Row className="form-btns">
              <Button variant="outline-secondary" onClick={handleClose}>
                Close
              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="submit">Withdraw</Button>
            </Form.Row>
          </Form>
        </Modal.Footer>
        <Button onClick={getTxStatus}>Get Txn Status</Button>
      </Modal>
    </>
  );
}
