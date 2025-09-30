import { trimStart, padStart } from "lodash";

export const formatPhoneNumber = (phoneNumberString: string) => {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return null;
};

export const isValidItlPhoneNumber = (value: string) => {
  return /^\d{7,}$/.test(value.replace(/[\s()+\-\.]|ext/gi, ""));
};

export const getUserName = (params: any) => {
  return params
    ? `${params?.first_name || ""} ${params?.middle_name || ""} ${
        params?.last_name || ""
      }`.trim()
    : "";
};

export const formatTimerValue = (params: string) => {
  let temp = params.split(".")[0];
  let nums = temp.split(":");
  if (nums[0].length === 1) {
    nums[0] = "0" + nums[0];
  }
  return nums.join(":");
};

export const formatDurationText = (value: string) => {
  // if input value is falsy eg if the user deletes the input, then just return
  if (!value) return "00:00:00";

  // clean the input for any non-digit values.
  let duration = value.replace(/[^\d]/g, "");
  duration = trimStart(duration, "0");
  duration = padStart(duration, 6, "0");
  return `${duration.slice(0, 2)}:${duration.slice(2, 4)}:${duration.slice(
    4,
    6
  )}`;
};
