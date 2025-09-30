import { API } from "helpers";
import { ResetPasswordDto, ResetPasswordConfirmationDto } from "types";

export const login = (email: string, password: string, code: string) => {
  return API({}, { Authorization: "" }).post("auth/login/", {
    email,
    password,
    code,
  });
};

export const resetPassword = (param: ResetPasswordDto) => {
  return API({}, { Authorization: "" }).post("auth/password/reset/", param);
};

export const resetPasswordConfirm = (param: ResetPasswordConfirmationDto) => {
  return API({}, { Authorization: "" }).post(
    "auth/password/reset/confirm/",
    param
  );
};

export const resendConfirmEmail = (data) => {
  return API({}, { Authorization: "" }).post(
    "auth/account-resend-confirm-email/",
    data
  );
};

export const changePassword = (param) => {
  return API().post("auth/password/change/", param);
};

export const validateLogin = (param) => {
  return API({}, { Authorization: "" }).post(
    "auth/login/validate/",
    param
  );
};

export const confirm2FA = async (param) => {
  const res = await API().post("auth/account-confirm-twofa/", param);
  return res.data?.success;
};
