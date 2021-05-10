import React, { useEffect } from "react";
import useCooldown from "../../hooks/useCooldown";
import "./timer.scss";
import { LinearProgress, withStyles } from "@material-ui/core";
import useSocketEvent from "../../hooks/useSocketEvent";

const BorderLinearProgress = withStyles(theme => ({
  root: {
    height: 50,
    // borderRadius: 5,
    // transform: "rotate(180deg)",
  },
  colorPrimary: {
    backgroundColor: "#1b4e2b",
  },
  bar: {
    backgroundColor: "#369c57",
  },
}))(LinearProgress);

function getProgress(startDate?: Date, endDate?: Date) {
  if (!startDate || !endDate) {
    return 0;
  }

  const total = endDate.getTime() - startDate.getTime();
  const elapsed = Date.now() - startDate.getTime();

  return Math.min(Math.max((elapsed / total) * 100, 0), 100);
}

export default function Timer({
  toggleIsActive,
  isAdmin,
}: {
  isAdmin?: boolean;
  toggleIsActive?: (isActive: boolean) => void;
}) {
  const [endDate, setEndDate] = React.useState<Date>();
  const [startData, setStartDate] = React.useState<Date>();
  const secondsLeft = useCooldown(endDate);

  useSocketEvent("nextQuestion", ({ endDate }) => {
    const date = endDate ? new Date(endDate) : undefined;

    const now = new Date();

    if (date && now > date) {
      setEndDate(undefined);
      toggleIsActive?.(false);
    } else {
      setEndDate(date);
      setStartDate(new Date());
      toggleIsActive?.(!!date && date > new Date());
    }
  });

  useEffect(() => {
    toggleIsActive?.(!!endDate && secondsLeft > 0);
  }, [secondsLeft, endDate]);

  const text = endDate ? `Time left to answer: ${secondsLeft || "Time is up"}` : "Waiting for next question";

  if (isAdmin) {
    return <h3 className="white">{text}</h3>;
  }

  return (
    <div className="timer">
      <BorderLinearProgress variant="determinate" value={getProgress(startData, endDate)} />
      <h3 className="white">{text}</h3>
    </div>
  );
}
