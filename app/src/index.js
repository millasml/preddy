import React from "react";
import ReactDOM from "react-dom";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
import Layout from "./containers/layout";
import Main from "./pages/main";
import Market from "./pages/market";

import { BrowserRouter, Switch, Route } from "react-router-dom";

const drizzle = new Drizzle(drizzleOptions);

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <DrizzleContext.Provider drizzle={drizzle}>
          <DrizzleContext.Consumer>
            {(drizzleContext) => {
              const { drizzle, drizzleState, initialized } = drizzleContext;

              if (!initialized) {
                return "Loading...";
              }

              return (
                <Switch>
                  <Route exact path="/" component={Main} />
                  <Route exact path="/market" component={Market} />
                </Switch>
              );
            }}
          </DrizzleContext.Consumer>
        </DrizzleContext.Provider>
      </Layout>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
