import { Coordinates, User, Education, FeeKind } from "./";
import { Specialty } from "./Specialty";
import { State } from "./State";

export type PlaceResult = google.maps.places.PlaceResult;

/**
 * Model for attorney's data.
 */
export interface Attorney extends User {
  /**
   * Attorney's education.
   */
  education: Education;
  /**
   * Is attorney disciplined.
   */
  isDisciplined: boolean;
  /**
   * Practice jurisdiction states.
   */
  practiceJurisdictions: State[];
  /**
   * The jurisdiction where you are currently licensed to practice law in along with your registration number.
   */
  licenseInfo: string;
  /**
   * Practice description.
   */
  practiceDescription: string;
  /**
   * Firm place ID.
   */
  firmPlaceId: string;
  /**
   * Firm location.
   */
  firmLocation: Coordinates;
  /**
   * Initial data from google.
   */
  firmLocationData: google.maps.places.PlaceResult;
  /**
   * City name from google place api
   */
  firmLocationCity: string;
  /**
   * State name from google place api
   */
  firmLocationState: string;
  /**
   * Years of experience.
   */
  yearsOfExperience: number;
  /**
   * Does attorney has specialty?
   */
  haveSpecialty: boolean;
  /**
   * List of specialties.
   */
  specialties: Specialty[];
  /**
   * Speciality time.
   * Number of years practice in the specialized area.
   */
  specialtyTime: number;
  /**
   * Speciality matters count.
   * Approximate number of matters, in the last 5 years, have handled.
   */
  specialtyMattersCount: number;
  /**
   * Related keywords.
   */
  keywords: string;
  /**
   * Fee rate.
   */
  feeRate: string;
  /**
   * Information about attorneys fee kinds.
   */
  feeKinds: FeeKind[];
  /**
   * Charity organizations.
   */
  charityOrganizations: string;
  /**
   * Extra information.
   */
  extraInfo: string;
  /**
   * Phone.
   */
  phone: string;
  /**
   * Payment plan.
   */
  paymentPlan: string;
  /**
   * Payment method.
   */
  paymentMethod: string;
  /**
   * Followers.
   */
  readonly followers: number[];

  /**
   * Is attorney verified.
   */
  isVerified: boolean;

  /**
   * Is attorney feature.
   */
  featured: boolean;

  /**
   * Distance to attorney.
   */
  distance: number;
  /**
   * Has attorney active subscription.
   */
  hasActiveSubscription: boolean;
  /**
   * Is attorney sponsored.
   */
  readonly isSponsored: boolean;
  /**
   * Sponsor attorney link.
   */
  sponsorLink: string;
}
