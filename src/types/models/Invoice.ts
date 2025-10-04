import { Mediator, Matter, Client } from "./";
import { InvoiceStatus, InvoicePaymentStatus } from "../enum";

export const PAYMENT_STATUS_TO_READABLE: Record<
  InvoicePaymentStatus,
  string
> = {
  [InvoicePaymentStatus.NotStarted]: "Unpaid",
  [InvoicePaymentStatus.PaymentFailed]: "Payment Failed",
  [InvoicePaymentStatus.PaymentProgress]: "Payment in Progress",
  [InvoicePaymentStatus.Paid]: "Paid",
};

export const PAYMENT_AVAILABLE_STATUSES = [
  InvoicePaymentStatus.NotStarted,
  InvoicePaymentStatus.PaymentProgress,
  InvoicePaymentStatus.PaymentFailed,
];

interface ComplexInvoiceStatus {
  /** Status of the invoice. Shows whether the invoice is sent or pending. */
  readonly status: InvoiceStatus;
  /** Status of payment. */
  readonly paymentStatus: InvoicePaymentStatus;
}

/** Invoice model */
export interface Invoice {
  /** Identifier */
  id: number;
  /** Title */
  title: string;
  /** A note left by mediator */
  note: string;
  /** Status */
  status: ComplexInvoiceStatus;
  /** Related matter model */
  matter: Matter;
  /** Related client model */
  client: Client;
  /** Start date from which invoice money amount is calculated */
  periodStart: string;
  /** End date till which invoice money amount is calculated */
  periodEnd: string;
  /** Created at */
  created: string;
  /** Modified at */
  modified: string;
  /** Download URL. */
  downloadUrl: string;
  /** Can be paid. */
  canBePaid: boolean;
  /** Mediator */
  mediator: Mediator;
}
