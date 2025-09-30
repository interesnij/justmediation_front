import React from "react";
import { Modal, Button, Attachment } from "components";
import { NewMatterNoteModal } from "modals";
import { useModal } from "hooks";
import "./style.scss";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onUpdate?(): void;
  data?: any;
}

export const EditNoteModal = ({
  open,
  setOpen,
  data,
  onUpdate = () => {},
}: Props) => {
  const editModal = useModal();
  const handleEdit = () => {
    editModal.setOpen(true);
  };

  return (
    <Modal
      title={data?.title}
      open={open}
      setOpen={(param) => {
        setOpen(param);
      }}
    >
      <div className="new-message-modal">
        <div className="mb-3">{data?.text}</div>
        <div className="d-flex flex-wrap">
          {data?.attachments &&
            data.attachments.map((item, index) => (
              <Attachment name={item?.file_name} size={item?.file_size} key={index}/>
            ))}
        </div>
        <div className="d-flex mt-4">
          <Button
            className="ml-auto"
            buttonType="submit"
            size="large"
            onClick={handleEdit}
          >
            Edit
          </Button>
        </div>
      </div>
      {
        editModal?.open &&
        <NewMatterNoteModal {...editModal} data={data} onCreate={onUpdate} />
      }
    </Modal>
  );
};
