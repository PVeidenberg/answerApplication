import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { App } from "./App";
import { connect } from "./services/socket";

if (process.env.NODE_ENV === "development") {
  // force sync request to server to create session cookie for socket.io
  const oReq = new XMLHttpRequest();
  oReq.open("GET", "/dev", false);
  oReq.send();
}

connect();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app"),
);
