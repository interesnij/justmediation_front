import { Attorney } from "./Attorney";

/** Group chat model. */
export interface Network {
  /** Id. */
  id?: number;
  /** Title. */
  title: string;
  /** Chat channel. */
  chatId?: string;
  /** Creator. */
  creator?: Attorney;
  /** Participants. */
  participants: Attorney[];
}
