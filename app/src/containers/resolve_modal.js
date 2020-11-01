import React, { useState } from "react";

import Modal from "react-bootstrap/Modal";
import Resolve from "../components/resolve";

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
          <Modal.Title>Resolve Market</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Resolve the market "{props.title}"
          <Resolve onClose={handleClose} outcomes={props.outcomes} />
        </Modal.Body>
      </Modal>
    </>
  );
}
