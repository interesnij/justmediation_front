interface MatterData {
  /** Id */
  id: number;
  /** Code */
  code: string;
  /** Title */
  title: string;
  /** Description */
  description: string;
}

/** Activity model. */
export interface Activity {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Matter */
  matter: number;
  /** Matter data */
  matterData: MatterData;
  /** Created */
  created: string;
  /** Modified */
  modified: string;
}
