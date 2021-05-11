import { useEffect, useRef } from "react";

import { ClientEvents } from "../../../shared/Events";
import { socket } from "../services/socket";

export function useEmit<Event extends keyof ClientEvents>(): (
  event: Event,
  args: ClientEvents[Event]["args"],
  cb?: (data: ClientEvents[Event]["callback"]) => void,
) => void {
  const isMounted = useRef(false);

  // Remember the latest callback.
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (event, args, cb) => {
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
  };
}
