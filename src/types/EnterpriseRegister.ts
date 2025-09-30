/**
 * Law firm Register.
 */
export interface EnterpriseRegisterDto {
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
   * Role.
   */
  role?: string;

  /**
   * Firm size.
   */
  firm_size?: string;

  /**
   * Firm Locations
   */
   firm_locations?: {
    country: string;
    state: string;
    address: string;
    city: string;
    zip_code: string;
  }[];
}
