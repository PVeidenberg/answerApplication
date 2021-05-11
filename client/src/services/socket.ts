import { io } from "socket.io-client";
import { Socket } from "../react-app-env";

export const socket = io({
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: false,
}) as Socket;

socket.on("connect", () => {});
