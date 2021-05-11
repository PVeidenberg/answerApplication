import { ServerEvents } from "../../../shared/Events";
import { socket } from "../services/socket";
import { useEffect, useRef } from "react";

const noop = () => {
  // no-op
};

export function useSocketEvent<Event extends keyof ServerEvents>(
  event: Event,
  cb: (args: ServerEvents[Event]["args"]) => void,
) {
  const savedCallback = useRef<(arg: any) => void>(noop);

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
  }, []);
}
