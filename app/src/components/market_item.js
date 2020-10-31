import React from "react";

import "./market_item.scss";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import ListGroupItem from "react-bootstrap/ListGroupItem";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MarketItem(props) {
  return (
    <ListGroupItem className="market-item">
      <Container>
        <Row>
          <Col>
            <Row>
              <Col>
                <div className="market-item-title">{props.question}</div>
              </Col>
            </Row>
            <Row>
              <Col className="market-item-description">{props.description}</Col>
            </Row>
            <Row>
              <Col>{props.endDate}</Col>
              <Col>{props.voteSummary}</Col>
              <Col>{props.stakes}</Col>
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
