import { Server as HttpServer } from "http";

import { Server as SocketServer, Socket as SocketIoSocket } from "socket.io";

import { ClientToServerEvents, ServerToClientEvents } from "../../../shared/Events";

export type Socket = SocketIoSocket<ClientToServerEvents, ServerToClientEvents>;

export function createSocketServer(server: HttpServer): SocketServer<ClientToServerEvents, ServerToClientEvents> {
  return new SocketServer(server);
}
