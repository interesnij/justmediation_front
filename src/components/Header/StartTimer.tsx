import React from "react";
import classNames from "classnames";
import StartIcon from "assets/icons/start_black.svg";
import { useTimerContext } from "contexts";
import { FaPlay, FaPause } from "react-icons/fa";
import "./style.scss";

interface Props {
  className?: string;
  onTimerStop?(): void;
  disabled?: boolean;
}
export default function StartTimer({
  className,
  onTimerStop = () => {},
                                     disabled
}: Props) {
  const { time, status, startTimer, stopTimer, isLoading } = useTimerContext();
  const handleClick = async () => {
    if (!isLoading) {
      if (status === "running") {
        await stopTimer();
        onTimerStop();
      } else {
        await startTimer();
      }
    }
  };
  return (
    <div className={classNames("start-timer", disabled ? "disabled" : "", className)} onClick={handleClick}>
      {status === "running" ? (
        <>
          <FaPause color="black" size={12} />
          <span>{time}</span>
        </>
      ) : (
        <>
          <FaPlay color="black" size={12} />
          <span>Start Timer</span>
        </>
      )}
    </div>
  );
}
