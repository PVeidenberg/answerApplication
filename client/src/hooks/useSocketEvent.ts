import { useEffect, useRef } from "react";

import { ServerEvents } from "../../../shared/Events";
import { socket } from "../services/socket";

const noop = () => {
  // no-op
};

export function useSocketEvent<Event extends keyof ServerEvents>(
  event: Event,
  cb: (args: ServerEvents[Event]["args"]) => void,
): void {
  const savedCallback = useRef<(arg: ServerEvents[Event]["args"]) => void>(noop);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = cb;
  });

  useEffect(() => {
    const listener = args => savedCallback.current(args);
    socket.on(event, listener);

    return () => {
      socket.off(event, listener);
    };
  }, [event]);
}
