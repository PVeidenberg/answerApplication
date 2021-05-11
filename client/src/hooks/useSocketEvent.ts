import { useEffect, useRef } from "react";

import { ServerToClientEvents } from "../../../shared/Events";
import { socket } from "../services/socket";

const noop = () => {
  // no-op
};

export function useSocketEvent<Event extends keyof ServerToClientEvents>(
  event: Event,
  cb: ServerToClientEvents[Event],
): void {
  const savedCallback = useRef<any>(noop);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = cb;
  });

  useEffect(() => {
    const listener: any = args => savedCallback.current(args);
    socket.on(event, listener);

    return () => {
      socket.off(event, listener);
    };
  }, [event]);
}
