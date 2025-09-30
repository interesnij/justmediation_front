/** Payment status. */
export enum PaymentStatus {
  /** Payment in progress */
  InProgress = "in_progress",
  /** Payment failed */
  Failed = "failed",
  /** Payment canceled */
  Canceled = "canceled",
  /** Payment succeeded */
  Succeeded = "succeeded",
}

/** Type of payment. */
export enum PaymentType {
  /** Payment for the invoice. */
  InvoicePayment = "invoice",
  /** Fee for using staff functionality. */
  StaffFee = "support",
}
