import React, { useState } from "react";
import { Dropdown, User } from "components";
import ActionIcon from "assets/icons/action_gray.svg";
import FolderIcon from "assets/icons/folder.svg";
import DocumentIcon from "assets/icons/document.svg";
import { useModal } from "hooks";
import { format } from "date-fns";
import filesize from "filesize";
import { getUserName, isValidEditFileType } from "helpers";
import { DocumentDetailModal, DeleteDocumentModal, DocumentEditModal } from "modals";
import { remove } from "lodash";
import {useContextSubscriptionAccess} from "contexts";
import "./style.scss";

interface Props {
  data: any;
  onFolderClick?(params): void;
  onUpdate?(): void;
}
export default function TableRow({
  data,
  onFolderClick = () => { },
  onUpdate = () => { },
}: Props) {

  let folderActions = [
    {
      label: "Share",
      action: "share",
    },
    {
      label: "Rename Folder",
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
      label: "Rename Document",
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
  const detailModal = useModal();
  const deleteModal = useModal();
  const editModal = useModal();
  const [isRenameFolder, setIsRenameFolder] = useState(false);
  const {hasSubscription} = useContextSubscriptionAccess();
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



  const dropdownMenuList = () => {

    if (!hasSubscription) {
      folderActions = remove (folderActions, (item) => {
        return item.action === "download" || item.action === "view"
      })
      fileActions = remove (fileActions, (item) => {
        return item.action === "download" || item.action === "view"
      })
    }

    return data?.type === "Document"
      ? isValidEditFileType(data?.title) ? fileActions : remove(fileActions, (n) => { return n.action !== 'edit' })
      : folderActions;
  }

  return (
    <div className="templates-page__table-row">
      <div className="templates-page__table-row-item document-name">
        <img
          src={data?.type === "Folder" ? FolderIcon : DocumentIcon}
          alt="folder"
          className="mr-1 my-auto"
        />
        <span className="mr-1 text-ellipsis" onClick={handleNameClick}>
          {data?.title}
        </span>
        {
          data?.type !== "Folder" && data?.size &&
          <div className="file-size ml-1 my-auto">({filesize(data.size)})</div>
        }
      </div>
      <div className="templates-page__table-row-item">
        <User
          avatar={data?.owner_data?.avatar}
          userName={getUserName(data?.owner_data)}
        />
      </div>
      <div className="my-documents-page__table-row-item">
        {data?.modified && (
          <span>
            {data?.modified
              ? format(new Date(data?.modified), "hh:mm a,  MM/dd/yyyy")
              : ""}
          </span>
        )}
      </div>
      <div className="templates-page__table-row-item">
        <Dropdown
          data={dropdownMenuList()}
          onActionClick={handleActionClick}
          className="mx-auto"
        >
          <img
            src={ActionIcon}
            alt="action"
            className="templates-page__table-row-item-action"
          />
        </Dropdown>
      </div>
      {
        detailModal?.open &&
        <DocumentDetailModal
          {...detailModal}
          data={data}
          rename={isRenameFolder}
          renamable={true}
          type="template"
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
