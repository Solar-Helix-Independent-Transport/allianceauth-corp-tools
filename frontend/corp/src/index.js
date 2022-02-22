import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { CorpStructures } from "./pages/Structures";
import { QueryClient, QueryClientProvider } from "react-query";
import { Panel } from "react-bootstrap";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { ErrorLoader } from "./components/ErrorLoader";
import CorpMenu from "./components/CorpMenu";
import CorpStatus from "./pages/Status";
import "./style.css";
const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <br />
        <CorpMenu />
        <Panel bsStyle="default">
          <Switch>
            <Route
              exact
              path={["", "/structures"]}
              component={() => CorpStructures()}
            />
            <Route path={"/wallets"} component={() => ErrorLoader()} />
            <Route path={"/status"} component={() => CorpStatus()} />
            <Route path={"/assets"} component={() => ErrorLoader()} />
          </Switch>
        </Panel>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
