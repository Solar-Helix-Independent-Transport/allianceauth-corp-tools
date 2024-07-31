import CharacterAssets from "./Pages/Char/CharacterAssetsList";
import CharacterAudit from "./Pages/Char/CharacterAudit";
import CharacterClones from "./Pages/Char/CharacterClones";
import CharacterContacts from "./Pages/Char/CharacterContacts";
import CharacterNotifications from "./Pages/Char/CharacterNotifications";
import CharacterOverview from "./Pages/Char/CharacterOverview";
import CharacterPubData from "./Pages/Char/CharacterPubData";
import CharacterRoles from "./Pages/Char/CharacterRoles";
import CharacterStatus from "./Pages/Char/CharacterStatus";
import CharacterWallet from "./Pages/Char/CharacterWallet";
import CorporationAtAGlance from "./Pages/Corp/AtAGlance";
import CorporationAudit from "./Pages/Corp/Audit";
import Structures from "./Pages/Corp/Structures";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import React from "react";
import { Card } from "react-bootstrap";
import { QueryClient, QueryClientProvider } from "react-query";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

TimeAgo.addDefaultLocale(en);

const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="audit/r_beta/:characterID/" element={<CharacterAudit />}>
              <Route index element={<Navigate to="account/overview" replace />} />
              <Route path="account/overview" element={<CharacterOverview />} />
              <Route path="account/status" element={<CharacterStatus />} />
              <Route
                path="account/assets"
                element={
                  <Card>
                    <Card.Body className="text-center">This is account/assets.</Card.Body>
                  </Card>
                }
              />
              <Route path="account/listassets" element={<CharacterAssets />} />
              <Route path="account/pubdata" element={<CharacterPubData />} />
              <Route path="account/clones" element={<CharacterClones />} />
              <Route path="account/roles" element={<CharacterRoles />} />
              <Route path="account/wallet" element={<CharacterWallet />} />
              <Route
                path="account/mail"
                element={
                  <Card>
                    <Card.Body className="text-center">This is account/mail.</Card.Body>
                  </Card>
                }
              />
              <Route
                path="account/mining"
                element={
                  <Card>
                    <Card.Body className="text-center">This is account/mining.</Card.Body>
                  </Card>
                }
              />
              <Route
                path="account/lp"
                element={
                  <Card>
                    <Card.Body className="text-center">This is account/lp.</Card.Body>
                  </Card>
                }
              />
              <Route
                path="account/walletactivity"
                element={
                  <Card>
                    <Card.Body className="text-center">This is account/walletactivity.</Card.Body>
                  </Card>
                }
              />
              <Route path="account/notifications" element={<CharacterNotifications />} />
              <Route path="account/contact" element={<CharacterContacts />} />
              <Route
                path="account/contract"
                element={
                  <Card>
                    <Card.Body className="text-center">This is account/contract.</Card.Body>
                  </Card>
                }
              />
              <Route
                path="account/skills"
                element={
                  <Card>
                    <Card.Body className="text-center">This is account/skills.</Card.Body>
                  </Card>
                }
              />
              <Route
                path="account/skillqueue"
                element={
                  <Card>
                    <Card.Body className="text-center">This is account/skillqueue.</Card.Body>
                  </Card>
                }
              />
              <Route
                path="account/doctrines"
                element={
                  <Card>
                    <Card.Body className="text-center">This is account/doctrines.</Card.Body>
                  </Card>
                }
              />
              <Route
                path="account/market"
                element={
                  <Card>
                    <Card.Body className="text-center">This is account/market.</Card.Body>
                  </Card>
                }
              />
              <Route
                path="account/standings"
                element={
                  <Card>
                    <Card.Body className="text-center">This is account/standings.</Card.Body>
                  </Card>
                }
              />
              <Route
                path="account/list"
                element={
                  <Card>
                    <Card.Body className="text-center">This is account/list.</Card.Body>
                  </Card>
                }
              />
            </Route>
            <Route path="audit/r_beta/corp/" element={<CorporationAudit />}>
              <Route index element={<Navigate to="glance" replace />} />
              <Route
                path="corporations"
                element={
                  <Card>
                    <Card.Body className="text-center">This is Corp List.</Card.Body>
                  </Card>
                }
              />
              <Route path="glance" element={<CorporationAtAGlance />} />
              <Route path="structures" element={<Structures />} />
              <Route
                path="wallets"
                element={
                  <Card>
                    <Card.Body className="text-center">This is wallets.</Card.Body>
                  </Card>
                }
              />
              <Route
                path="assetgroup"
                element={
                  <Card>
                    <Card.Body className="text-center">This is assetgroup.</Card.Body>
                  </Card>
                }
              />
              <Route
                path="assetlist"
                element={
                  <Card>
                    <Card.Body className="text-center">This is assetlist.</Card.Body>
                  </Card>
                }
              />
              <Route
                path="pocos"
                element={
                  <Card>
                    <Card.Body className="text-center">This is pocos.</Card.Body>
                  </Card>
                }
              />
              <Route
                path="bridges"
                element={
                  <Card>
                    <Card.Body className="text-center">This is bridges.</Card.Body>
                  </Card>
                }
              />
              <Route
                path="sov"
                element={
                  <Card>
                    <Card.Body className="text-center">This is sov.</Card.Body>
                  </Card>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="audit/r_beta/0" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
