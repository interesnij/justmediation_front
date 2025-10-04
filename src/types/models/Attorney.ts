import { Coordinates, User, Education, FeeKind } from "./";
import { Specialty } from "./Specialty";
import { State } from "./State";

export type PlaceResult = google.maps.places.PlaceResult;

/**
 * Model for Mediator's data.
 */
export interface Mediator extends User {
  /**
   * Mediator's education.
   */
  education: Education;
  /**
   * Is Mediator disciplined.
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
   * Does Mediator has specialty?
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
   * Information about Mediators fee kinds.
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
   * Is Mediator verified.
   */
  isVerified: boolean;

  /**
   * Is Mediator feature.
   */
  featured: boolean;

  /**
   * Distance to Mediator.
   */
  distance: number;
  /**
   * Has Mediator active subscription.
   */
  hasActiveSubscription: boolean;
  /**
   * Is Mediator sponsored.
   */
  readonly isSponsored: boolean;
  /**
   * Sponsor Mediator link.
   */
  sponsorLink: string;
}
