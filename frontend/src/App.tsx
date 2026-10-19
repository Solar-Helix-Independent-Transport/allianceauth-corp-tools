import CharacterAudit from "./Pages/Char/Audit";
import CorporationAudit from "./Pages/Corp/Audit";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import React, { lazy } from "react";
import { Card } from "react-bootstrap";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "./queryClient";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router";
import { NuqsAdapter } from "nuqs/adapters/react-router/v8";

import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { ErrorLoader } from "./Components/Loaders/loaders";
import PageErrorBoundary from "./Components/Helpers/PageErrorBoundary";
import DashAudit from "./Pages/Dash/Audit";

// Each page is its own chunk, loaded when first visited.
const AccountList = lazy(() => import("./Pages/Char/AccountList"));
const CharacterActivityMap = lazy(() => import("./Pages/Char/ActivityMap"));
const CharacterAssetGroups = lazy(() => import("./Pages/Char/AssetsGroups"));
const CharacterAssets = lazy(() => import("./Pages/Char/AssetsList"));
const CharacterClones = lazy(() => import("./Pages/Char/Clones"));
const CharacterContacts = lazy(() => import("./Pages/Char/Contacts"));
const CharacterContracts = lazy(() => import("./Pages/Char/Contracts"));
const CharacterDoctrine = lazy(() => import("./Pages/Char/Doctrines"));
const CharacterFitCheck = lazy(() => import("./Pages/Char/FitCheck"));
const CharacterLP = lazy(() => import("./Pages/Char/LoyaltyPoints"));
const CharacterMail = lazy(() => import("./Pages/Char/Mail"));
const CharacterMercenaryDens = lazy(() => import("./Pages/Char/MercenaryDens"));
const CharacterMercenaryTacticalOperations = lazy(
  () => import("./Pages/Char/MercenaryTacticalOperations"),
);
const Market = lazy(() => import("./Pages/Char/Market"));
const CharacterNotifications = lazy(() => import("./Pages/Char/Notifications"));
const CharacterOverview = lazy(() => import("./Pages/Char/Overview"));
const CharacterPubData = lazy(() => import("./Pages/Char/PubData"));
const CharacterRoles = lazy(() => import("./Pages/Char/Roles"));
const CharacterSkillQueues = lazy(() => import("./Pages/Char/SkillQueue"));
const CharacterSkills = lazy(() => import("./Pages/Char/Skills"));
const CharacterStatus = lazy(() => import("./Pages/Char/Status"));
const CharacterWallet = lazy(() => import("./Pages/Char/Wallet"));
const CorporationAtAGlance = lazy(() => import("./Pages/Corp/AtAGlance"));
const Structures = lazy(() => import("./Pages/Corp/Structures"));
const CharacterWalletActivity = lazy(() => import("./Pages/Char/WalletActivity"));
const CharacterMiningLedger = lazy(() => import("./Pages/Char/MiningLedger"));
const Bridges = lazy(() => import("./Pages/Corp/Bridges"));
const CorporationActivityMap = lazy(() => import("./Pages/Corp/ActivityMap"));
const CorporationAssetGroups = lazy(() => import("./Pages/Corp/AssetsGroups"));
const CorporationAssets = lazy(() => import("./Pages/Corp/AssetsList"));
const CorporationWallets = lazy(() => import("./Pages/Corp/Wallet"));
const CorporationPocos = lazy(() => import("./Pages/Corp/Pocos"));
const CorporationStatus = lazy(() => import("./Pages/Corp/Status"));
const CorporationStarbases = lazy(() => import("./Pages/Corp/Starbases"));
const CorporationMiningLedger = lazy(() => import("./Pages/Corp/MiningLedger"));
const CorporationSovereigntyHubs = lazy(() => import("./Pages/Corp/SovereigntyHubs"));
const CorporationSovereigntyMap = lazy(() => import("./Pages/Corp/SovereigntyMap"));
const Dens = lazy(() => import("./Pages/Corp/Dens"));
const DashSovereigntyMap = lazy(() => import("./Pages/Dash/SovereigntyMap"));

TimeAgo.addDefaultLocale(en);

const queryClient = createQueryClient();

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
  const { t } = useTranslation();
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router>
          <NuqsAdapter>
            {/* Last resort for errors outside a page, e.g. in a menu */}
            <PageErrorBoundary>
              <Routes>
                <Route path="audit/r/:characterID/" element={<CharacterAudit />}>
                  <Route index element={<Navigate to="account/overview" replace />} />
                  <Route path="account/overview" element={<CharacterOverview />} />
                  <Route path="account/status" element={<CharacterStatus />} />
                  <Route path="account/assets" element={<CharacterAssetGroups />} />
                  <Route path="account/listassets" element={<CharacterAssets />} />
                  <Route path="account/activitymap" element={<CharacterActivityMap />} />
                  <Route path="account/pubdata" element={<CharacterPubData />} />
                  <Route path="account/clones" element={<CharacterClones />} />
                  <Route path="account/mercenarydens" element={<CharacterMercenaryDens />} />
                  <Route
                    path="account/mercenarytacticaloperations"
                    element={<CharacterMercenaryTacticalOperations />}
                  />
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
                  <Route path="account/fitcheck" element={<CharacterFitCheck />} />
                  <Route path="account/market" element={<Market />} />
                  <Route
                    path="account/standings"
                    element={
                      <Card>
                        <Card.Body className="text-center">
                          {t("This is account/standings.")}
                        </Card.Body>
                      </Card>
                    }
                  />
                  <Route path="account/list" element={<AccountList />} />
                  <Route
                    path="*"
                    element={
                      <ErrorLoader
                        title={t("Error 404")}
                        message={t("This is not the path you are looking for! Page not found.")}
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
                  <Route path="activitymap" element={<CorporationActivityMap />} />
                  <Route path="pocos" element={<CorporationPocos />} />
                  <Route path="starbases" element={<CorporationStarbases />} />
                  <Route path="bridges" element={<Bridges />} />
                  <Route path="dens" element={<Dens />} />
                  <Route path="sovhubs" element={<CorporationSovereigntyHubs />} />
                  <Route path="sovmap" element={<CorporationSovereigntyMap />} />
                  {/* <Route path="fuel" element={<Bridges />} /> */}
                  <Route
                    path="*"
                    element={
                      <ErrorLoader
                        title={t("Error 404")}
                        message={t("This is not the path you are looking for! Page not found.")}
                      />
                    }
                  />
                </Route>
                <Route path="audit/r/dash/" element={<DashAudit />}>
                  <Route index element={<Navigate to="sovmap" replace />} />
                  <Route path="sovmap" element={<DashSovereigntyMap />} />
                  <Route
                    path="*"
                    element={
                      <ErrorLoader
                        title={t("Error 404")}
                        message={t("This is not the path you are looking for! Page not found.")}
                      />
                    }
                  />
                </Route>
                <Route path="*" element={<Navigate to="audit/r/0" replace />} />
              </Routes>
            </PageErrorBoundary>
          </NuqsAdapter>
        </Router>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
