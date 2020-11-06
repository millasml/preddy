import React from "react";

import "./footer.scss";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function Footer(props) {
  return (
    <footer className="footer">
      <Container className="content">
        <Row>
          <Col>
            <h1>About</h1>
            <p>
              Preddy is your go to prediction market. Made for the blockchain
              module in NTU
            </p>
          </Col>
          <Col>
            <h1>Contact Us</h1>
            <p>
              <FontAwesomeIcon icon={faEnvelope} /> do-not-contact@gmail.com
            </p>
            {process.env.REACT_APP_DEBUG === "true" && (
              <Badge variant="warning">debug mode on</Badge>
            )}
          </Col>
        </Row>
        <Row className="text-center">
          <p>Copyright © 2020 All Rights Reserved |</p>&nbsp;
          <span className="header-font">preddy 2020</span>
        </Row>
      </Container>
    </footer>
  );
}
