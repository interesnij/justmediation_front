/** News model. */
export interface News {
  /** ID. */
  id: number;
  /** Title. */
  title: string;
  /** Description. */
  description: string;
  /** Image. */
  image: string;
  /** Image thumbnail. */
  thumbnail: string;
  /** Tags. */
  tags: string[];
  /** Categories. */
  categories: string[];
  /** Created. */
  created: Date;
  /** Modified. */
  modified: Date;
}
