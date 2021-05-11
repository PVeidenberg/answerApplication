import { useEffect, useState } from "react";

import useInterval from "./useInterval";

function getSecondsLeft(date?: Date | null) {
  if (!date) {
    return 0;
  }

  return Math.max(Math.round((date.getTime() - Date.now()) / 1000), 0);
}

export function useCooldown(cooldownUntilDate?: Date | null): number {
  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft(cooldownUntilDate));

  useEffect(() => {
    setSecondsLeft(getSecondsLeft(cooldownUntilDate));
  }, [cooldownUntilDate]);

  useInterval(
    () => {
      const secondsLeft = getSecondsLeft(cooldownUntilDate);
      setSecondsLeft(secondsLeft);
    },
    secondsLeft > 0 ? 1000 : null,
  );

  return secondsLeft;
}
