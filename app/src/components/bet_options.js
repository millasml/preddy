import React, { useState, useEffect } from "react";
import "./bet_options.scss";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Option(props) {
  const [description, setDescription] = useState("");
  const [liquidity, setLiquidity] = useState(0);

  useEffect(() => {
    props.onChange({ description, liquidity });
  }, [description, liquidity]);

  return (
    <Form.Group as={InputGroup}>
      <FormControl
        placeholder="Option description"
        aria-label="question"
        onChange={(event) => setDescription(event.target.value)}
        required
      />
      <FormControl
        placeholder="initial liquidity"
        aria-label="liquidity"
        type="number"
        onChange={(event) => setLiquidity(event.target.value)}
        required
      />
      <InputGroup.Append>
        <Button onClick={props.onDelete}>
          <FontAwesomeIcon icon={faMinus} />
        </Button>
      </InputGroup.Append>
    </Form.Group>
  );
}

export default function BetOptions(props) {
  const [options, setOptions] = useState([{}, {}]);

  useEffect(() => {
    props.updateOutcomes(options);
  }, [options, props]);

  const addOption = () => {
    const newOptions = [...options];
    newOptions.push("");
    setOptions(newOptions);
  };

  const removeOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const editOption = (index, change) => {
    const newOptions = [...options];
    newOptions[index] = change;
    setOptions(newOptions);
  };

  return (
    <div className="bet-options">
      {options.map((option, index) => {
        return (
          <Option
            onDelete={() => {
              removeOption(index);
            }}
            onChange={(change) => {
              editOption(index, change);
            }}
          />
        );
      })}
      <Row>
        <Col className="add-option">
          <Button onClick={addOption}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Col>
      </Row>
    </div>
  );
}
