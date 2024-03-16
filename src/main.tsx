import React from "react";
import ReactDOM from "react-dom/client";

import { unstable_HistoryRouter as HistoryBrowserRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import App from "./App";
export const history: any = createBrowserHistory();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HistoryBrowserRouter history={history}>
      <App />
    </HistoryBrowserRouter>
  </React.StrictMode>
);
