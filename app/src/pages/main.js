import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import "./main.scss";
import MarketList from "../containers/market_list";

const { AccountData, ContractData, ContractForm } = newContextComponents;

export default ({ drizzle, drizzleState }) => {
  return (
    <div className="main">
      <MarketList></MarketList>
    </div>
  );
};
