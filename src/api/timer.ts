import { API, formatTimerValue } from "helpers";

/** Start timer. */
export const startTimer = async (old_time) => {
  let data:any = null;
  if (old_time){
    data = {
      start_time: old_time 
    };
  }
  const res = await API().post("business/time-billing/start_timer/", data);
  return formatTimerValue(res.data.elapsed_time);
};

/** Stop timer. */
export const stopTimer = async () => {
  const res = await API().post("business/time-billing/stop_timer/");
  return formatTimerValue(res.data.elapsed_time);
};

/** Cancel timer. */
export const cancelTimer = async () => {
  return await API().post("business/time-billing/cancel_timer/");
};

/** Get current elapsed time. */
export const getTimerElapsedTime = async () => {
  const res = await API().get(
    "business/time-billing/get_current_elapsed_time/"
  );
  return res.data;
};
