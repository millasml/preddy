import React from "react";
import ReactDOM from "react-dom";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
import Layout from "./containers/layout";
import Main from "./pages/main";

import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";

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

              return <Main drizzle={drizzle} drizzleState={drizzleState} />;
            }}
          </DrizzleContext.Consumer>
        </DrizzleContext.Provider>
      </Layout>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
