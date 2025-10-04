import { Role } from "../enum";

/**
 * Model to refer matter.
 */
export interface ReferMatter {
  /** Matter id. */
  id: number;
  /** Sharing title */
  title: string;
  /** Sharing message. */
  message: string;
  /** ID's of selected users to share with. */
  users: number[];
  /** List of users emails to share with. */
  emails: string[];
  /** User type to share matter with. */
  userType: Role.Mediator | Role.Staff;
}
