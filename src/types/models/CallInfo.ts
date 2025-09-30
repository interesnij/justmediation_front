import { User } from "./User";

type CallParticipant = Omit<
  User,
  "role" | "fullName" | "shortName" | "description"
>;

/** Call info dto model. */
export interface CallInfo {
  /** Call id. */
  id: number;
  /** Call url. */
  callUrl: string;
  /** Participants. */
  participants: CallParticipant[];
  /** Caller. */
  caller: CallParticipant;
}
