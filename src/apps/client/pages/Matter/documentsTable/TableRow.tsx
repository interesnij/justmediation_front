import React, { useState } from "react";
import { Dropdown, User } from "components";
import ActionIcon from "assets/icons/action_gray.svg";
import { format } from "date-fns";
import { useModal } from "hooks";
import FolderIcon from "assets/icons/folder.svg";
import DocumentIcon from "assets/icons/document.svg";
import GroupIcon from "assets/icons/group.svg";
import filesize from "filesize";
import { getUserName, isValidEditFileType } from "helpers";
import { DocumentDetailModal, DeleteDocumentModal, DocumentEditModal } from "modals";
import { useAuthContext } from "contexts";
import { remove, without } from "lodash";
import "./style.scss";

interface Props {
  data: any;
  onFolderClick?(params: any): void;
  onUpdate?(): void;
}
export default function TableRow({
  data,
  onFolderClick = () => { },
  onUpdate = () => { },
}: Props) {
  const detailModal = useModal();
  const deleteModal = useModal();
  const editModal = useModal();
  const [isRenameFolder, setIsRenameFolder] = useState(false);
  const { userId } = useAuthContext();
  
  let folderActions = [
    {
      label: "Share",
      action: "share",
    },
    {
      label: `Rename Folder`,
      action: "rename",
    },
    {
      label: "Delete",
      action: "delete",
    },
    {
      label: "View Details",
      action: "view",
    },
  ];
  let fileActions = [
    {
      label: "Download",
      action: "download",
    },
    {
      label: "Share",
      action: "share",
    },
    {
      label: `Rename Document`,
      action: "rename",
    },
    {
      label: "Edit",
      action: "edit",
    },
    {
      label: "Delete",
      action: "delete",
    },
    {
      label: "View Details",
      action: "view",
    },
  ];

  const handleNameClick = () => {
    if (data?.type === "Folder") {
      onFolderClick({ id: data?.id, title: data?.title });
    }
  };
  const handleActionClick = (params) => {
    switch (params) {
      case "share":
        setIsRenameFolder(false);
        detailModal.setOpen(true);
        break;
      case "download":
        if (data?.type === "Document") {
          window.open(data?.file);
        }
        break;
      case "rename":
        setIsRenameFolder(true);
        detailModal.setOpen(true);
        break;
      case "delete":
        setIsRenameFolder(false);
        deleteModal.setOpen(true);
        break;
      case "view":
        setIsRenameFolder(false);
        detailModal.setOpen(true);
        break;
      case "edit":
        editModal.setOpen(true);
        break;
      default:
        break;
    }
  };
  const dropDownMenu = () => {
    if (data.owner !== +userId){ // I can only delete the Document uploaded by myself,  I can only rename the Document uploaded by myself.  #434
      folderActions = remove(folderActions, (n) =>{ return n.action !== 'delete' && n.action !== 'rename' });
      fileActions = remove(fileActions, (n) =>{ return n.action !== 'delete' });
    }
    return data?.type === "Document" ? isValidEditFileType(data?.title) ? fileActions : remove(fileActions, (n) =>{ return n.action !== 'edit' }) : folderActions
  }
  const shared_with = data?.shared_with?.length > 0 ? without(data.shared_with, data?.client, data?.owner) : [];
  return (
    <div className="matter-document-table-row">
      <div className="matter-document-table-row-item document-name">
        <img
          src={data?.type === "Folder" ? FolderIcon : DocumentIcon}
          alt="folder"
          className="mr-1 my-auto"
        />
        {
          shared_with.length > 0 &&
          <img
            src={GroupIcon}
            alt="share"
            className="mr-1 my-auto"
          />
        }
        <span
          className="mr-1 text-ellipsis"
          onClick={handleNameClick}
        >
          {data?.title}
        </span>
        {
          data?.type !== "Folder" && data?.size &&
          <div className="file-size ml-1 my-auto">({filesize(data.size)})</div>
        }
      </div>

      <div className="matter-document-table-row-item">
        <User
          avatar={data?.owner_data?.avatar}
          userName={getUserName(data?.owner_data)}
        />
      </div>
      <div className="matter-document-table-row-item">
        {data?.modified && (
          <span>
            {data?.modified
              ? format(new Date(data?.modified), "MM/dd/yyyy")
              : ""}{" "}
            by {getUserName(data?.owner_data)}
          </span>
        )}
      </div>
      <div className="matter-document-table-row-item">
        <Dropdown
          data={dropDownMenu()}
          onActionClick={handleActionClick}
          className="mx-auto"
        >
          <img
            src={ActionIcon}
            alt="action"
            className="matter-document-table-row-item-action"
          />
        </Dropdown>
      </div>
      {
        detailModal?.open &&
        <DocumentDetailModal
          rename={isRenameFolder}
          {...detailModal}
          data={data}
          onUpdate={onUpdate}
          renamable={data.owner === +userId}
        />
      }
      {
        editModal?.open &&
        <DocumentEditModal
          {...editModal}
          url={data.file}
          id={data.id}
          name={data.title}
          onUpdate={onUpdate}
        />
      }
      {
        deleteModal?.open &&
        <DeleteDocumentModal {...deleteModal} data={data} onOk={onUpdate} />
      }
    </div>
  );
}
