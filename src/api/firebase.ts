import { API } from "helpers";

/** Get firebase token. */
export const getFirebaseToken = () => {
  return API().get("firestore/get-credentials/");
};
