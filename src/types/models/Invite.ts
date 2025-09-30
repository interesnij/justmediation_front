import { Client } from "./Client";
import { ClientType } from "../enum";

/** Invite model */
export interface Invite {
  /** UUID. */
  uuid?: string;
  /** Client. */
  client?: Client;
  /** First name. */
  firstName: string;
  /** Last name. */
  lastName: string;
  /** Email. */
  email: string;
  /** Message of invitation. */
  message: string;
  /** Time when invitation was sent. */
  sent?: Date;
  /** Organization name. */
  organizationName?: string;
  /** Client type. */
  clientType?: ClientType;
}
