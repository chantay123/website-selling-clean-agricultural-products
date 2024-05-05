import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";

import { unstable_HistoryRouter as HistoryBrowserRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import App from "./App";
export const history: any = createBrowserHistory();
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HistoryBrowserRouter history={history}>
      <App />
      <ToastContainer />
    </HistoryBrowserRouter>
  </React.StrictMode>
);
