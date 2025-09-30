/**
 * Attorney Register.
 */
export interface AttorneyRegisterDto {
  /**
   * First name.
   */
  first_name?: string;

  /**
   * Last name.
   */
  last_name?: string;

  /**
   * Middle name.
   */
  middle_name?: string;

  /**
   * Email.
   */
  email?: string;

  /**
   * Phone.
   */
  phone?: string;

  /**
   * Password1.
   */
  password1?: string;

  /**
   * Password2.
   */
  password2?: string;

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

  /**
   * Avatar
   */
  avatar?: any;

  /**
   * Biography
   */
  biography?: string;

  /**
   * Firm name
   */
  firm_name?: string;

  /**
   * Website
   */
  website?: string;

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

  /**
   * Education
   */
  education?: {
    university: string;
    year: number;
  }[];

  /**
   * Years of experience
   */
  years_of_experience?: number | string;

  /**
   * Specialities
   */
  specialities?: number[];

  /**
   * Appointment type
   */
  appointment_type?: number[];

  /**
   * Fee type
   */
  fee_types?: string[];

  /**
   * Payment type
   */
  payment_type?: number[];

  /**
   * Fee rate
   */
  fee_rate?: number | string;

  /**
   * Fee currency
   */
  fee_currency?: number;

  /**
   * Spoken language
   */
  spoken_language?: number[];

  /**
   * Bid for potential engagement
   */
  is_submittable_potential?: boolean;

  tax_rate?: string;

  /**
   * Team logo.
   */
  team_logo?: string;

  /**
   * Team members.
   */
  team_members ?: {
    email?: string;
    type?: string;
  }[];

  team_members_registered?:number[];

}
