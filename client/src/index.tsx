import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { App } from "./App";
import { Theme } from "./components/Theme/Theme";
import { RecoilRoot } from "recoil";

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
