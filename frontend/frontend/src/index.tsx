import CharacterAudit from "./pages/char/CharacterAudit";
import reportWebVitals from "./reportWebVitals";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <br />
      <Router>
        <Routes>
          <Route path="audit/r/:characterID/" element={<CharacterAudit />}>
            <Route index element={<Navigate to="account/status" replace />} />
            <Route path="account/status" element={<p></p>} />
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
