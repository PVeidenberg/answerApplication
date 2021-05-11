import { io, Socket as SocketIoSocket } from "socket.io-client";

import { ClientToServerEvents, ServerToClientEvents } from "../../../shared/Events";

export type Socket = SocketIoSocket<ServerToClientEvents, ClientToServerEvents>;
export const socket: Socket = io({
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: false,
});
