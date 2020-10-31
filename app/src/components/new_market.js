import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";

import "./new_market.scss";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import ModalFooter from "react-bootstrap/ModalFooter";
import BetOptions from "./bet_options";

export default function AddNewMarket(props) {
  const [question, setQuestion] = useState(null);
  const [description, setDescription] = useState(null);
  const [outcomes, setOutcomes] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [arbiter, setArbiter] = useState(null);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(question, description, outcomes, expiryDate, arbiter);
        props.onClose();
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
    </Form>
  );
}
