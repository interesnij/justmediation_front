import React, { useState } from "react";
import { Dropdown, User } from "components";
import ActionIcon from "assets/icons/action_gray.svg";
import FolderIcon from "assets/icons/folder.svg";
import DocumentIcon from "assets/icons/document.svg";
import { format } from "date-fns";
import { getUserName, isValidEditFileType } from "helpers";
import { duplicateDocument } from "api";
import { DocumentDetailModal, DeleteDocumentModal, DocumentEditModal } from "modals";
import { useModal } from "hooks";
import filesize from "filesize";
import { remove } from "lodash";
import "./style.scss";

interface Props {
  data: any;
  onFolderClick?(params): void;
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
  const folderActions = [
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
  const fileActions = [
    {
      label: "Rename Document",
      action: "rename",
    },
    {
      label: "Download",
      action: "download",
    },
    {
      label: "Edit",
      action: "edit",
    },
    {
      label: "Duplicate",
      action: "duplicate",
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
      case "duplicate":
        await duplicateDocument(data?.id, {
          title: data?.title,
          parent: data?.parent,
        });
        onUpdate();
        break;
      case "edit":
        editModal.setOpen(true);
        break;
      default:
        break;
    }
  };
  return (
    <div className="my-vault-page__table-row">
      <div className="my-vault-page__table-row-item document-name">
        <img
          src={data?.type === "Folder" ? FolderIcon : DocumentIcon}
          alt="folder"
          className="mr-1 my-auto"
        />
        <span className="mr-1 text-ellipsis" onClick={handleNameClick}>
          {data?.title}
        </span>
        {data?.size && (
          <div className="file-size ml-1 my-auto">({filesize(data.size)})</div>
        )}
      </div>
      <div className="my-vault-page__table-row-item">
        {data?.modified && (
          <span>
            {data?.modified
              ? format(new Date(data?.modified), "MM/dd/yyyy")
              : ""}{" "}
          </span>
        )}
      </div>
      <div className="my-vault-page__table-row-item">
      <Dropdown
          data={data?.type === "Document" ? isValidEditFileType(data?.title) ? fileActions : remove(fileActions, (n) =>{ return n.action !== 'edit' }) : folderActions}
          className="mx-auto"
          onActionClick={handleActionClick}
        >
          <img
            src={ActionIcon}
            alt="action"
            className="my-documents-page__table-row-item-action"
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
          onUpdate={onUpdate}
          isVault
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
