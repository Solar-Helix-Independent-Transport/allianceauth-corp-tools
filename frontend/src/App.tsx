import AccountList from "./Pages/Char/AccountList";
import CharacterAssetGroups from "./Pages/Char/AssetsGroups";
import CharacterAssets from "./Pages/Char/AssetsList";
import CharacterAudit from "./Pages/Char/Audit";
import CharacterClones from "./Pages/Char/Clones";
import CharacterContacts from "./Pages/Char/Contacts";
import CharacterContracts from "./Pages/Char/Contracts";
import CharacterDoctrine from "./Pages/Char/Doctrines";
import CharacterLP from "./Pages/Char/LoyaltyPoints";
import CharacterMail from "./Pages/Char/Mail";
import Market from "./Pages/Char/Market";
import CharacterNotifications from "./Pages/Char/Notifications";
import CharacterOverview from "./Pages/Char/Overview";
import CharacterPubData from "./Pages/Char/PubData";
import CharacterRoles from "./Pages/Char/Roles";
import CharacterSkillQueues from "./Pages/Char/SkillQueue";
import CharacterSkills from "./Pages/Char/Skills";
import CharacterStatus from "./Pages/Char/Status";
import CharacterWallet from "./Pages/Char/Wallet";
import CorporationAtAGlance from "./Pages/Corp/AtAGlance";
import CorporationAudit from "./Pages/Corp/Audit";
import Structures from "./Pages/Corp/Structures";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import React from "react";
import { Card } from "react-bootstrap";
import { QueryClient, QueryClientProvider } from "react-query";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import CharacterWalletActivity from "./Pages/Char/WalletActivity";
import CharacterMiningLedger from "./Pages/Char/MiningLedger";
import { ErrorLoader } from "./Components/Loaders/loaders";
import Bridges from "./Pages/Corp/Bridges";
import CorporationAssetGroups from "./Pages/Corp/AssetsGroups";
import CorporationAssets from "./Pages/Corp/AssetsList";
import CorporationWallets from "./Pages/Corp/Wallet";
import CorporationPocos from "./Pages/Corp/Pocos";
import CorporationStatus from "./Pages/Corp/Status";
import CorporationStarbases from "./Pages/Corp/Starbases";
import CorporationMiningLedger from "./Pages/Corp/MiningLedger";
import Dens from "./Pages/Corp/Dens";

TimeAgo.addDefaultLocale(en);

const queryClient = new QueryClient();

i18n
  .use(Backend)
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    detection: {
      order: [
        "htmlTag",
        "querystring",
        "cookie",
        "localStorage",
        "sessionStorage",
        "navigator",
        "path",
        "subdomain",
      ],
      htmlTag: document.getElementById("root"),
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
    react: {
      useSuspense: false, //   <---- this will do the magic
    },
    backend: {
      loadPath: "/static/corptools/i18n/{{lng}}/{{ns}}.json",
    },
  });

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <Router>
            <Routes>
              <Route path="audit/r/:characterID/" element={<CharacterAudit />}>
                <Route index element={<Navigate to="account/overview" replace />} />
                <Route path="account/overview" element={<CharacterOverview />} />
                <Route path="account/status" element={<CharacterStatus />} />
                <Route path="account/assets" element={<CharacterAssetGroups />} />
                <Route path="account/listassets" element={<CharacterAssets />} />
                <Route path="account/pubdata" element={<CharacterPubData />} />
                <Route path="account/clones" element={<CharacterClones />} />
                <Route path="account/roles" element={<CharacterRoles />} />
                <Route path="account/wallet" element={<CharacterWallet />} />
                <Route path="account/mail" element={<CharacterMail />} />
                <Route path="account/mining" element={<CharacterMiningLedger />} />
                <Route path="account/lp" element={<CharacterLP />} />
                <Route path="account/walletactivity" element={<CharacterWalletActivity />} />
                <Route path="account/notifications" element={<CharacterNotifications />} />
                <Route path="account/contact" element={<CharacterContacts />} />
                <Route path="account/contract" element={<CharacterContracts />} />
                <Route path="account/skills" element={<CharacterSkills />} />
                <Route path="account/skillqueue" element={<CharacterSkillQueues />} />
                <Route path="account/doctrines" element={<CharacterDoctrine />} />
                <Route path="account/market" element={<Market />} />
                <Route
                  path="account/standings"
                  element={
                    <Card>
                      <Card.Body className="text-center">This is account/standings.</Card.Body>
                    </Card>
                  }
                />
                <Route path="account/list" element={<AccountList />} />
                <Route
                  path="*"
                  element={
                    <ErrorLoader
                      title="Error 404"
                      message="This is not the path you are looking for! Page not found."
                    />
                  }
                />
              </Route>
              <Route path="audit/r/corp/" element={<CorporationAudit />}>
                <Route index element={<Navigate to="glance" replace />} />
                <Route path="corporations" element={<CorporationStatus />} />
                <Route path="glance" element={<CorporationAtAGlance />} />
                <Route path="structures" element={<Structures />} />
                <Route path="mining" element={<CorporationMiningLedger />} />
                <Route path="wallets" element={<CorporationWallets />} />
                <Route path="assetgroup" element={<CorporationAssetGroups />} />
                <Route path="assetlist" element={<CorporationAssets />} />
                <Route path="pocos" element={<CorporationPocos />} />
                <Route path="starbases" element={<CorporationStarbases />} />
                <Route path="bridges" element={<Bridges />} />
                <Route path="dens" element={<Dens />} />
                {/* <Route path="fuel" element={<Bridges />} /> */}
                {/* <Route
                  path="bridges"
                  element={
                    <Card>
                      <Card.Body className="text-center">This is fuel.</Card.Body>
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
                /> */}
                <Route
                  path="*"
                  element={
                    <ErrorLoader
                      title="Error 404"
                      message="This is not the path you are looking for! Page not found."
                    />
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to="audit/r/0" replace />} />
            </Routes>
          </Router>
        </NuqsAdapter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
