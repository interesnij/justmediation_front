import { Role } from "../enum";

/**
 * Base user information.
 */
export interface User {
  /**
   * ID.
   */
  readonly id: number;

  /**
   * Avatar url.
   */
  avatar: string | File;

  /**
   * First name.
   */
  firstName: string;

  /**
   * Last name.
   */
  lastName: string;

  /**
   * Email.
   */
  email: string;

  /**
   * User role.
   */
  role: Role;
}
