import { parse, format, addSeconds } from "date-fns";

export const convert2DBDate = (params: string) => {
  return format(parse(params, "MM/dd/yyyy", new Date()), "yyyy-MM-dd");
};

export const convertDBDate = (params: string) => {
  return params
    ? format(parse(params, "yyyy-MM-dd", new Date()), "MM/dd/yyyy")
    : "";
};

/**
 * parseTimerDuration
 * @param params
 * @returns seconds
 */
export const parseTimerDuration = (params: string) => {
  let days = 0,
    dateStr = "";
  if (params.split("days,").length > 1) {
    days = +params.split("days,")[0].trim();
    dateStr = params.split("days,")[1].trim();
  } else {
    dateStr = params;
  }
  let hour = +dateStr.split(":")[0];
  let minute = +dateStr.split(":")[1];
  let second = +dateStr.split(":")[2];
  return days * (3600 * 24) + hour * 3600 + minute * 60 + second;
};

/**
 * formatTimerDuration
 * @param seconds
 * @returns 'HH:mm:ss'
 */
export const formatTimerDuration = (seconds) => {
  let date = addSeconds(new Date(0, 0, 0, 0, 0, 0, 0), seconds);
  const oneDay = 3600 * 24;
  return (
    (seconds > oneDay ? `${Math.floor(seconds / oneDay)} days,` : "") +
    format(date, "HH:mm:ss")
  );
};
