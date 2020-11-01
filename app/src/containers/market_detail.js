import React from "react";

import "./market_detail.scss";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import ResolveModal from "./resolve_modal";
import NewBetModal from "./new_bet_modal";

export default function MarketDetail(props) {
  return (
    <Container className="market-detail">
      <Card>
        <Card.Title>{props.question}</Card.Title>
        <Card.Subtitle>{props.description}</Card.Subtitle>
        <br />
        <Row>
          <Col className="text-center">
            <h6>Closing Date</h6>
            {new Date(props.endDate).toDateString()}
          </Col>
          <Col className="text-center">
            <h6>Time Remaining</h6>
            {Math.floor(
              (props.endDate - Date.now()) / (1000 * 60 * 60 * 24)
            )}{" "}
            Days Left
          </Col>
          <Col className="text-center">
            <Badge className="status">{props.isOpen ? "OPEN" : "CLOSED"}</Badge>
          </Col>
        </Row>
      </Card>
      {props.isOpen && (
        <Card>
          <Row>
            <Col xs={4} className="text-center">
              <h6>Arbiter</h6>
              {props.arbiter}
            </Col>
            <Col>Are you the arbiter? If so, you can resolve this market.</Col>
            <Col>
              <ResolveModal
                outcomes={props.voteDetails.map(
                  (possibility) => possibility.outcome
                )}
                title={props.question}
              >
                <Button>Resolve</Button>
              </ResolveModal>
            </Col>
          </Row>
        </Card>
      )}

      <Card>
        <Card.Title>Outcome and Probabilites</Card.Title>
        <ListGroup variant="flush">
          {props.voteDetails.map((possibility) => {
            return (
              <ListGroup.Item>
                <Row>
                  <Col>{possibility.outcome}</Col>
                  <Col>
                    <ProgressBar
                      animated
                      variant="success"
                      now={possibility.percentage * 100}
                      label={`${possibility.percentage * 100}%`}
                    />
                  </Col>
                  <Col xs={1}>
                    <NewBetModal outcome={possibility.outcome}>
                      <Button>Bet</Button>
                    </NewBetModal>
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Card>
    </Container>
  );
}
