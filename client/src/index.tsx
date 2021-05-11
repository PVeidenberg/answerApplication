import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";

import "./index.scss";
import { App } from "./App";
import { Theme } from "./components/Theme/Theme";

ReactDOM.render(
  <React.StrictMode>
    <Theme>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </Theme>
  </React.StrictMode>,
  document.getElementById("app"),
);
