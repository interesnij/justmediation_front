import { Mediator } from "./Mediator";

/**
 * Mediator registration model.
 */
export interface MediatorRegistration extends Mediator {
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
