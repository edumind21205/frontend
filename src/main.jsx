import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// import { Provider } from "./components/ui/provider";
import "./index.css"; // Adjust the path as necessary
// import store from "./redux/store";

import App from "./App";
import ThemeProvider from "./lib/theme-provider";

// Ensure the root element exists in your index.html
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element with id 'root' not found in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="eduminds-theme">
        <HashRouter>
          <App />
          <ToastContainer />
        </HashRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
