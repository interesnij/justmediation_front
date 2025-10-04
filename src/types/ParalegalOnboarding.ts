/**
 * Mediator Register.
 */
export interface ParalegalOnboardingDto {
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

  tax_rate?: string;
}
