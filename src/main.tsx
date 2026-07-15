import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { CatalogProvider } from "./data/catalogContext";
import { LibraryProvider } from "./lib/libraryContext";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CatalogProvider>
        <LibraryProvider>
          <App />
        </LibraryProvider>
      </CatalogProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
