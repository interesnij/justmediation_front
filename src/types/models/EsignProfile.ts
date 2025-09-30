/** User profile for electronic signification system */
export interface ESignProfile {
  /** Id of a user in DocuSign system (GUID) needed for impersonalization purpose */
  docusignId: number;
  /** Has consent to impersonate requests to ESign platform */
  hasConsent: boolean;
  /** Link to obtain consent if it hasn't got yet */
  obtainConsentLink: string;
}
