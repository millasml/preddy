import React, { useState } from "react";

import Button from "react-bootstrap/Button";

import "./new_market.scss";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import ModalFooter from "react-bootstrap/ModalFooter";

export default function AddRecurringEntry(props) {
  const [entryName, setEntryName] = useState(null);
  const [entryCost, setEntryCost] = useState(null);
  const [entryStartDate, setEntryStartDate] = useState(null);
  const [entryEndDate, setEntryEndDate] = useState(null);
  const [entryCategory, setEntryCategory] = useState(null);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(
          entryName,
          entryCost,
          entryCategory,
          entryStartDate,
          entryEndDate
        );
      }}
      className="new-market-form"
    >
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Question</Form.Label>
          <FormControl
            placeholder="Item"
            aria-label="Item"
            onChange={(event) => setEntryName(event.target.value)}
            required
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Description</Form.Label>
          <FormControl
            placeholder="Item"
            aria-label="Item"
            onChange={(event) => setEntryName(event.target.value)}
            required
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Options</Form.Label>
          <FormControl
            placeholder="Item"
            aria-label="Item"
            onChange={(event) => setEntryName(event.target.value)}
            required
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Expiry Date</Form.Label>
          <Form.Control
            placeholder="Date"
            aria-label="Date"
            type="date"
            onChange={(event) => setEntryStartDate(event.target.value)}
            max={entryEndDate}
            required
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Arbiter</Form.Label>
          <FormControl
            placeholder="Item"
            aria-label="Item"
            onChange={(event) => setEntryName(event.target.value)}
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
