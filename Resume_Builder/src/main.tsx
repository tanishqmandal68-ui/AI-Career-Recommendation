import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

const rootEl = document.getElementById("root");

if (!rootEl) {
  document.body.innerHTML =
    "<p style='padding:2rem;font-family:sans-serif'>App failed to load: missing #root</p>";
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <HashRouter>
          <App />
        </HashRouter>
      </ErrorBoundary>
    </StrictMode>,
  );
}
