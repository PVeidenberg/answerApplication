import { io } from "socket.io-client";
import { Socket } from "../react-app-env";

export let socket: Socket;

export function connect() {
  socket = io({
    transports: ["websocket", "polling"],
    withCredentials: true,
  }) as Socket;
}
