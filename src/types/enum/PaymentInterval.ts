/**
 * Payment interval.
 */
export enum PaymentInterval {
  /**
   * Day.
   */
  Day = 0,
  /**
   * Week.
   */
  Week,
  /**
   * Week.
   */
  Month,
  /**
   * Year.
   */
  Year,
}

export namespace PaymentInterval {
  const PAYMENT_INTERVAL_TO_TITLE_MAP: Record<PaymentInterval, string> = {
    [PaymentInterval.Day]: "Day",
    [PaymentInterval.Month]: "Month",
    [PaymentInterval.Week]: "Week",
    [PaymentInterval.Year]: "Year",
  };

  /**
   * Convert a certain payment interval value to readable title.
   * @param value Payment interval value to get a title.
   */
  // tslint:disable-next-line: completed-docs
  export function toReadable(value: PaymentInterval): string {
    return PAYMENT_INTERVAL_TO_TITLE_MAP[value];
  }
}

const PAYMENT_INTERVAL_TO_DAYS_MAP = {
  [PaymentInterval.Day]: 1,
  [PaymentInterval.Month]: 30,
  [PaymentInterval.Week]: 7,
  [PaymentInterval.Year]: 364,
};
