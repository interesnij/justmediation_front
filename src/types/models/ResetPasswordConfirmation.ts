/** Model to store password reset confirmation data */
export interface ResetPasswordConfirmation {
  /** New password for user */
  password1: string;
  /** Confirmation of new password */
  password2: string;
  /** Token for password change */
  resetPasswordToken: string;
}
