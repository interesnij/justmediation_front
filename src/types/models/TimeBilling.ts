import { Matter } from "./Matter";
import { User } from "./User";

/** Time billing dto model. */
export interface TimeBilling {
  /** Id */
  id: number;
  /** Matter */
  matter: Matter;
  /** Invoice */
  invoice: number;
  /** Description */
  description: string;
  /** Time spent in minutes */
  spentMinutes: number;
  /** Amount of money should be paid for a spent time */
  fees: string;
  /** Date in which billed work was made */
  date: string;
  /** Created */
  created: string;
  /** Modified */
  modified: string;
  /** User who made bill. */
  createdBy: User;
  /** Can billing log be edited. */
  isEditable: boolean;
  /** Can billing log be edited by the current user. */
  isEditableForCurrentUser: boolean;
}
