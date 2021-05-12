import { Server as SocketServer, Socket as SocketIoSocket } from "socket.io";

import { ClientToServerEvents, ServerToClientEvents } from "../../../shared/Events";
import { SocketError } from "../../../shared/Types";
import { socketHandler } from "../api/socketApi";

type FixCallbacks<EventMap> = {
  [Event in keyof EventMap]: EventMap[Event] extends (cb: (err: SocketError | null, data: infer Data) => void) => void
    ? (cb: (err: null | SocketError, data?: Data) => void) => void
    : EventMap[Event];
};

export type Socket = SocketIoSocket<FixCallbacks<ClientToServerEvents>, ServerToClientEvents>;

export const io = new SocketServer();

io.on("connection", socketHandler);
