import React, { useState, useEffect } from "react";

import { DrizzleContext } from "@drizzle/react-plugin";
import Market from "../contracts/Market.json";
import { web3 } from "../drizzleOptions";
import "./market_list.scss";

import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import MarketItem from "../components/market_item";

import NoMarketsPic from "../assets/undraw_No_data_re_kwbl.svg";

export default (props) => {
  return (
    <DrizzleContext.Consumer>
      {(drizzleContext) => {
        const { drizzle, drizzleState, initialized } = drizzleContext;

        if (!initialized) {
          return "Loading...";
        }
        return (
          <MarketList
            {...props}
            drizzle={drizzle}
            drizzleState={drizzleState}
          />
        );
      }}
    </DrizzleContext.Consumer>
  );
};

function MarketList(props) {
  const { drizzle, drizzleState } = props;
  const [allMarketAddresses, setAllMarketAddresses] = useState([]);
  const [dataKey, setDataKey] = useState(null);

  useEffect(() => {
    const contract = drizzle.contracts.MarketManager;
    if (contract) {
      const _dataKey = contract.methods["getMarkets"].cacheCall({
        gas: 5000000,
      });
      setDataKey(_dataKey);
    }
  }, []);

  useEffect(() => {
    // get the contract state from drizzleState
    if (dataKey) {
      const { MarketManager } = drizzleState.contracts;
      // using the saved `dataKey`, get the variable we're interested in
      const markets = MarketManager.getMarkets[dataKey];
      if (markets) {
        setAllMarketAddresses(markets.value);
      }
    }
  }, [dataKey, drizzleState]);

  useEffect(() => {
    allMarketAddresses.forEach((address) => {
      try {
        const contractConfig = {
          contractName: address,
          web3Contract: new web3.eth.Contract(Market.abi, address),
        };
        drizzle.addContract(contractConfig);
      } catch (error) {
        console.log(error);
      }
    });
  }, [allMarketAddresses]);

  return (
    <Card>
      <Card.Title>Markets</Card.Title>
      <ListGroup variant="flush">
        {allMarketAddresses.length > 0 ? (
          allMarketAddresses.map((market, index) => {
            return <MarketItem address={market} key={index} />;
          })
        ) : (
          <div className="text-center m-5">
            <Image src={NoMarketsPic} />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <h1>No Markets Available. Open a new one</h1>
            <br />
            <br />
          </div>
        )}
      </ListGroup>
    </Card>
  );
}
