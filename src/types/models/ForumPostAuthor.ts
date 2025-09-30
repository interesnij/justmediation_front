import { ForumStats } from "./ForumStats";
import { Author } from "./Author";
import { ClientType, VerificationStatus } from "../enum/";

/**
 * Forum post author.
 */
export interface ForumPostAuthor extends Author {
  /** Date Joined. */
  dateJoined: string;
  /** LastLogin. */
  lastLogin: string;
  /** ForumStats. */
  forumStats: ForumStats;
  /** Created. */
  created: string;
  /** Modified. */
  modified: string;
  /** Client type. */
  clientType: ClientType | null;
  /** Organization name. */
  organizationName: string;
  /** Actives ubscription. */
  activeSubscription: number | null;
  /** Specialties. */
  specialties: number[];
  /** Verification status. */
  verificationStatus: VerificationStatus;
}
