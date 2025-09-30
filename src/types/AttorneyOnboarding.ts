/**
 * Attorney Onboarding.
 */
export interface AttOnboardingDto {
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
   * Avatar.
   */
  avatar?: any;

  /**
   * Biography.
   */
  biography?: string;

  /**
   * Law Firm.
   */
  firm_name?: string;

  /**
   * Website
   */
  website?: string;

  /**
   * Office Address.
   */
  firm_locations: {
    country: number;
    state: number;
    address?: string;
    city?: string;
    zip_code?: string;
  }[];

  /**
   * Education.
   */
  education: {
    university?: string;
    year?: number;
  }[];

  /**
   * Years of Experience.
   */
  years_of_experience: number;

  /**
   * Jurisdictions & Registrations
   */
  practice_jurisdictions: {
    country: number;
    state: number;
    number: string;
    year: number;
  }[];
  /**
   * Practice Area
   */
  specialities?: {
    id: number;
    specialty: string;
  }[];

  /**
   * Accepted Appointment Types
   */
  appointment_type: number[];

  /**
   * Fees and Payment Fee types
   */
  fee_types: string[];

  /**
   * Accepted Payment Methods
   */
  payment_method?: number[];

  /**
   * Hourly Rate && Currency
   */
  fee_rate?: number;
  fee_currency?: number;

  /**
   * Spoken languages
   */
  spoken_language?: number[];
}
