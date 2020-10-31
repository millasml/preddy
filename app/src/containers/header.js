import { Link } from "react-router-dom";
import React from "react";

import "./header.scss";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import OpenMarketModal from "./open_market_modal";

export default function Header(props) {
  return (
    <header className="header">
      <Navbar fixed="top">
        <Navbar.Brand>
          <Link to="/">
            <h1>Preddy.</h1>
          </Link>
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Item>
            <Nav.Link>
              <Link to="/about">ABOUT</Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <OpenMarketModal>
              <Button className="open-market-btn">Open Market</Button>
            </OpenMarketModal>
          </Nav.Item>
        </Nav>
      </Navbar>
    </header>
  );
}
