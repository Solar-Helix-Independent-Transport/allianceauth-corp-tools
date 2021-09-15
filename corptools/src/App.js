import React from "react";
import { render } from "react-dom";
import CharHeader from "./components/CharHeader";
import CharMenu from "./components/CharMenu";
import { Col } from "react-bootstrap";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import CharStatus from "./pages/Status";
import Clones from "./pages/Clones";
import PubData from "./pages/PubData";
import CharAssets from "./pages/Asssets";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const character_id = window.location.pathname.split("/")[3];

const CorptoolsCharacterView = () => {
  console.log(character_id);
  return (
    <QueryClientProvider client={queryClient}>
      <CharHeader character_id={character_id}></CharHeader>
      <CharMenu character_id={character_id}></CharMenu>
      <Router>
        <Col>
          <Switch>
            <Route
              path="/account/status"
              component={() => CharStatus({ character_id })}
            />
            <Route
              path="/account/assets"
              component={() => CharAssets({ character_id })}
            />
            <Route
              path="/account/pubdata"
              component={() => PubData({ character_id })}
            />
            <Route
              path="/account/clones"
              component={() => Clones({ character_id })}
            />
          </Switch>
        </Col>
      </Router>
    </QueryClientProvider>
  );
};

const appDiv = document.getElementById("app");
render(<CorptoolsCharacterView />, appDiv);
