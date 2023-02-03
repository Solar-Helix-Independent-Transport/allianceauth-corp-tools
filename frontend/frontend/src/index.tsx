import CharacterAudit from "./pages/char/CharacterAudit";
import CharacterStatus from "./pages/char/CharacterStatus";
import reportWebVitals from "./reportWebVitals";
import React from "react";
import { Card } from "react-bootstrap";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="audit/r/:characterID/" element={<CharacterAudit />}>
            <Route index element={<Navigate to="account/status" replace />} />
            <Route path="account/status" element={<CharacterStatus />} />
            <Route
              path="account/assets"
              element={
                <Card>
                  <Card.Body className="text-center">This is account/assets.</Card.Body>
                </Card>
              }
            />
            <Route
              path="account/listassets"
              element={
                <Card>
                  <Card.Body className="text-center">This is account/listassets.</Card.Body>
                </Card>
              }
            />
            <Route
              path="account/pubdata"
              element={
                <Card>
                  <Card.Body className="text-center">This is account/pubdata.</Card.Body>
                </Card>
              }
            />
            <Route
              path="account/clones"
              element={
                <Card>
                  <Card.Body className="text-center">This is account/clones.</Card.Body>
                </Card>
              }
            />
            <Route
              path="account/roles"
              element={
                <Card>
                  <Card.Body className="text-center">This is account/roles.</Card.Body>
                </Card>
              }
            />
            <Route
              path="account/wallet"
              element={
                <Card>
                  <Card.Body className="text-center">This is account/wallet.</Card.Body>
                </Card>
              }
            />
            <Route
              path="account/mail"
              element={
                <Card>
                  <Card.Body className="text-center">This is account/mail.</Card.Body>
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
            <Route
              path="account/notifications"
              element={
                <Card>
                  <Card.Body className="text-center">This is account/notifications.</Card.Body>
                </Card>
              }
            />
            <Route
              path="account/contact"
              element={
                <Card>
                  <Card.Body className="text-center">This is account/contact.</Card.Body>
                </Card>
              }
            />
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
          <Route path="*" element={<Navigate to="audit/r/0" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
