import { ClientType } from "../enum/ClientType";
import { VerificationStatus } from "../enum/VerificationStatus";

import { AuthorDto } from "./AuthorDto";
import { ForumStatsDto } from "./ForumStatsDto";

/**
 * DTO for author of forum post.
 */
export interface ForumPostAuthorDto extends AuthorDto {
  /** Joined data. */
  date_joined: string;
  /** Last login. */
  last_login: string;
  /** Forum stats. */
  forum_stats: ForumStatsDto;
  /** Verification status. */
  verification_status: VerificationStatus;
  /** Client type. */
  client_type: ClientType | null;
  /** Organization name. */
  organization_name: string | null;
  /** Created. */
  created: string;
  /** Modified. */
  modified: string;
  /** Active subscription. */
  active_subscription: number | null;
  /** Specialities. */
  specialities: number[];
}
