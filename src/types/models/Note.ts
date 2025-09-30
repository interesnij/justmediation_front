import { Client } from "./Client";
import { Matter } from "./Matter";

/** Note model. */
export interface Note {
  /** Id. */
  id: number;
  /** Title. */
  title: string;
  /** Text. */
  text: string;
  /** Matter. */
  matter: Matter;
  /** Client who created the note. */
  createdBy: Client;
  /** Date of creation. */
  created: Date;
  /** Date of modification. */
  modified: Date;
}
