import { VerificationStatus } from "../enum/VerificationStatus";

import { AuthorDto } from "./AuthorDto";
import { SpecialtyDto } from "./SpecialtyDto";

/**
 * DTO for author of social post.
 */
export interface SocialPostAuthorDto extends AuthorDto {
  /** Is verified. */
  is_verified: boolean;
  /** Verification status. */
  verification_status: VerificationStatus;
  /** Is featured. */
  featured: boolean;
  /** Is sponsored. */
  sponsored: boolean;
  /** Has active subscription. */
  has_active_subscription: boolean;
  /** Phone. */
  phone: string;
  /** Specialties id */
  specialities: number[];
  /** Specialties data. */
  specialities_data: SpecialtyDto[];
  /** Firm state. */
  firm_location_state: string;
  /** Firm city. */
  firm_location_city: string;
}
