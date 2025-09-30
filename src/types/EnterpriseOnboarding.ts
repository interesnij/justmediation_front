/**
 * Law firm Onboarding.
 */
export interface EnterpriseOnboardingDto {
  /**
   * Firm name.
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
   * Personal Avatar.
   */
  avatar?: any;

  /**
   * Role.
   */
  role?: string;

  /**
   * Firm Name.
   */
  firm_name?: string;

  /**
   * Firm logo
   */
  team_logo?: string;

  /**
   * Office Address.
   */
  firm_locations: {
    country: number;
    state: number;
    address?: string;
    city: string;
    zip_code?: string;
  }[];

  /**
   * Team members.
   */
  team_members: {
    uid?: string;
    email: string;
    type: string;
  }[];

  team_members_registered?: number[];
}
