/**
 * Stats.
 */
export interface Stats {
  /**
   * Date.
   */
  date: Date;
  /**
   * Count.
   */
  count: number;
}

/**
 * Statictic.
 */
export interface Statistic {
  /**
   * Total sum.
   */
  totalSum: number;
  /**
   * Stats.
   */
  stats: Stats[];
}

/**
 * Attorney statistic.
 */
export interface AttorneyStatistic {
  /**
   * Opportunities.
   */
  opportunities: Statistic;

  /**
   * Active leads.
   */
  activeLeads: Statistic;

  /**
   * Active matters.
   */
  activeMatters: Statistic;

  /**
   * Converted leads.
   */
  converted: Statistic;

  /**
   * Time billed.
   */
  timeBilled: Statistic;
}
