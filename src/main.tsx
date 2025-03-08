import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { ClerkProvider } from "./components/ClerkProvider";
import { applyPerformancePatch } from "./lib/performance-patch";

// Apply performance patch to fix DataCloneError
applyPerformancePatch();

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider>
      <ThemeProvider defaultTheme="light">
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
