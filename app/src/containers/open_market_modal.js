import React, { useState } from "react";

import "./open_market_modal.scss";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import NewMarketForm from "../components/new_market";

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
          <Modal.Title>Create New Market</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewMarketForm onClose={handleClose} />
        </Modal.Body>
      </Modal>
    </>
  );
}
