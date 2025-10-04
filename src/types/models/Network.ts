import { Mediator } from "./Mediator";

/** Group chat model. */
export interface Network {
  /** Id. */
  id?: number;
  /** Title. */
  title: string;
  /** Chat channel. */
  chatId?: string;
  /** Creator. */
  creator?: Mediator;
  /** Participants. */
  participants: Mediator[];
}
