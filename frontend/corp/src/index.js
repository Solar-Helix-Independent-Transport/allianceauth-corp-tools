import CorpMenu from "./components/CorpMenu";
import CorpAssetLists from "./pages/AssetList";
import CorpAssets from "./pages/Assets";
import { Bridges } from "./pages/Bridges";
import { CorpPocos } from "./pages/Pocos";
import { Sov } from "./pages/Sov";
import CorpStatus from "./pages/Status";
import { CorpStructures } from "./pages/Structures";
import CorpWallet from "./pages/Wallets";
import reportWebVitals from "./reportWebVitals";
import "./style.css";
import React from "react";
import { Panel } from "react-bootstrap";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, HashRouter as Router, Switch } from "react-router-dom";

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <br />
        <CorpMenu />
        <Panel bsStyle="default">
          <Switch>
            <Route exact path={["", "/structures"]} component={() => CorpStructures()} />
            <Route path={"/wallets"} component={() => CorpWallet()} />
            <Route path={"/pocos"} component={() => CorpPocos()} />
            <Route path={"/status"} component={() => CorpStatus()} />
            <Route path={"/assetgroup"} component={() => CorpAssets()} />
            <Route path={"/assetlist"} component={() => CorpAssetLists()} />
            <Route path={"/bridges"} component={() => Bridges()} />
            <Route path={"/sov"} component={() => Sov()} />
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
