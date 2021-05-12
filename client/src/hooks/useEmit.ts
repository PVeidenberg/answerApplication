import { useEffect, useRef } from "react";
import { EventParams } from "socket.io-client/build/typed-events";

import { ClientToServerEvents } from "../../../shared/Events";
import { socket } from "../services/socket";

type ReturnType = <Event extends keyof ClientToServerEvents>(
  event: Event,
  ...args: EventParams<ClientToServerEvents, Event>
) => void;

export function useEmit(): ReturnType {
  const isMounted = useRef(false);

  // Remember the latest callback.
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (((event, ...args) => {
    if (typeof args[args.length - 1] === "function") {
      const cb = args[args.length - 1];
      args[args.length - 1] = (...args) => {
        if (isMounted.current) {
          cb(...args);
        }
      };
    }
    socket.emit(event, ...args);
  }) as unknown) as ReturnType;
}
