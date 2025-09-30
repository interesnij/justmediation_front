import { User } from "./";
import { ClientType } from "../enum";
import { Specialty } from "./Specialty";
import { State } from "./State";
/**
 * Client model.
 */
export interface Client extends User {
  /**
   * State.
   */
  state: State;
  /**
   * Help description.
   */
  helpDescription: string;
  /**
   * Specialties.
   */
  specialties?: Specialty[];
  /**
   * Client type.
   */
  clientType: ClientType;
  /**
   * Organization name.
   */
  organizationName: string;
}
