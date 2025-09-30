import { ESignDocument } from "./EsignDocument";

/**
 * E-sign envelop of documents.
 */
export interface ESignEnvelop {
  /**
   * ID.
   */
  id: number;
  /**
   * ID in Docusign system.
   */
  docusignId: string;
  /**
   * Associated matter ID.
   */
  matterId: number;
  /**
   * Status.
   */
  status:
    | "created"
    | "sent"
    | "delivered"
    | "signed"
    | "completed"
    | "declined"
    | "voided";
  /**
   * Type.
   */
  type: "initial" | "extra";
  /**
   * Documents of envelop.
   */
  documents: ESignDocument[];

  /**
   * Edit link.
   */
  editLink?: string;
}
