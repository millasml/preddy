import React from "react";
import ReactDOM from "react-dom";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle, generateStore } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
import Layout from "./containers/layout";
import Main from "./pages/main";
import Market from "./pages/market";

import { BrowserRouter, Switch, Route } from "react-router-dom";

const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

function App() {
  return (
    <BrowserRouter>
      <DrizzleContext.Provider drizzle={drizzle}>
        <Layout>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/market/:address" component={Market} />
          </Switch>
        </Layout>
      </DrizzleContext.Provider>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
