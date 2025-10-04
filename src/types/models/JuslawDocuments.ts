import { JuslawDocumentType, Role, FileAction, FolderAction } from "../enum";

/** Document action type. */
export type DocumentAction = FileAction | FolderAction;

type SpecifyActionFor<Type> = Type extends JuslawDocumentType.Document
  ? FileAction
  : Type extends JuslawDocumentType.TemplateDocument
  ? FileAction
  : FolderAction;

/** Available document permissions. */
enum DocumentPermissions {
  /** Default. */
  Default = "Default",
  /** Readonly. */
  Readonly = "Readonly",
}

type DocumentActionsByType = {
  [P in DocumentPermissions]: {
    [T in JuslawDocumentType]: SpecifyActionFor<T>[];
  };
};

type RolesWithDocumentPermissions = Exclude<Role, Role.Unauthorized>;

type DocumentActionsForRole = Record<
  RolesWithDocumentPermissions,
  DocumentActionsByType
>;

const MEDIATOR_DOCUMENT_RULES: DocumentActionsByType = {
  Default: {
    Document: [
      FileAction.Download,
      FileAction.Copy,
      FileAction.Delete,
      FileAction.Edit,
    ],
    Folder: [
      FolderAction.CreateFolderInside,
      FolderAction.Rename,
      FolderAction.Delete,
    ],
    SharedFolder: [],
    EditableTemplateFolder: [
      FolderAction.CreateFolderInside,
      FolderAction.Rename,
      FolderAction.Delete,
    ],
    TemplateFolder: [FolderAction.CreateFolderInside],
    TemplateDocument: [FileAction.Download, FileAction.Edit],
    Unsupported: [],
  },
  Readonly: {
    Document: [FileAction.Download],
    Folder: [],
    SharedFolder: [],
    TemplateFolder: [],
    TemplateDocument: [FileAction.Download],
    EditableTemplateFolder: [],
    Unsupported: [],
  },
};

export const DOCUMENT_RULES: DocumentActionsForRole = {
  [Role.Mediator]: {
    ...MEDIATOR_DOCUMENT_RULES,
  },
  [Role.Staff]: {
    ...MEDIATOR_DOCUMENT_RULES,
  },
  [Role.Client]: {
    Default: {
      Document: [FileAction.Download, FileAction.Delete],
      Folder: [],
      SharedFolder: [],
      TemplateFolder: [],
      TemplateDocument: [],
      Unsupported: [],
      EditableTemplateFolder: [],
    },
    Readonly: {
      Document: [FileAction.Download],
      Folder: [],
      SharedFolder: [],
      TemplateFolder: [],
      TemplateDocument: [],
      Unsupported: [],
      EditableTemplateFolder: [],
    },
  },
};

export const READABLE_ACTION: Record<DocumentAction, string> = {
  [FileAction.Copy]: "Copy",
  [FileAction.Edit]: "Edit",
  [FileAction.Delete]: "Delete",
  [FileAction.Download]: "Download / View",
  [FolderAction.Delete]: "Delete",
  [FolderAction.CreateFolderInside]: "Create Folder",
  [FolderAction.Rename]: "Rename",
};
