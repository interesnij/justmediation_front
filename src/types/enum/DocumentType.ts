/** Document type. */
export enum JuslawDocumentType {
  /** Folder. */
  Folder = "Folder",
  /** Document. */
  Document = "Document",
  /** Shared folder. */
  SharedFolder = "SharedFolder",
  /** Template document. */
  TemplateDocument = "TemplateDocument",
  /** Template folder. */
  GlobalTemplateFolder = "TemplateFolder",
  /** Template folder created by user. */
  TemplateFolder = "EditableTemplateFolder",
  /** Unsupported type of file. */
  Unsupported = "Unsupported",
}

/** Actions available for folders. */
export enum FolderAction {
  /** Rename document. */
  Rename = "RenameFolder",
  /** Delete document. */
  Delete = "DeleteFolder",
  /** Create a folder inside another. */
  CreateFolderInside = "CreateFolder",
}

/** Available actions for files. */
export enum FileAction {
  /** Download document. */
  Download = "DownloadFile",
  /** Copy document. */
  Copy = "CopyFile",
  /** Delete document. */
  Delete = "DeleteFile",
  /** Edit document. */
  Edit = "EditFile",
}
