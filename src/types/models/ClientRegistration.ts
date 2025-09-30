import { Client } from "./Client";

/**
 * Client registration model.
 */
export interface ClientRegistration extends Client {
  /**
   * Password.
   */
  password: string;
  /**
   * Password confirm.
   */
  passwordConfirm: string;
}
