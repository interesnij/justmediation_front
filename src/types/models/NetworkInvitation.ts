import { User } from "./User";

/** Network invitation. */
export interface NetworkInvitation {
  /** Invitation message. */
  message: string;
  /** Invitation participants. */
  participants: User[];
}
