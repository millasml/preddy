import React from "react";
import "./market.scss";
import MarketDetail from "../containers/market_detail";

export default (props) => {
  return (
    <div className="market">
      <MarketDetail address={props.match.params.address} />
    </div>
  );
};
