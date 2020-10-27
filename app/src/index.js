import React from "react";
import ReactDOM from "react-dom";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";

import Main from "./pages/main";

const drizzle = new Drizzle(drizzleOptions);

function App() {
  return (
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
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
