import { Link } from "react-router-dom";
import React from "react";

import "./header.scss";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

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
            <Nav.Link>
              <Link to="/privacy-policy">PRIVACY POLICY</Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>
              <Link to="/toc">T&C</Link>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar>
    </header>
  );
}
