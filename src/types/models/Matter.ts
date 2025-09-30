import {
  Attorney,
  City,
  Client,
  Stage,
  Country,
  State,
  User,
  ESignEnvelop,
  JusLawFile,
  Lead,
} from "./";

import { MatterStatus } from "../enum";

/** Matter model. */
export interface Matter {
  /** Id */
  id: number;
  /** Lead data */
  lead: Lead;
  /** Client data */
  client: Client;
  /** Attorney data */
  attorney: Attorney;
  /** Code */
  code: string;
  /** Title */
  title: string;
  /** Description */
  description: string;
  /** Rate type */
  rateType: "hourly" | "fixed_amount" | "contingency_fee" | "alternative";
  /** Rate */
  rate: string;
  /** Country data */
  country: Country;
  /** State data */
  state: State;
  /** City */
  city: City;
  /** Status */
  status: MatterStatus;
  /** Phase */
  stage: Stage;
  /** Chat channel */
  chatChannel: string;
  /** Created */
  created: Date;
  /** Modified */
  modified: string;
  /** Billable time. */
  timeBilled: number;
  /** Fees earned */
  earned: number;
  /** URLs to Esign document. */
  documents?: JusLawFile[];
  /** Date of completion. */
  completed: Date;
  /** E-sign envelop of documents. */
  eSignEnvelop?: ESignEnvelop;
  /** List of attorneys the matter is shared with. */
  sharedWith: User[];
}
