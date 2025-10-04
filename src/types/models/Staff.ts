import { User } from "./User";
import { VerificationStatus } from "../enum";

/** Staff user. Also might be considered as Mediator's support. */
export interface Staff extends User {
  /** Avatar. */
  avatar: string;
  /** Verification status. */
  verificationStatus: VerificationStatus;
  /** Custom note for the user. */
  description: string;
  firstName: string;
  lastName: string;
  id: number;
  /** Is functionality paid. */
  isPaid: boolean;
}
