import React, { useState } from "react";

import Modal from "react-bootstrap/Modal";
import NewBetForm from "../components/new_bet";

export default function OpenMarketModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
        <Modal.Header closeButton>
          <Modal.Title>Place Bet on {props.outcome}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewBetForm onClose={handleClose} outcome={props.outcome} />
        </Modal.Body>
      </Modal>
    </>
  );
}
