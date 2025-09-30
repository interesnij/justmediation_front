import { Attorney } from "./Attorney";

/**
 * Attorney registration model.
 */
export interface AttorneyRegistration extends Attorney {
  /**
   * Password.
   */
  password: string;
  /**
   * Repeat password.
   */
  passwordRepeat: string;
  /**
   * File attachments.
   */
  attachedFiles: File[] | string[];
}
