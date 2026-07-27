import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import i18n from "i18next";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { afterEach } from "vitest";
import { initReactI18next } from "react-i18next";

// Mirrors the same call in App.tsx - react-time-ago (used by TimeTill and
// friends) throws "No locale data has been registered" without it, and that
// module-level call in App.tsx never runs when a test imports a component
// directly instead of the whole app.
TimeAgo.addDefaultLocale(en);

// vitest.config's `test` block doesn't set `globals: true` (keeping
// describe/it/expect explicit imports everywhere), so @testing-library/react's
// own auto-cleanup - which hooks a global `afterEach` - never registers.
// Without this, unmounted components from a previous test stay in the DOM
// and leak into the next test's queries.
afterEach(() => cleanup());

// Components call useTranslation() directly (no test-local provider), so a
// bare i18n instance needs to exist before any of them render - otherwise
// react-i18next throws "You will need to pass in an i18next instance".
// No resources/backend needed: with none loaded, t(key) just returns the
// key itself, which is exactly the English source text used throughout.
i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {},
  interpolation: { escapeValue: false },
});

// jsdom has no layout engine and no ResizeObserver, but @xyflow/react's node
// measuring relies on one to report each node's rendered size - without a
// stub, mounting any ReactFlow tree throws "ResizeObserver is not defined".
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as { ResizeObserver?: unknown }).ResizeObserver ??= ResizeObserverStub;
