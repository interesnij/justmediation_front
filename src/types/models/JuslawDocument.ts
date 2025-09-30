import { Author, DocumentAction, Matter } from "./";
import { JuslawDocumentType } from "../enum/";

export const FOLDER_TYPES: JuslawDocumentType[] = [
  JuslawDocumentType.Folder,
  JuslawDocumentType.SharedFolder,
  JuslawDocumentType.GlobalTemplateFolder,
  JuslawDocumentType.TemplateFolder,
];

/** Document model. */
export interface JuslawDocument {
  /** Document id. */
  readonly id: number;
  /** Parent node id. */
  readonly parent: number;
  /** Owner. */
  readonly owner: Author;
  /** Matter. */
  readonly matter: Matter;
  /** Document title. */
  readonly title: string;
  /** Document type. */
  readonly type: JuslawDocumentType;
  /** File url. */
  readonly file: string;
  /** Creator. */
  readonly createdBy: Author;
  /** Date of creation. */
  readonly created: Date;
  /** Date of last change. */
  readonly modified: Date;
  /** Document icon url. */
  readonly icon: string;
  /** Is document readonly. */
  readonly isReadonly: boolean;
  /** Available actions for the document. */
  readonly actions: DocumentAction[];
}
