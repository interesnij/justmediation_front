import React, { useState } from "react";
import { Dropdown, User } from "components";
import ActionIcon from "assets/icons/action_gray.svg";
import { format } from "date-fns";
import { useModal } from "hooks";
import filesize from "filesize";
import { remove, without } from "lodash";
import { getUserName, isValidEditFileType } from "helpers";
import FolderIcon from "assets/icons/folder.svg";
import DocumentIcon from "assets/icons/document.svg";
import GroupIcon from "assets/icons/group.svg";
import {
  DocumentDetailModal,
  DeleteDocumentModal,
  DocumentEditModal,
} from "modals";
import {useAuthContext, useContextSubscriptionAccess} from "contexts";
import "./style.scss";

interface Props {
  data: any;
  onFolderClick?(params: any): void;
  onUpdate?(): void;
}
export default function TableRow({
  data,
  onFolderClick = () => {},
  onUpdate = () => {},
}: Props) {
  const detailModal = useModal();
  const deleteModal = useModal();
  const editModal = useModal();
  const [isRenameFolder, setIsRenameFolder] = useState(false);
  const { userId } = useAuthContext();
  const { hasSubscription } = useContextSubscriptionAccess();
  let folderActions = [
    {
      label: "Share",
      action: "share",
    },
    {
      label: `Rename ${data?.type}`,
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
      label: "E-sign",
      action: "sign",
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
  const handleActionClick = async (params) => {
    switch (params) {
      case "share":
        setIsRenameFolder(false);
        detailModal.setOpen(true);
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
      case "sign":
        window.open("https://account.docusign.com/", "_blank");
        break;
      case "download":
        if (data?.type === "Document") {
          window.open(data?.file);
        }
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

    if(!hasSubscription) {
      folderActions = remove(folderActions, (n) =>{ return n.action === 'download' || n.action === 'view' });
      fileActions = remove(fileActions, (n) =>{ return n.action === 'download' || n.action === 'view' });
    }

    return data?.type === "Document" ? isValidEditFileType(data?.title) ? fileActions : remove(fileActions, (n) =>{ return n.action !== 'edit' }) : folderActions
  }
  const shared_with = data?.shared_with?.length > 0 ? without(data.shared_with, data?.client, data?.owner) : [];
  return (
    <div className="lead-matter-document-table-row">
      <div className="lead-matter-document-table-row-item">
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
          className="text-ellipsis cursor-pointer"
          onClick={handleNameClick}
        >
          {data?.title}
        </span>
        {
          data?.type !== "Folder" && data?.size &&
          <div className="file-size ml-1 my-auto">({filesize(data.size)})</div>
        }
      </div>
      <div className="lead-matter-document-table-row-item">
        <span className="my-auto">{data?.matter_data?.title}</span>
      </div>
      <div className="lead-matter-document-table-row-item">
        <User
          avatar={data?.owner_data?.avatar}
          userName={getUserName(data?.owner_data)}
        />
      </div>
      <div className="lead-matter-document-table-row-item">
        {data?.modified && (
          <span>
          {data?.modified
            ? format(new Date(data?.modified), "MM/dd/yyyy")
            : ""}{" "}
          by {getUserName(data?.owner_data)}
        </span>
        )}
      </div>
      <div className="lead-matter-document-table-row-item">
        <Dropdown
          data={dropDownMenu()}
          className="mx-auto"
          onActionClick={handleActionClick}
        >
          <img
            src={ActionIcon}
            alt="action"
            className="lead-matter-document-table-row-item-action"
          />
        </Dropdown>
      </div>
      {
        detailModal?.open &&
        <DocumentDetailModal
          {...detailModal}
          data={data}
          rename={isRenameFolder}
          renamable={data.owner === +userId}
          onUpdate={onUpdate}
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
