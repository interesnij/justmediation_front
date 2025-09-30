/**
 * Paralegal Register.
 */
export interface ParalegalRegisterDto {
  /**
   * First name.
   */
  first_name?: string;

  /**
   * Last name.
   */
  last_name?: string;

  /**
   * Email.
   */
  email: string;

  /**
   * Phone.
   */
  phone?: string;

  /**
   * Password.
   */
  password1?: string;

  /**
   * Confirm Password.
   */
  password2?: string;

  /**
   * Avatar.
   */
  avatar?: string;

  /**
   * Role.
   */
  role?: string;

  /**
   * Is disciplined.
   */
  is_disciplined?: boolean;

  /**
   * Practice jurisdictions.
   */
  practice_jurisdictions: {
    country: number | string;
    state: number | string;
    year: number;
    number: string;
  }[];

  /**
   * Registration attachments
   */
  registration_attachments?: string[];
}
