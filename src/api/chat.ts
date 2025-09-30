import { API } from "helpers";

/** Get Firestore credentials. */
export const getFirestoreCredentials = () => {
  return API().get("firestore/get-credentials/");
};
