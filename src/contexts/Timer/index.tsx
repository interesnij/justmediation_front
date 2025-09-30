import React, { useState, useEffect, createContext, useContext } from "react";
import { useLocalstorage } from "rooks";
import useInterval from "use-interval";
import { useAuthContext } from "contexts";
import { parseTimerDuration, formatTimerDuration } from "helpers";
import {
  getTimerElapsedTime,
  startTimer as starTimerAPI,
  stopTimer as stopTimerAPI,
  cancelTimer as cancelTimerAPI,
} from "api";
export interface TimerContextInterface {
  time: string;
  status: string;
  isLoading: boolean;
  getElapsed(): void;
  startTimer(param?: string): void;
  stopTimer(): void;
  cancelTimer(): void;
  initTimer(): void;
  setTime(param: string): void;
  setStatus(param: string): void;
}

const initialState: TimerContextInterface = {
  time: "00:00:00",
  status: "stopped",
  isLoading: false,
  getElapsed: () => {},
  startTimer: () => {},
  stopTimer: () => {},
  cancelTimer: () => {},
  setTime: () => {},
  initTimer: () => {},
  setStatus: () => {},
};

export const Timer = createContext<TimerContextInterface>(
  initialState as TimerContextInterface
);

export const useTimerContext = () => useContext(Timer);

export const TimerProvider = ({ children }) => {
  const [value, set] = useLocalstorage("timer-state", initialState);
  const { userId } = useAuthContext();
  const [state, setState] = useState(value);

  useEffect(() => {
    set(state);
    return () => {};
  }, [state, set]);

  const startTimer = async (old_time) => {
    if (userId && !state.isLoading) {
      try {
        setState({ ...state, isLoading: true });
        const time = await starTimerAPI(old_time);
        setState({ ...state, time, status: "running", isLoading: false });
      } catch (error) {
        setState({ ...state, status: "stopped", isLoading: false });
      }
    }
  };

  const stopTimer = async () => {
    if (userId && !state.isLoading) {
      try {
        setState({ ...state, isLoading: true });
        const time = await stopTimerAPI();
        setState({ ...state, time, status: "stopped", isLoading: false });
      } catch (error) {
        setState({ ...state, status: "running", isLoading: false });
      }
    }
  };

  const cancelTimer = async () => {
    if (userId) {
      try {
        setState({ ...state, isLoading: true });
        await cancelTimerAPI();
        setState({ ...initialState });
      } catch (error) {
        setState({ ...state, status: "running", isLoading: false });
      }
    }
  };

  const setTime = (time: string) => {
    setState({ ...state, time });
  };

  const setStatus = (status: string) => {
    setState({ ...state, status });
  };

  const initTimer = () => {
    setState({ ...initialState });
  };

  useInterval(async () => {
    if (state?.status === "running") {
      let seconds = parseTimerDuration(state?.time) + 1;
      setTime(formatTimerDuration(seconds));
    }
  }, 1000);

  useEffect(() => {
    const init = async () => {
      if (userId) {
        const res = await getTimerElapsedTime();
        setState({ ...state, time: res?.elapsed_time, status: res?.status });
      }
    };
    init();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Timer.Provider
      value={{ ...state, startTimer, stopTimer, cancelTimer, setTime, setStatus, initTimer }}
    >
      {children}
    </Timer.Provider>
  );
};
