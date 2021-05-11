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

  return (((event, args, cb) => {
    socket.emit(
      event,
      args,
      cb
        ? data => {
            if (isMounted.current) {
              cb(data);
            }
          }
        : undefined,
    );
  }) as unknown) as ReturnType;
}
