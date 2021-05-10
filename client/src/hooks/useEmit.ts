import { ClientEvents, ServerEvents } from "../../../shared/Events";
import { socket } from "../services/socket";
import { useEffect, useRef } from "react";

export default function useEmit() {
  const isMounted = useRef(false);

  // Remember the latest callback.
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return <Event extends keyof ClientEvents>(
    event: Event,
    args: ClientEvents[Event]["args"],
    cb?: (data: ClientEvents[Event]["callback"]) => void,
  ) => {
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
