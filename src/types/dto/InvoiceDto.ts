import { InvoicePaymentStatus } from "../enum/InvoiceStatus";

import { ClientDto } from "./ClientDto";
import { MatterDto } from "./MatterDto";

/** Dto for invoice model */
export interface InvoiceDto {
  /** Identifier */
  id: number;
  /** Matter identifier */
  matter: number;
  /** Matter data */
  matter_data?: MatterDto;
  /** Client identifier */
  client: number;
  /** Client data */
  client_data?: ClientDto;
  /** Start date from which invoice money amount is calculated */
  period_start: string;
  /** End date till which invoice money amount is calculated */
  period_end: string;
  /** Status */
  status?: "pending" | "sent";
  /** Title which describes current invoice */
  title: string;
  /** A note left by mediator */
  note: string;
  /** Created at */
  created?: string;
  /** Modified at */
  modified?: string;
  /** Is payment available for the invoice. */
  can_be_paid?: boolean;
  /** Payment status. */
  payment_status?: InvoicePaymentStatus;
  /** Mediator id. */
  mediator: number;
  /** mediator data. */
  // mediator_data?: MediatorDto;
}
