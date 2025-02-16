import ErrorBoundary from "./components/ErrorBoundary";
import { ErrorLoader } from "./components/ErrorLoader";
import AccountList from "./pages/AccountList";
import CharAssetList from "./pages/AssetList";
import PingAssets from "./pages/AssetPingMenu";
import CharAssets from "./pages/Assets";
import AuditAdmin from "./pages/AuditAdmin";
import CharacterAudit from "./pages/CharacterAudit";
import CharacterMiningLedger from "./pages/CharacterMiningLedge";
import CharClones from "./pages/Clones";
import CharContacts from "./pages/Contacts";
import CharContracts from "./pages/Contracts";
import CharDoctrines from "./pages/Doctrines";
import CharHistory from "./pages/History";
import CharLoyaltyPoints from "./pages/LoyaltyPonts";
import CharMail from "./pages/Mail";
import CharMarket from "./pages/Market";
import CharNotifications from "./pages/Notifications";
import PubData from "./pages/PubData";
import CharRoles from "./pages/Roles";
import CharSkillQueue from "./pages/SkillQueue";
import CharSkills from "./pages/Skills";
// import CharSkillQueues from "./pages/SkillQueues";
import CharStatus from "./pages/Status";
import CharWallet from "./pages/Wallet";
import CharWalletActivity from "./pages/WalletActivity";
import "./style.css";
import i18n from "i18next";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import React from "react";
import { render } from "react-dom";
import { initReactI18next } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
  react: {
    useSuspense: false, //   <---- this will do the magic
  },
});

TimeAgo.addDefaultLocale(en);

const queryClient = new QueryClient();

const CorptoolsCharacterView = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <br />
        <Router>
          <Routes>
            <Route path="audit/r_legacy/:characterID/" element={<CharacterAudit />}>
              <Route index element={<Navigate to="account/status" replace />} />
              <Route path="account/status" element={<CharStatus />} />
              <Route path="account/assets" element={<CharAssets />} />
              <Route path="account/listassets" element={<CharAssetList />} />
              <Route path="account/pubdata" element={<PubData />} />
              <Route path="account/clones" element={<CharClones />} />
              <Route path="account/roles" element={<CharRoles />} />
              <Route path="account/wallet" element={<CharWallet />} />
              <Route path="account/mail" element={<CharMail />} />
              <Route path="account/walletactivity" element={<CharWalletActivity />} />
              <Route path="account/history" element={<CharHistory />} />
              <Route path="account/mining" element={<CharacterMiningLedger />} />
              <Route path="account/notifications" element={<CharNotifications />} />
              <Route path="account/contact" element={<CharContacts />} />
              <Route path="account/contract" element={<CharContracts />} />
              <Route path="account/skills" element={<CharSkills />} />
              <Route path="account/skillqueue" element={<CharSkillQueue />} />
              <Route path="account/doctrines" element={<CharDoctrines />} />
              <Route path="account/market" element={<CharMarket />} />
              <Route path="account/standings" element={<ErrorLoader />} />
              <Route path="account/list" element={<AccountList />} />
              <Route path="account/lp" element={<CharLoyaltyPoints />} />
              <Route path="ping/assets" element={<PingAssets />} />
            </Route>
            {/* if no route re-route to the main page, this is mainly for dev work */}
            <Route path="*" element={<Navigate to="audit/r_legacy/0" replace />} />
            <Route path="audit/admin/" element={<AuditAdmin />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};
console.log("Loaded");
const appDiv = document.getElementById("root");
render(<CorptoolsCharacterView />, appDiv);
