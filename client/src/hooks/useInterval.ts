import { useEffect, useRef } from "react";

const noop = () => {
  // no-op
};

export function useInterval(callback: () => void, delay: number | null | false, immediate?: boolean): void {
  const savedCallback = useRef(noop);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Execute callback if immediate is set.
  useEffect(() => {
    if (!immediate) {
      return undefined;
    }

    if (delay === null || delay === false) {
      return undefined;
    }

    savedCallback.current();
  }, [immediate, delay]);

  // Set up the interval.
  useEffect(() => {
    if (delay === null || delay === false) {
      return undefined;
    }
    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
