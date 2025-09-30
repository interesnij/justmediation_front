import { Author } from "./Author";
import { Specialty } from "./Specialty";
import { VerificationStatus } from "../enum";

/**
 * Author of social post.
 */
export interface SocialPostAuthor extends Author {
  /** Verification status. */
  verificationStatus: VerificationStatus;
  /** Is featured. */
  isFeatured: boolean;
  /** Is sponsored. */
  isSponsored: boolean;
  /** Has active subscription. */
  hasActiveSubscription: boolean;
  /** Phone. */
  phone: string;
  /** Specialties id */
  specialities: number[];
  /** Specialties data. */
  specialitiesData: Specialty[];
  /** Firm state. */
  firmState: string;
  /** Firm city. */
  firmCity: string;
}
