import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";

import React from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";
import CharStatus from "./pages/Status";
import CharClones from "./pages/Clones";
import PubData from "./pages/PubData";
import CharAssets from "./pages/Assets";
import CharAssetList from "./pages/AssetList";
import { QueryClient, QueryClientProvider } from "react-query";
import CharRoles from "./pages/Roles";
import CharWallet from "./pages/Wallet";
import CharWalletActivity from "./pages/WalletActivity";
import CharNotifications from "./pages/Notifications";
import CharContacts from "./pages/Contacts";
import CharSkills from "./pages/Skills";
import AccountList from "./pages/AccountList";
import "./style.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { ErrorLoader } from "./components/ErrorLoader";
import CharSkillQueue from "./pages/SkillQueue";
import CharDoctrines from "./pages/Doctrines";
import PingAssets from "./pages/AssetPingMenu";
import CharMarket from "./pages/Market";
import CharacterAudit from "./pages/CharacterAudit";
TimeAgo.addDefaultLocale(en);

const queryClient = new QueryClient();

const CorptoolsCharacterView = () => {
  const url_char_id = window.location.pathname.split("/")[3]
    ? window.location.pathname.split("/")[3]
    : 0;

  console.log(url_char_id);
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <br />
        <Router>
          <Routes>
            <Route path="audit/r/:characterID/" element={<CharacterAudit />}>
              <Route index element={<Navigate to="account/status" replace />} />
              <Route index path="account/status" element={<CharStatus />} />
              <Route path="account/assets" element={<CharAssets />} />
              <Route path="account/listassets" element={<CharAssetList />} />
              <Route path="account/pubdata" element={<PubData />} />
              <Route path="account/clones" element={<CharClones />} />
              <Route path="account/roles" element={<CharRoles />} />
              <Route path="account/wallet" element={<CharWallet />} />
              <Route
                path="account/walletactivity"
                element={<CharWalletActivity />}
              />
              <Route
                path="account/notifications"
                element={<CharNotifications />}
              />
              <Route path="account/contact" element={<CharContacts />} />
              <Route path="account/skills" element={<CharSkills />} />
              <Route path="account/skillqueue" element={<CharSkillQueue />} />
              <Route path="account/doctrines" element={<CharDoctrines />} />
              <Route path="account/market" element={<CharMarket />} />
              <Route path="account/standings" element={<ErrorLoader />} />
              <Route path="account/list" element={<AccountList />} />
              <Route path="ping/assets" element={<PingAssets />} />
            </Route>
            {/* if no route re-route to the main page, this is mainly for dev work */}
            <Route path="*" element={<Navigate to="audit/r/0" replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

const appDiv = document.getElementById("root");
render(<CorptoolsCharacterView />, appDiv);
