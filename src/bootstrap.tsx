import { StoreProvider } from "easy-peasy";
import * as React from "react";
import * as ReactDOM from "react-dom";
import store from './utils/store'

import App from "./App";

ReactDOM.render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>
  , document.getElementById("app"));