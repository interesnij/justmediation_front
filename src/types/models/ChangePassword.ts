/**
 * Author model.
 */
export interface ChangePassword {
  /**
   * Current password.
   */
  currentPassword: string;
  /**
   * New password.
   */
  newPassword: string;
  /**
   * Confirm new password.
   */
  confirmPassword?: string;
}
