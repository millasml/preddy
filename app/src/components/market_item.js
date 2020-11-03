import React, { useEffect, useState } from "react";
import { DrizzleContext } from "@drizzle/react-plugin";

import "./market_item.scss";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import ListGroupItem from "react-bootstrap/ListGroupItem";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default (props) => {
  return (
    <DrizzleContext.Consumer>
      {(drizzleContext) => {
        const { drizzle, drizzleState, initialized } = drizzleContext;

        if (!initialized) {
          return "Loading...";
        }
        return (
          <MarketItem
            {...props}
            drizzle={drizzle}
            drizzleState={drizzleState}
          />
        );
      }}
    </DrizzleContext.Consumer>
  );
};

function MarketItem(props) {
  const { drizzle, drizzleState } = props;

  const [contract, setContract] = useState(null);

  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [resolutionTimestamp, setResolutionTimestamp] = useState(0);

  useEffect(() => {
    if (!contract) {
      const contract = drizzle.contracts[props.address];
      setContract(contract);
    }
  }, [drizzleState]);

  useEffect(() => {
    if (contract) {
      const questionKey = contract.methods["question"].cacheCall();
      const descriptionKey = contract.methods["description"].cacheCall();
      const resolutionTimestampKey = contract.methods[
        "resolutionTimestamp"
      ].cacheCall();
      const arbiterKey = contract.methods["arbiter"].cacheCall();

      const currentContractState = drizzleState.contracts[props.address];

      if (currentContractState.question[questionKey]) {
        setQuestion(currentContractState.question[questionKey].value);
      }
      if (currentContractState.description[descriptionKey]) {
        setDescription(currentContractState.description[descriptionKey].value);
      }
      if (currentContractState.resolutionTimestamp[resolutionTimestampKey]) {
        setResolutionTimestamp(
          currentContractState.resolutionTimestamp[resolutionTimestampKey].value
        );
      }
    }
  }, [contract, drizzleState]);

  const getFormattedDate = (timeInSeconds) => {
    console.log(timeInSeconds);
    const dateObject = new Date(timeInSeconds * 1000);
    return dateObject.toDateString();
  };

  return (
    <ListGroupItem className="market-item">
      <Container>
        <Row>
          <Col>
            <Row>
              <Col>
                <div className="market-item-title">{question}</div>
              </Col>
            </Row>
            <Row>
              <Col className="market-item-description">{description}</Col>
            </Row>
            <Row>
              <Col>{getFormattedDate(resolutionTimestamp)}</Col>
            </Row>
          </Col>
          <Col xs={1} className="see-more align-middle">
            <FontAwesomeIcon icon={faChevronRight} />
          </Col>
        </Row>
      </Container>
    </ListGroupItem>
  );
}
