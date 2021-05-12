import http from "http";
import path from "path";

import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import sessionFileStore from "session-file-store";

import { expressApi } from "./api/expressApi";
import { io } from "./services/socketService";

const app = express();

const DIST_FOLDER = path.join(__dirname, "../../client/build");

const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

const FileStore = sessionFileStore(session);

const sessionMiddleware = session({
  store: new FileStore(),
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 3600 },
});

app.use(sessionMiddleware);

app.use("/api", expressApi);

app.use(express.static(DIST_FOLDER));

app.get("*", (req, res) => {
  res.sendFile(path.join(DIST_FOLDER, "index.html"));
});

io.use(function (socket, next) {
  sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction);
});

io.listen(server);

server.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
