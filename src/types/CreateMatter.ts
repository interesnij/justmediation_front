/**
 * Create Matter.
 */
export interface CreateMatterDto {
  /**
   * Client id.
   */
  client?: number;

  /**
   * Title.
   */
  title?: string;

  /**
   * Description.
   */
  description?: string;

  /**
   * Start Date.
   */
  start_date?: string;

  /**
   * Specialty.
   */
  speicalyt?: number;

  /**
   * Business stage.
   */
  stage?: number;

  /**
   * State ID.
   */
  state?: number;

  /**
   * City.
   */
  city?: number;

  /**
   * Billable.
   */
  is_billable?: boolean;

  /**
   * Fee Type.
   */
  fee_type?: number;

  /**
   * Rate.
   */
  rate?: number;

  /**
   * Currency.
   */
  currency: number;

  /**
   * Fee note.
   */
  fee_note?: string;

  /**
   * Shared with.
   */
  shared_with?: [];

  /**
   * Attachments.
   */
  esign_documents?: [];
}
