/**
 * JusLaw file object.
 */
export interface JusLawFile<FileType = File | string> {
  /**
   * Name of file.
   */
  name: string;
  /**
   * File object or URL to a file.
   */
  file: FileType;
}
