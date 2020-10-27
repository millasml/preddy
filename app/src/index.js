import React from "react";
import ReactDOM from "react-dom";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
import * as serviceWorker from "./serviceWorker";
import Sample from "./Sample";

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

          return <Sample drizzle={drizzle} drizzleState={drizzleState} />;
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
