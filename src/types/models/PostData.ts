interface PostAuthor {
  /** Author id. */
  id?: number;
  /** Name. */
  name: string;
  /** Avatar. */
  avatar?: string;
  /** Specialties. */
  specialties?: string[];
}

/**
 * Data to display in 'jlat-post-list-item' component.
 */
export interface PostData {
  /** ID. */
  id: number;
  /** Title. */
  title: string;
  /** Creation date. */
  created: Date;
  /** Content. It's used as [innerHtml] value. */
  content: string;
  /** Image url. */
  image: string;
  /** Author. */
  author: PostAuthor;
}
