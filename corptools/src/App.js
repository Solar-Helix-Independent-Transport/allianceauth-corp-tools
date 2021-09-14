import React from "react";
import { render } from "react-dom";
import CharHeader from "./components/CharHeader";
import CharMenu from "./components/CharMenu";
import { Col } from "react-bootstrap";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import CharStatus from "./pages/Status";
import PubData from "./pages/PubData";
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
            <Route path="/character/status" component={CharStatus} />
            <Route path="/character/assets" component={Assets} />
            <Route path="/character/pubdata" component={PubData} />
          </Switch>
        </Col>
      </Router>
    </QueryClientProvider>
  );
};

function Assets() {
  return <>Assets</>;
}

const appDiv = document.getElementById("app");
render(<CorptoolsCharacterView />, appDiv);
