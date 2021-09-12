import React from "react";
import { render } from "react-dom";
import CharHeader from "./components/CharHeader";
import CharMenu from "./components/CharMenu";
import { Col } from "react-bootstrap";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import CharStatus from "./pages/Status";
const CorptoolsCharacterView = () => {

  const character_id = window.location.pathname.split("/")[3]
  console.log(character_id)
  return (
    <Router>
      <CharHeader char={character_id}></CharHeader>
      <CharMenu char={character_id}></CharMenu>
      <Col>
        <Switch>
          <Route path="/character/status" component={CharStatus} />
          <Route path="/character/assets" component={Assets} />
          <Route path="/character/pubdata" component={PublicData} />
        </Switch>
      </Col>
    </Router>
  );
};

function PublicData() {
  return <>Public Data</>;
}
function Assets() {
  return <>Assets</>;
}

const appDiv = document.getElementById("app");
render(<CorptoolsCharacterView />, appDiv);
