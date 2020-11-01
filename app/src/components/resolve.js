import React, { useState } from "react";

import Button from "react-bootstrap/Button";

import "./new_market.scss";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import ModalFooter from "react-bootstrap/ModalFooter";

export default function Resolve(props) {
  const [address, setAddress] = useState(null);
  const [resolution, setResolution] = useState(null);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(resolution);
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
          <Form.Label>Resolution</Form.Label>
          <Form.Control
            as="select"
            onChange={(event) => setResolution(event.target.value)}
            required
          >
            {props.outcomes.map((outcome) => (
              <option>{outcome}</option>
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
    </Form>
  );
}
