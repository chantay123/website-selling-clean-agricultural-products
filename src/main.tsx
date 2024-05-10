import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { persistor, store } from "./redux/config";
import { unstable_HistoryRouter as HistoryBrowserRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import App from "./App";
export const history: any = createBrowserHistory();
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <React.StrictMode>
        <HistoryBrowserRouter history={history}>
          <App />
          <ToastContainer />
        </HistoryBrowserRouter>
      </React.StrictMode>
    </PersistGate>
  </Provider>
);
