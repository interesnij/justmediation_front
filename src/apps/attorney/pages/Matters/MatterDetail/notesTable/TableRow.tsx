import React from "react";
import { Dropdown, Attachment } from "components";
import ActionIcon from "assets/icons/action_gray.svg";
import { format } from "date-fns";
import { deleteMatterNote } from "api";
import { useModal } from "hooks";
import { EditNoteModal, NewMatterNoteModal } from "modals";

const rowActions = [
  {
    label: "Edit",
    action: "edit",
  },
  {
    label: "Delete",
    action: "delete",
  },
];
interface Props {
  data: any;
  onUpdate?(): void;
}
export default function TableRow({ data, onUpdate = () => {} }: Props) {
  const editModal = useModal();
  const noteModal = useModal();

  const handleActionClick = async (params) => {
    switch (params) {
      case "edit":
        noteModal.setOpen(true);
        break;
      case "delete":
        await deleteMatterNote(data?.id);
        onUpdate();
        break;
      default:
        break;
    }
  };

  const handleClick = () => {
    editModal.setOpen(true);
  };

  return (
    <div className="client-matter-message-page__table-row">
      <div className="client-matter-message-page__table-row-item">
        <span className="text-ellipsis cursor-pointer" onClick={handleClick}>
          {data?.title}
        </span>
      </div>
      <div className="client-matter-message-page__table-row-item">
        <span className="text-ellipsis cursor-pointer" onClick={handleClick}>
          {" "}
          {data?.text}
        </span>
      </div>
      <div className="client-matter-message-page__table-row-item d-flex">
        {data?.attachments_data.slice(0, 2).map((attachment, index) => (
          <Attachment
            name={attachment?.file_name}
            size={attachment?.file_size}
            key={`${index}key`}
          />
        ))}
        {data?.attachments_data.length > 2 && (
          <span className="font-size-md">
            +{data?.attachments_data.length - 2}
          </span>
        )}
      </div>
      <div className="client-matter-message-page__table-row-item">
        <span>
          {" "}
          {data?.created
            ? format(new Date(data.created), "MM/dd/yyyy hh:mm:ss a")
            : ""}
        </span>
      </div>
      <div className="client-matter-message-page__table-row-item">
        <Dropdown
          data={rowActions}
          onActionClick={handleActionClick}
          className="mx-auto"
        >
          <img
            src={ActionIcon}
            alt="action"
            className="client-matter-message-page__table-row-item-action"
          />
        </Dropdown>
      </div>
      {
        editModal?.open &&
        <EditNoteModal
          {...editModal}
          data={{
            id: data?.id,
            matter: data?.id,
            text: data?.text,
            title: data?.title,
            attachments: data?.attachments_data,
          }}
          onUpdate={onUpdate}
        />
      }
      {
        noteModal?.open &&
        <NewMatterNoteModal
          {...noteModal}
          data={{
            id: data?.id,
            matter: data?.id,
            text: data?.text,
            title: data?.title,
            attachments: data?.attachments_data,
          }}
          onCreate={onUpdate}
        />
      }
    </div>
  );
}
