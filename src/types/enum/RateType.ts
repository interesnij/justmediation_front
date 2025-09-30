/** Rate type */
export enum RateType {
  /** Hourly */
  Hourly = "hourly",
  /** Fixed */
  Fixed = "fixed_amount",
  /** Contingency */
  Contingency = "contingency_fee",
  /** Alternative */
  Alternative = "alternative",
}

export const readableRateType: Record<RateType, string> = {
  [RateType.Hourly]: "Hourly",
  [RateType.Alternative]: "Alternative Agreement",
  [RateType.Fixed]: "Fixed Set Amount",
  [RateType.Contingency]: "Contingency Fee",
};
