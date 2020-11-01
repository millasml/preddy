import React from "react";

import "./layout.scss";

import { DrizzleContext } from "@drizzle/react-plugin";

import Header from "../containers/header";
import Footer from "../containers/footer";

export default function Layout(props) {
  return (
    <div className="layout">
      <Header />
      <div className="content">{props.children}</div>
      <Footer />
    </div>
  );
}
