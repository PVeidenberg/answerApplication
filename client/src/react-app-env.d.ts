/// <reference types="react-scripts" />

import { Socket as OriginalSocket } from "socket.io-client";
import { ClientEvents, ServerEvents } from "../../shared/events";

export interface Socket extends OriginalSocket {
  emit<Event extends keyof ClientEvents>(
    event: Event,
    args: ClientEvents[Event]["args"],
    cb?: (data: ClientEvents[Event]["callback"]) => void,
  ): this;

  on<Event extends keyof ServerEvents>(
    event: Event,
    cb: (args: ServerEvents[Event]["args"], cb: (data: ServerEvents[Event]["callback"]) => void) => void,
  ): this;
}
