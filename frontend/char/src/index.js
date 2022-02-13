import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";

import React from "react";
import { render } from "react-dom";
import CharHeader from "./components/CharHeader";
import CharMenu from "./components/CharMenu";
import { Col } from "react-bootstrap";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import CharStatus from "./pages/Status";
import CharClones from "./pages/Clones";
import PubData from "./pages/PubData";
import CharAssets from "./pages/Assets";
import CharAssetList from "./pages/AssetList";
import { QueryClient, QueryClientProvider } from "react-query";
import { Panel } from "react-bootstrap";
import CharRoles from "./pages/Roles";
import CharWallet from "./pages/Wallet";
import CharNotifications from "./pages/Notifications";
import CharContacts from "./pages/Contacts";
import "./style.css";
TimeAgo.addDefaultLocale(en);

const queryClient = new QueryClient();

const character_id = window.location.pathname.split("/")[3]
  ? window.location.pathname.split("/")[3]
  : 0;

const CorptoolsCharacterView = () => {
  console.log(character_id);

  return (
    <QueryClientProvider client={queryClient}>
      <CharHeader character_id={character_id}></CharHeader>
      <CharMenu character_id={character_id}></CharMenu>
      <Router>
        <Col>
          <Panel>
            <Switch>
              <Route
                exact
                path={["", "/account/status"]}
                component={() => CharStatus({ character_id })}
              />
              <Route
                path="/account/assets"
                component={() => CharAssets({ character_id })}
              />
              <Route
                path="/account/listassets"
                component={() => CharAssetList({ character_id })}
              />
              <Route
                path="/account/pubdata"
                component={() => PubData({ character_id })}
              />
              <Route
                path="/account/clones"
                component={() => CharClones({ character_id })}
              />
              <Route
                path="/account/roles"
                component={() => CharRoles({ character_id })}
              />
              <Route
                path="/account/wallet"
                component={() => CharWallet({ character_id })}
              />
              <Route
                path="/account/notifications"
                component={() => CharNotifications({ character_id })}
              />
              <Route
                path="/account/contacts"
                component={() => CharContacts({ character_id })}
              />
            </Switch>
          </Panel>
        </Col>
      </Router>
    </QueryClientProvider>
  );
};

const appDiv = document.getElementById("root");
render(<CorptoolsCharacterView />, appDiv);
