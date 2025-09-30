/**
 * E-sign document.
 */
export interface ESignDocument {
  /**
   * ID.
   */
  id: number;

  /**
   * Document name.
   */
  name: string;

  /**
   * Url to document file.
   */
  fileUrl: string;

  /**
   * Order to display
   */
  order: number;
}
