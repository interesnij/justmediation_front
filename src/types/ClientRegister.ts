/**
 * Client DTO.
 */
export interface ClientRegisterDto {
  /**
   * First name.
   */
  first_name: string;

  /**
   * Last name.
   */
  last_name: string;

  /**
   * Email.
   */
  email: string;

  /**
   * Password.
   */
  password1: string;

  /**
   * Confirm Password.
   */
  password2: string;

  /**
   * Country ID.
   */
  country: number;

  /**
   * State ID.
   */
  state: number;

  /**
   * City.
   */
  city: string;

  /**
   * Address Line 1.
   */
  address1: string;

  /**
   * Address Line 2.
   */
  address2: string;

  /**
   * Zip code.
   */
  zip_code: string;

  /**
   * Phone number.
   */
  phone: string;

  /**
   * Specialties.
   */
  specialities?: number[];

  /**
   * Type of a client.
   */
  client_type?: "individual" | "firm";

  /**
   * Organization name.
   */
  organization_name?: string;

  /**
   * Job Title.
   */
  job?: string;
}
