import { Server, ServerOptions } from "socket.io";
import { Socket as SocketIo } from "socket.io/dist/socket";
import { ClientEvents, ServerEvents } from "../shared/events";
import * as http from "http";

export interface Socket extends SocketIo {
  on(event: "disconnect", cb: (reason: string) => void): this;
  on<Event extends keyof ClientEvents>(
    event: Event,
    cb: (args: ClientEvents[Event]["args"], cb: (data: ClientEvents[Event]["callback"]) => void) => void,
  ): this;

  emit<Event extends keyof ServerEvents>(
    event: Event,
    args: ServerEvents[Event]["args"],
    cb?: (data: ServerEvents[Event]["callback"]) => void,
  ): true;
  emit<Event extends keyof ServerEvents>(event: ServerEvents[Event]["args"] extends never ? Event : never): true;
}

export interface SocketIoServerType extends Server {
  on(event: "connection", listener: (socket: Socket) => void): this;
}

export const SocketIoServer: new (
  rv?: http.Server | number,
  opts?: Partial<ServerOptions>,
) => SocketIoServerType = Server;
