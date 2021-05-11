import http from "http";
import path from "path";

import express, { Request, Response, NextFunction } from "express";
import session from "express-session";

import { SocketIoServer } from "./SocketIoServer";
import * as model from "./model";

const app = express();

const DIST_FOLDER = path.join(__dirname, "../../client/build");

const server = http.createServer(app);
const PORT = process.env.PORT || 5001;
export const io = new SocketIoServer(server, {
  cors: { origin: "*" },
});

const sessionMiddleware = session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 3600 },
});

app.use(sessionMiddleware);

io.use(function (socket, next) {
  sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction);
});

app.get("/api/session", (req, res) => {
  res.send({
    roomCode: req.session.roomCode,
  });
});

const generateRoomCode = () => {
  return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
};

io.on("connection", socket => {
  const session = socket.request.session;

  socket.on("askRoomCode", function (_args, cb) {
    const roomCode = generateRoomCode();
    cb(roomCode);
  });

  socket.on("createRoom", ({ roomCode }, callback) => {
    const room = model.createRoom(roomCode, socket);

    if (room) {
      session.roomCode = roomCode;
      session.save();

      socket.join(roomCode);
      callback({
        users: room.users.map(user => ({ name: user.name })),
        answers: room.activeQuestion?.answers.map(answer => ({ ...answer, date: answer.date.toISOString() })),
      });
    } else {
      callback({});
    }
  });

  socket.on("validateRoomCode", ({ roomCode }, callback) => {
    callback(model.checkIfRoomExists(roomCode));
  });

  socket.on("joinRoom", ({ userName, roomCode }) => {
    model.joinRoom(roomCode, userName, socket);
    socket.join(roomCode);
  });

  socket.on("sendAnswer", ({ userName, answer, roomCode }) => {
    model.saveAnswer(roomCode, userName, answer);
    console.log(model.rooms);
  });

  socket.on("toggleAnswerCorrectnessServer", ({ userName, roomCode }) => {
    model.toggleAnswerCorrectnessServer(roomCode, userName);
    console.log(model.rooms);
  });

  socket.on("nextQuestionServer", ({ roomCode, answerTime }) => {
    model.nextQuestion(roomCode, answerTime);
    console.log(model.rooms);
  });

  socket.on("endQuestionServer", ({ roomCode }) => {
    socket.broadcast.to(roomCode).emit("endQuestion");
  });

  socket.on("disconnect", () => {
    model.disconnect(socket);
  });
});

app.use(express.static(DIST_FOLDER));

if (process.env.NODE_ENV === "development") {
  // endpoint for development to create session and set session cookie
  app.get("/dev", (req, res) => {
    res.send("ok");
  });
}

app.get("*", (req, res) => {
  res.sendFile(path.join(DIST_FOLDER, "index.html"));
});

server.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
